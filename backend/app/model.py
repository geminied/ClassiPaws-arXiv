from pathlib import Path

import joblib
import numpy as np


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "classifier.joblib"


class ClassiPawsModel:

    def __init__(self):

        if not MODEL_PATH.exists():

            raise FileNotFoundError(
                f"Model not found: {MODEL_PATH}"
            )

        artifact = joblib.load(
            MODEL_PATH
        )

        self.model = artifact["model"]
        self.vectorizer = artifact["vectorizer"]
        self.label_encoder = artifact["label_encoder"]

        self.class_names = artifact["class_names"]

        self.accuracy = artifact.get(
            "accuracy"
        )

        self.macro_f1 = artifact.get(
            "macro_f1"
        )

        self.configuration = artifact.get(
            "configuration",
            {}
        )

        self.representation = artifact.get(
            "representation",
            "TF-IDF"
        )

    def predict(
        self,
        title: str,
        abstract: str
    ):

        text = f"{title} {abstract}"

        vector = self.vectorizer.transform(
            [text]
        )

        probabilities = self.model.predict_proba(
            vector
        )[0]

        prediction_index = int(
            np.argmax(probabilities)
        )

        predicted_class = self.class_names[
            prediction_index
        ]

        confidence = float(
            probabilities[prediction_index]
        )

        probability_map = {
            self.class_names[i]: float(probabilities[i])
            for i in range(len(self.class_names))
        }

        return {
            "predicted_class": predicted_class,
            "confidence": confidence,
            "probabilities": probability_map
        }


classifier = ClassiPawsModel()