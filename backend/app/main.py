from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .model import classifier
from .data import (
    PAPERS,
    get_classes,
    get_paper,
    search_papers
)


app = FastAPI(
    title="ClassiPaws API",
    description="🐾 Research paper classification API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://classi-paws-ar-xiv.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):

    title: str = Field(
        default="",
        max_length=1000
    )

    abstract: str = Field(
        default="",
        max_length=20000
    )


@app.get("/")
def root():

    return {
        "message": "🐾 Welcome to ClassiPaws API!",
        "status": "online"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model": "Logistic Regression",
        "representation": classifier.representation
    }


@app.get("/classes")
def classes():

    return {
        "classes": get_classes()
    }


@app.get("/stats")
def stats():

    class_counts = {}

    for paper in PAPERS:

        label = paper.get(
            "target_classname",
            "unknown"
        )

        class_counts[label] = (
            class_counts.get(label, 0) + 1
        )

    return {
        "total_papers": len(PAPERS),
        "total_classes": len(class_counts),
        "class_counts": class_counts
    }


@app.get("/models")
def models():

    return {
        "models": [
            {
                "name": "Logistic Regression",
                "representation": classifier.representation,
                "accuracy": classifier.accuracy,
                "macro_f1": classifier.macro_f1,
                "configuration": classifier.configuration,
                "status": "active"
            }
        ]
    }


@app.get("/papers")
def papers(
    q: str = "",
    target_class: str = "",
    limit: int = 20
):

    if limit < 1:
        limit = 1

    if limit > 100:
        limit = 100

    results = search_papers(
        query=q,
        target_class=target_class,
        limit=limit
    )

    return {
        "count": len(results),
        "papers": results
    }


@app.get("/papers/{paper_id:path}")
def paper(
    paper_id: str
):

    result = get_paper(
        paper_id
    )

    if result is None:

        raise HTTPException(
            status_code=404,
            detail="Paper not found"
        )

    return result


@app.post("/predict")
def predict(
    request: PredictionRequest
):

    title = request.title.strip()
    abstract = request.abstract.strip()

    if not title and not abstract:

        raise HTTPException(
            status_code=400,
            detail="Please provide a title or abstract."
        )

    result = classifier.predict(
        title=title,
        abstract=abstract
    )

    return {
        "title": title,
        "abstract": abstract,
        "prediction": result
    }