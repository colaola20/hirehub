from app import create_app, db
import os

app = create_app()

@app.before_first_request
def create_tables():
    db.create_all()

