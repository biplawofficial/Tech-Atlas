import os
import json
import joblib
import redis
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Movie Review Sentiment API")
model = joblib.load("model.pkl")

# "redis" is the service name in docker-compose.yml; DNS magic resolves it.
r = redis.Redis(
    host=os.getenv("REDIS_HOST", "redis"),
    port=6379,
    decode_responses=True,
)

class Review(BaseModel):
    text: str

@app.get("/health")
def health():
    try:
        r.ping()
        redis_ok = True
    except Exception:
        redis_ok = False
    return {"status": "ok", "redis": redis_ok}

@app.post("/predict")
def predict(review: Review):
    cache_key = f"pred:{review.text}"

    # Try cache first
    cached = r.get(cache_key)
    if cached:
        result = json.loads(cached)
        result["cached"] = True
        return result

    # Cache miss → run the model
    proba = model.predict_proba([review.text])[0]
    label = "positive" if proba[1] >= 0.5 else "negative"
    result = {
        "text": review.text,
        "sentiment": label,
        "confidence": round(float(max(proba)), 4),
        "cached": False,
    }

    # Store with 1-hour TTL
    r.setex(cache_key, 3600, json.dumps(result))
    return result
