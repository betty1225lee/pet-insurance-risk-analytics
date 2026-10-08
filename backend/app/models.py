from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class InsuranceCase(Base):
    __tablename__ = "insurance_cases"

    id = Column(Integer, primary_key=True, index=True)
    policyholder_name = Column(String, nullable=False)
    policyholder_phone = Column(String, nullable=False)
    insured_pet_name = Column(String, nullable=True)
    insured_pet_type = Column(String, default="Dog")
    insured_pet_breed = Column(String)
    status = Column(String, default="Pending")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    claims = relationship("Claim", back_populates="insurance_case", cascade="all, delete-orphan")


class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("insurance_cases.id"), nullable=False)
    claim_amount = Column(Float, nullable=False)
    diagnosis = Column(String, nullable=True)
    treatment_date = Column(DateTime, nullable=True)
    approval_status = Column(String, default="pending")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    insurance_case = relationship("InsuranceCase", back_populates="claims")