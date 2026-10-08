from faker import Faker
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import models  # 確保與你的 models.py 在同一資料夾
import random

# 1. 初始化設定
fake = Faker('en_US')

# 2. 定義品種資料
dog_breeds = ['Golden Retriever', 'Labrador Retriever', 'German Shepherd', 'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Dachshund', 'Siberian Husky', 'Great Dane', 'Doberman Pinscher', 'Australian Shepherd', 'Shih Tzu', 'Miniature Schnauzer', 'Chihuahua', 'Pembroke Welsh Corgi', 'Cavalier King Charles Spaniel', 'Border Collie']
cat_breeds = ['Maine Coon', 'Persian', 'Siamese', 'Ragdoll', 'Bengal', 'Abyssinian', 'British Shorthair', 'Sphynx', 'Scottish Fold', 'Russian Blue', 'Birman', 'Devon Rex', 'Oriental Shorthair', 'American Shorthair', 'Norwegian Forest Cat', 'Egyptian Mau', 'Bombay', 'Cornish Rex', 'Ragamuffin', 'Somali']

# 3. 輔助函式：確保種類與品種匹配
def get_random_pet():
    species = random.choice(['Dog', 'Cat'])
    if species == 'Dog':
        return 'Dog', random.choice(dog_breeds)
    else:
        return 'Cat', random.choice(cat_breeds)

# 4. 主生成函式
def generate_seed_data(count=200):
    # 資料庫連線設定
    DATABASE_URL = "postgresql://min-shan:1234@localhost/pet_insurance"
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    data = []
    
    print(f"開始產生 {count} 筆測試資料...")
    
    for _ in range(count):
        # 取得隨機寵物資訊
        pet_type, pet_breed = get_random_pet()
        
        # 建立物件 (請確認這裡的欄位名稱與 models.py 定義完全一致)
        case = models.InsuranceCase(
            policyholder_name=fake.name(),
            policyholder_phone=fake.phone_number(),
            insured_pet_name=fake.first_name(),
            insured_pet_type=pet_type,      # 明確寫入種類
            insured_pet_breed=pet_breed,    # 明確寫入品種
            status=random.choice(['Pending', 'Approved', 'Rejected']) # 建議與前端 Filter 保持一致
        )
        data.append(case)
    
    # 批次寫入資料庫
    try:
        session.bulk_save_objects(data)
        session.commit()
        print(f"Successfully imported {count} counts of data！")
    except Exception as e:
        session.rollback()
        print(f"Failed: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    generate_seed_data()