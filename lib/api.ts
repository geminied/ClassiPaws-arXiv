const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "${API_URL}";

/* =========================================================
   TYPES
========================================================= */

export type Paper = {
  id: string;
  title: string;
  abstract: string;
  authors: string;
  target_classname: string;
};

export type Prediction = {
  predicted_class: string;
  confidence: number;
  probabilities: Record<string, number>;
};

export type PapersResponse = {
  count: number;
  papers: Paper[];
};

/* =========================================================
   GET CLASSES
========================================================= */

export async function getClasses() {
  const response = await fetch(
    `${API_URL}/classes`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load classes"
    );
  }

  return response.json();
}

/* =========================================================
   SEARCH PAPERS
========================================================= */

export async function searchPapers(
  query = "",
  targetClass = "",
  limit = 20
): Promise<PapersResponse> {

  const params =
    new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (targetClass) {
    params.set(
      "target_class",
      targetClass
    );
  }

  params.set(
    "limit",
    String(limit)
  );

  const response =
    await fetch(
      `${API_URL}/papers?${params.toString()}`
    );

  if (!response.ok) {
    throw new Error(
      "Failed to search papers"
    );
  }

  return response.json();
}

/* =========================================================
   GET SINGLE PAPER
========================================================= */

export async function getPaper(
  id: string
): Promise<Paper> {

  const response =
    await fetch(
      `${API_URL}/papers/${encodeURIComponent(id)}`
    );

  if (!response.ok) {
    throw new Error(
      "Paper not found"
    );
  }

  return response.json();
}

/* =========================================================
   PREDICT PAPER
========================================================= */

export async function predictPaper(
  title: string,
  abstract: string
): Promise<Prediction> {

  const response =
    await fetch(
      `${API_URL}/predict`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          title,
          abstract,
        }),
      }
    );

  if (!response.ok) {

    const error =
      await response
        .json()
        .catch(() => null);

    throw new Error(
      error?.detail ||
      "Prediction failed"
    );
  }

  const data =
    await response.json();

  /*
   * Backend response:
   *
   * {
   *   title: "...",
   *   abstract: "...",
   *   prediction: {
   *     predicted_class: "...",
   *     confidence: 0.91,
   *     probabilities: {...}
   *   }
   * }
   *
   * The frontend only needs the prediction object.
   */

  return data.prediction;
}

/* =========================================================
   GET STATISTICS
========================================================= */

export async function getStats() {

  const response =
    await fetch(
      `${API_URL}/stats`
    );

  if (!response.ok) {
    throw new Error(
      "Failed to load statistics"
    );
  }

  return response.json();
}

/* =========================================================
   GET MODELS
========================================================= */

export async function getModels() {

  const response =
    await fetch(
      `${API_URL}/models`
    );

  if (!response.ok) {
    throw new Error(
      "Failed to load models"
    );
  }

  return response.json();
}