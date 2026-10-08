import io
import pandas as pd
from fastapi import UploadFile

class DataEngineService:
    
    COLUMN_MAPPING = {
        'petid': ['pet id', 'pet-id', 'id', 'pid', 'petid'],
        'species': ['animal', 'type', 'species'],
        'breed': ['breed', 'dog breed', 'cat breed'],
        'petage': ['age', 'pet age', 'petage'],
        'premium': ['premium', 'monthly premium', 'cost'],
        'deductible': ['deductible', 'deduction'],
        'amountclaimed': ['amountclaimed', 'claim amount', 'claim_amount', 'amount']
    }

    @classmethod
    def clean_and_map_columns(cls, df: pd.DataFrame) -> pd.DataFrame:
        
        df.columns = df.columns.str.strip().str.lower()
        new_cols = {}
        for standard_name, aliases in cls.COLUMN_MAPPING.items():
            for col in df.columns:
                if col in aliases:
                    new_cols[col] = standard_name
        return df.rename(columns=new_cols)

    @classmethod
    async def process_risk_analysis(cls, pet_file: UploadFile, claim_file: UploadFile) -> dict:
        
        pet_df = pd.read_csv(io.BytesIO(await pet_file.read()))
        claim_df = pd.read_csv(io.BytesIO(await claim_file.read()))
        
        
        pet_df = cls.clean_and_map_columns(pet_df)
        claim_df = cls.clean_and_map_columns(claim_df)
        
        
        required_pet = ['petid', 'species', 'breed']
        missing_cols = [col for col in required_pet if col not in pet_df.columns]
        if missing_cols:
            return {
                "error": f"Missing Columns: {missing_cols}",
                "your_csv_columns": pet_df.columns.tolist()
            }
            
        
        merged_df = pd.merge(pet_df, claim_df, on='petid', how='left')
        merged_df['amountclaimed'] = merged_df['amountclaimed'].fillna(0)
        
        
        summary = merged_df.groupby(['breed', 'species']).agg({
            'petid': 'count',
            'amountclaimed': 'sum',
            'premium': 'sum'
        }).reset_index()

        summary.columns = ['breed', 'species', 'petcount', 'amountclaimed', 'premium']
        
        
        summary['lossratio'] = (summary['amountclaimed'] / (summary['premium'] * 12).replace(0, 1) * 100).round(2)
        
        return {"data": summary.to_dict(orient="records")}