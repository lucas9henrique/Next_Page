from fastapi import FastAPI

app = FastAPI(title="Next_Page API")

@app.get("/")
def read_root():
    return {"message": "Welcome to Next_Page API"}
