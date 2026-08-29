"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Brain,
  Sparkles,
  FileText,
  Target,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const classes = [
  "Dataset Paper",
  "Benchmark",
  "Survey",
  "Novel Model",
  "Optimization",
  "Evaluation",
  "Theory",
  "Application",
];

function PredictContent() {
  const searchParams = useSearchParams();

  const initialText = searchParams.get("text") || "";

  const [abstract, setAbstract] = useState(initialText);
  const [model, setModel] = useState("BERT");
  const [targetClass, setTargetClass] = useState("Auto");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  const handlePredict = async () => {
    if (!abstract.trim()) return;

    setLoading(true);
    setPrediction(null);
    setConfidence(null);

    /*
     * TEMPORARY FRONTEND DEMO LOGIC
     *
     * This is NOT the real ML backend.
     * Later we will replace this section with:
     *
     * const response = await fetch("/api/predict", {
     *   method: "POST",
     *   headers: { "Content-Type": "application/json" },
     *   body: JSON.stringify({
     *     abstract,
     *     model,
     *     targetClass,
     *   }),
     * });
     *
     * const result = await response.json();
     */

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const text = abstract.toLowerCase();

    let result = "Novel Model";
    let score = 87;

    if (
      text.includes("dataset") ||
      text.includes("data collection") ||
      text.includes("corpus")
    ) {
      result = "Dataset Paper";
      score = 94;
    } else if (
      text.includes("survey") ||
      text.includes("review") ||
      text.includes("systematic review")
    ) {
      result = "Survey";
      score = 92;
    } else if (
      text.includes("benchmark") ||
      text.includes("baseline comparison")
    ) {
      result = "Benchmark";
      score = 91;
    } else if (
      text.includes("optimization") ||
      text.includes("optimize") ||
      text.includes("hyperparameter")
    ) {
      result = "Optimization";
      score = 89;
    } else if (
      text.includes("evaluation") ||
      text.includes("evaluate") ||
      text.includes("performance")
    ) {
      result = "Evaluation";
      score = 86;
    } else if (
      text.includes("theoretical") ||
      text.includes("theorem") ||
      text.includes("proof")
    ) {
      result = "Theory";
      score = 84;
    } else if (
      text.includes("application") ||
      text.includes("real-world") ||
      text.includes("clinical")
    ) {
      result = "Application";
      score = 88;
    }

    setPrediction(result);
    setConfidence(score);
    setLoading(false);
  };

  const resetPrediction = () => {
    setPrediction(null);
    setConfidence(null);
    setAbstract("");
  };

  return (
    <div className="page">
      <div className="section-head">
        <div>
          <span className="pill">
            <Sparkles size={13} />
            AI PAPER CLASSIFIER
          </span>

          <h1 style={{ marginTop: "12px" }}>
            Predict a paper&apos;s{" "}
            <span style={{ color: "var(--purple)" }}>contribution.</span>
          </h1>

          <p style={{ maxWidth: "650px" }}>
            Paste a research-paper abstract and let the classification model
            determine what kind of contribution the paper makes.
          </p>
        </div>
      </div>

      <div className="prediction">
        {/* LEFT SIDE */}
        <div className="card form">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <div className="icon" style={{ marginBottom: 0 }}>
              <FileText size={20} />
            </div>

            <div>
              <h2 style={{ fontSize: "20px" }}>Paper information</h2>
              <p style={{ margin: "3px 0 0" }}>
                Provide the abstract you want to classify.
              </p>
            </div>
          </div>

          <label>
            TARGET CLASS
            <select
              className="select"
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
            >
              <option value="Auto">Auto detect</option>

              {classes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            MODEL
            <select
              className="select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="BERT">BERT</option>
              <option value="BiGRU">BiGRU</option>
              <option value="Logistic Regression">
                Logistic Regression
              </option>
              <option value="Random Forest">Random Forest</option>
            </select>
          </label>

          <label>
            RESEARCH PAPER ABSTRACT
            <textarea
              className="textarea"
              placeholder="Paste the research paper abstract here..."
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
            />
          </label>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <small style={{ color: "var(--muted)" }}>
              {abstract.length} characters
            </small>

            <button
              className="btn ghost small"
              type="button"
              onClick={resetPrediction}
            >
              <RotateCcw size={13} />
              Clear
            </button>
          </div>

          <button
            className="btn primary full"
            type="button"
            onClick={handlePredict}
            disabled={loading || !abstract.trim()}
            style={{
              opacity: loading || !abstract.trim() ? 0.6 : 1,
              cursor: loading || !abstract.trim() ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <>
                <Brain size={15} className="spin" />
                Analyzing paper...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Predict Classification
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="card result">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div className="icon" style={{ marginBottom: 0 }}>
              <Target size={20} />
            </div>

            <div>
              <h2 style={{ fontSize: "20px" }}>Prediction</h2>
              <p style={{ margin: "3px 0 0" }}>
                Model classification result
              </p>
            </div>
          </div>

          {!prediction && !loading && (
            <div className="empty">
              <div>🐾</div>

              <h3
                style={{
                  fontFamily: "Nunito",
                  color: "var(--ink)",
                  margin: "10px 0 5px",
                }}
              >
                Ready when you are
              </h3>

              <p>
                Add a research abstract on the left and ClassiPaws will
                analyze it.
              </p>
            </div>
          )}

          {loading && (
            <div className="empty">
              <div>
                <Brain size={44} className="spin" />
              </div>

              <h3
                style={{
                  fontFamily: "Nunito",
                  color: "var(--ink)",
                  margin: "10px 0 5px",
                }}
              >
                Reading the paper...
              </h3>

              <p>
                The classifier is analyzing the research contribution.
              </p>
            </div>
          )}

          {prediction && !loading && (
            <>
              <div className="prediction-main">
                <div>🎯</div>

                <h2>{prediction}</h2>

                <b>
                  <CheckCircle2
                    size={14}
                    style={{
                      verticalAlign: "middle",
                      marginRight: "4px",
                    }}
                  />
                  Classification complete
                </b>
              </div>

              <div className="card" style={{ padding: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <strong style={{ fontSize: "12px" }}>
                    Confidence
                  </strong>

                  <strong
                    style={{
                      color: "var(--purple)",
                      fontFamily: "Nunito",
                    }}
                  >
                    {confidence}%
                  </strong>
                </div>

                <div className="progress">
                  <i
                    style={{
                      width: `${confidence}%`,
                    }}
                  />
                </div>

                <small style={{ color: "var(--muted)" }}>
                  Predicted using {model}
                </small>
              </div>

              <div style={{ marginTop: "15px" }}>
                <div className="prob">
                  <div>
                    <span>{prediction}</span>
                    <span>{confidence}%</span>
                  </div>

                  <i>
                    <em style={{ width: `${confidence}%` }} />
                  </i>
                </div>

                <div className="prob">
                  <div>
                    <span>Other classes</span>
                    <span>{100 - (confidence || 0)}%</span>
                  </div>

                  <i>
                    <em
                      style={{
                        width: `${100 - (confidence || 0)}%`,
                      }}
                    />
                  </i>
                </div>
              </div>

              <div className="notice">
                <strong>Target class:</strong>{" "}
                {targetClass === "Auto"
                  ? "Automatic classification"
                  : targetClass}
              </div>

              <button
                className="btn ghost full"
                type="button"
                onClick={resetPrediction}
              >
                <RotateCcw size={14} />
                Analyze another paper
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PredictPage() {
  return (
    <Suspense
      fallback={
        <div className="page">
          <div className="empty">
            <div>🐾</div>
            <p>Loading prediction...</p>
          </div>
        </div>
      }
    >
      <PredictContent />
    </Suspense>
  );
}