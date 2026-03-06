from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading optimized BART-MNLI engine...")
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
print("✅ Engine Online.")

class RequestBody(BaseModel):
    text: str
    labels: list

@app.post("/classify")
async def classify(body: RequestBody):
    try:
        # We add a 'neutral' category internally to catch non-harassment text
        internal_labels = body.labels + ["neutral social media text", "general conversation", "informative text"]
        
        result = classifier(body.text, internal_labels)
        
        # Log for debugging
        print(f"Text snippet: {body.text[:50]}...")
        print(f"Top Result: {result['labels'][0]} ({result['scores'][0]:.2f})")

        return {
            "labels": result["labels"],
            "scores": result["scores"]
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
