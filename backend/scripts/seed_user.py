from sqlalchemy.orm import Session
from app.database.session import SessionLocal, engine
from app.database.base import Base
from app.models.user import User
from app.core.security import get_password_hash

def seed_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "admin@example.com").first()
        if not user:
            print("Creating seed user...")
            new_user = User(
                email="admin@example.com",
                hashed_password=get_password_hash("password123"),
                full_name="Kiran Sindagi",
                role="admin"
            )
            db.add(new_user)
            db.commit()
            print("Seed user created: admin@example.com / password123")
        else:
            print("Seed user already exists.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
