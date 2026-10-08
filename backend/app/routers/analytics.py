import io
import pandas as pd
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app import models
from app.services.data_engine import DataEngineService

router = APIRouter(tags=["Analytics"])

@router.get("/analytics/summary")
def get_analytics(db: Session = Depends(get_db)):
    total_policies = db.query(models.InsuranceCase).count()
    
    total_claim_amount = (
        db.query(func.sum(models.Claim.claim_amount))
        .filter(func.lower(models.Claim.approval_status) == 'approved')
        .scalar() or 0
    )
    
    type_stats = db.query(
        models.InsuranceCase.insured_pet_type, 
        func.count(models.InsuranceCase.id)
    ).group_by(models.InsuranceCase.insured_pet_type).all()
    
    diagnosis_stats = (
        db.query(
            models.Claim.diagnosis, 
            func.sum(models.Claim.claim_amount)
        )
        .filter(func.lower(models.Claim.approval_status) == 'approved')
        .group_by(models.Claim.diagnosis)
        .limit(5)
        .all()
    )

    return {
        "total_policies": total_policies,
        "total_claim_amount": total_claim_amount,
        "pet_type_distribution": [{"name": t[0], "value": t[1]} for t in type_stats],
        "diagnosis_impact": [{"name": d[0] if d[0] else "Unknown", "amount": d[1]} for d in diagnosis_stats]
    }

@router.post("/analyze-data")
async def analyze_data(pet_file: UploadFile = File(...), claim_file: UploadFile = File(...)):
    return await DataEngineService.process_risk_analysis(pet_file, claim_file)

@router.post("/upload-pet")
async def upload_pet(file: UploadFile = File(...)):
    df = pd.read_csv(io.BytesIO(await file.read()))
    df = DataEngineService.clean_and_map_columns(df)
    
    if 'species' not in df.columns or 'breed' not in df.columns:
        return {"error": "Missing Columns", "columns": df.columns.tolist()}
    
    return {"message": "Pet data uploaded successfully"}

@router.post("/upload-claim")
async def upload_claim(file: UploadFile = File(...)):
    df = pd.read_csv(io.BytesIO(await file.read()))
    df = DataEngineService.clean_and_map_columns(df)
    
    if 'amountclaimed' not in df.columns:
        return {"error": "Missing Columns", "columns": df.columns.tolist()}
    
    return {"message": "Claim data uploaded successfully"}