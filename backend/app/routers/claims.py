from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app import models, schemas

router = APIRouter(tags=["Claims"])

@router.get("/all_claims")
def get_all_claims(db: Session = Depends(get_db)):
    all_claims = db.query(models.Claim).order_by(models.Claim.created_at.desc()).all()
    return all_claims

@router.post("/claims")
def create_claim(claim_data: schemas.ClaimCreate, db: Session = Depends(get_db)):
    target_case = db.query(models.InsuranceCase).filter(models.InsuranceCase.id == claim_data.case_id).first()
    if not target_case:
        raise HTTPException(status_code=404, detail="No policy found.")

    treatment_dt = None
    if claim_data.treatment_date:
        treatment_dt = datetime.fromisoformat(claim_data.treatment_date.replace('Z', ''))

    new_claim = models.Claim(
        case_id=claim_data.case_id,
        claim_amount=claim_data.claim_amount,
        diagnosis=claim_data.diagnosis,
        treatment_date=treatment_dt
    )

    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)
    return {"message": "Added", "claim_id": new_claim.id}

@router.put("/claims/{claim_id}/approve")
def approve_claim(claim_id: int, db: Session = Depends(get_db)):
    claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim record not found.")

    claim.approval_status = "approved"
    db.commit()
    db.refresh(claim)
    return {"message": "Claim approved successfully", "claim_id": claim.id, "status": claim.approval_status}