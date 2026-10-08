from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/cases", tags=["Cases"])

@router.get("")
def get_all_cases(db: Session = Depends(get_db)):
    cases = db.query(models.InsuranceCase).all()
    return cases

@router.post("")
def create_case(case_data: schemas.CaseCreate, db: Session = Depends(get_db)):
    new_case = models.InsuranceCase(
        policyholder_name=case_data.policyholder_name,
        policyholder_phone=case_data.policyholder_phone,
        insured_pet_name=case_data.insured_pet_name,
        insured_pet_type=case_data.insured_pet_type,
        insured_pet_breed=case_data.insured_pet_breed
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)
    return {"message": "案件建立成功", "case_id": new_case.id}

@router.patch("/{case_id}/approve")
def approve_case(case_id: int, db: Session = Depends(get_db)):
    target_case = db.query(models.InsuranceCase).filter(models.InsuranceCase.id == case_id).first()
    if not target_case:
        raise HTTPException(status_code=404, detail="找不到案件")
    
    target_case.status = "Approved" 
    db.commit()
    return {"message": "核保成功，已轉入正式保單"}

@router.get("/{case_id}/claims")
def get_claims_for_case(case_id: int, db: Session = Depends(get_db)):
    claims = db.query(models.Claim).filter(models.Claim.case_id == case_id).all()
    return claims