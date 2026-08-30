import json
import re
from pathlib import Path

import joblib
import numpy as np

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, f1_score


BASE_DIR = Path(__file__).resolve().parent

DATA_PATH = BASE_DIR / "data" / "papers.json"
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "classifier.joblib"

SEED = 42


def clean_text(text):
    text = str(text)
    text = text.lower()

    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    text = re.sub(r"\$+", " ", text)
    text = re.sub(r"[{}[\]<>]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    return text


def load_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        papers = json.load(f)

    return papers


def main():

    print("=" * 60)
    print("🐾 ClassiPaws Model Training")
    print("=" * 60)

    papers = load_data()

    print(f"Loaded papers: {len(papers)}")

    texts = []
    labels = []

    for paper in papers:

        title = paper.get("title", "")
        abstract = paper.get("abstract", "")
        label = paper.get("target_classname", "")

        combined_text = f"{title} {abstract}"

        texts.append(clean_text(combined_text))
        labels.append(label)

    texts = np.array(texts)
    labels = np.array(labels)

    label_encoder = LabelEncoder()

    y = label_encoder.fit_transform(labels)

    class_names = label_encoder.classes_

    print("\nClasses:")

    for index, name in enumerate(class_names):
        print(f"{index} -> {name}")

    X_train, X_test, y_train, y_test = train_test_split(
        texts,
        y,
        test_size=0.20,
        stratify=y,
        random_state=SEED
    )

    print("\nTraining samples:", len(X_train))
    print("Testing samples:", len(X_test))

    print("\nCreating TF-IDF representation...")

    vectorizer = TfidfVectorizer(
        max_features=50000,
        ngram_range=(1, 2),
        min_df=3,
        max_df=0.95,
        sublinear_tf=True
    )

    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    print("TF-IDF shape:", X_train_tfidf.shape)

    print("\nTraining Logistic Regression...")

    model = LogisticRegression(
        C=4.0,
        solver="saga",
        max_iter=1000,
        class_weight="balanced"
    )

    model.fit(
        X_train_tfidf,
        y_train
    )

    predictions = model.predict(
        X_test_tfidf
    )

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    macro_f1 = f1_score(
        y_test,
        predictions,
        average="macro"
    )

    print("\n" + "=" * 60)
    print("RESULTS")
    print("=" * 60)

    print(f"Accuracy : {accuracy:.4f}")
    print(f"Macro F1 : {macro_f1:.4f}")

    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    artifact = {
        "model": model,
        "vectorizer": vectorizer,
        "label_encoder": label_encoder,
        "class_names": class_names.tolist(),
        "accuracy": float(accuracy),
        "macro_f1": float(macro_f1),
        "representation": "TF-IDF",
        "configuration": {
            "C": 4.0,
            "solver": "saga",
            "max_iter": 1000,
            "class_weight": "balanced"
        }
    }

    joblib.dump(
        artifact,
        MODEL_PATH
    )

    print("\n🐾 Model saved:")
    print(MODEL_PATH)

    print("\nTraining complete!")


if __name__ == "__main__":
    main()