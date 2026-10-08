from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CaseCreate(BaseModel):
    policyholder_name: str
    policyholder_phone: str
    insured_pet_name: Optional[str] = None
    insured_pet_type: str = "Dog"
    insured_pet_breed: Optional[str] = None

class ClaimCreate(BaseModel):
    case_id: int
    claim_amount: float
    diagnosis: Optional[str] = None
    treatment_date: Optional[str] = None

class ClaimResponse(BaseModel):
    id: int
    case_id: int
    claim_amount: float
    diagnosis: Optional[str] = None
    approval_status: str
    created_at: datetime

    class Config:
        from_attributes = True