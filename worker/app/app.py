from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "OK"}

def main() -> None:
    uvicorn.run(app, host="127.0.0.1", port=8001)