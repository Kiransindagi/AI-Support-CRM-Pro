from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.user import Token, UserResponse, UserCreate
from app.core.security import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(User).filter(User.email == form_data.username).first()
    print(f"DEBUG LOGIN - Email: {form_data.username}")
    if user:
        print(f"DEBUG LOGIN - Found User. Stored hash: {user.hashed_password}")
        try:
            is_valid = verify_password(form_data.password, user.hashed_password)
            print(f"DEBUG LOGIN - Verification result: {is_valid}")
        except Exception as e:
            print(f"DEBUG LOGIN - Exception during verification: {e}")
    else:
        print("DEBUG LOGIN - User not found in DB.")

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=UserResponse)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    print(f"DEBUG REGISTER - Created user with hash: {user.hashed_password}")
    
    return user

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
