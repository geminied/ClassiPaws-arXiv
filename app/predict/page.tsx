"use client";

import { useSearchParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  Suspense,
} from "react";

import {
  getPaper,
  predictPaper,
} from "@/lib/api";

import {
  Search,
  RefreshCcw,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Paper = {
  id: string;
  title: string;
  abstract: string;
  authors: string;
  target_classname: string;
};

type PredictionResult = {
  predicted_class: string;
  confidence: number;
  probabilities?: Record<string, number>;
};

/* =========================================================
   MAIN PREDICTION CONTENT
========================================================= */

function PredictContent() {
  /* =======================================================
     URL SEARCH PARAMS
  ======================================================= */

  const searchParams = useSearchParams();

  const requestedPaper =
    searchParams.get("paper");

  /*
   * If a paper ID exists in the URL, start directly
   * in dataset mode.
   *
   * This avoids calling setMode() inside an effect,
   * which can cause React's cascading render warning.
   */
  const [mode, setMode] =
    useState<"manual" | "dataset">(
      requestedPaper
        ? "dataset"
        : "manual"
    );

  /* =======================================================
     DATASET PAPERS
  ======================================================= */

  const [papers, setPapers] =
    useState<Paper[]>([]);

  const [loadingPapers, setLoadingPapers] =
    useState(false);

  const [paperSearch, setPaperSearch] =
    useState("");

  const [selectedPaper, setSelectedPaper] =
    useState<Paper | null>(null);

  /* =======================================================
     PAPER INPUT
  ======================================================= */

  const [title, setTitle] =
    useState("");

  const [abstract, setAbstract] =
    useState("");

  /* =======================================================
     PREDICTION
  ======================================================= */

  const [prediction, setPrediction] =
    useState<PredictionResult | null>(null);

  const [predicting, setPredicting] =
    useState(false);

  /* =======================================================
     ERROR
  ======================================================= */

  const [error, setError] =
    useState<string | null>(null);

  /* =======================================================
     LOAD DATASET PAPERS
     
     This runs when:
     
     1. User switches to dataset mode
     OR
     2. A paper is provided through the URL
     
     Example:
     
     /prediction?paper=1234.5678
  ======================================================= */

  useEffect(() => {
    if (
      mode !== "dataset" &&
      requestedPaper === null
    ) {
      return;
    }

    let cancelled = false;

    async function loadPapers() {
      try {
        setLoadingPapers(true);
        setError(null);

        const response =
          await fetch("/api/papers");

        if (!response.ok) {
          throw new Error(
            "Failed to load papers"
          );
        }

        const data =
          await response.json();

        if (cancelled) {
          return;
        }

        /*
         * Your FastAPI backend returns:
         *
         * {
         *   count: number,
         *   papers: [...]
         * }
         *
         * But if your Next.js API route already returns
         * the array directly, this also supports that.
         */

        const paperList: Paper[] =
          Array.isArray(data)
            ? data
            : data.papers || [];

        setPapers(paperList);

      } catch (err) {
        if (!cancelled) {
          console.error(err);

          setError(
            "Could not load dataset papers."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingPapers(false);
        }
      }
    }

    loadPapers();

    return () => {
      cancelled = true;
    };
  }, [mode, requestedPaper]);

  /* =======================================================
     LOAD PAPER FROM URL
     
     Example:
     
     /prediction?paper=1234.5678
     
     requestedPaper has the type:
     
     string | null
     
     We check for null before passing it to getPaper().
     
     IMPORTANT:
     
     This effect DOES NOT call setMode().
     
     That prevents the React cascading render warning.
  ======================================================= */

  useEffect(() => {
    if (requestedPaper === null) {
      return;
    }

    /*
     * TypeScript now knows that requestedPaper
     * is a string.
     */
    const paperId = requestedPaper;

    let cancelled = false;

    async function loadRequestedPaper() {
      try {
        setError(null);

        const paper =
          await getPaper(paperId);

        if (cancelled) {
          return;
        }

        setSelectedPaper(paper);

        setTitle(
          paper.title || ""
        );

        setAbstract(
          paper.abstract?.trim() || ""
        );

      } catch (err) {
        if (!cancelled) {
          console.error(err);

          setError(
            "Could not load the selected paper."
          );
        }
      }
    }

    loadRequestedPaper();

    return () => {
      cancelled = true;
    };
  }, [requestedPaper]);

  /* =======================================================
     FILTER DATASET PAPERS
  ======================================================= */

  const filteredPapers =
    useMemo(() => {
      const query =
        paperSearch
          .trim()
          .toLowerCase();

      /*
       * No search query:
       * show first 12 papers.
       */

      if (!query) {
        return papers.slice(0, 12);
      }

      /*
       * Search by:
       *
       * - title
       * - authors
       * - arXiv ID
       */

      return papers
        .filter((paper) => {
          return (
            paper.title
              ?.toLowerCase()
              .includes(query) ||

            paper.authors
              ?.toLowerCase()
              .includes(query) ||

            paper.id
              ?.toLowerCase()
              .includes(query)
          );
        })
        .slice(0, 12);

    }, [
      papers,
      paperSearch,
    ]);

  /* =======================================================
     SELECT DATASET PAPER
     
     Selecting a paper automatically fills:
     
     📖 Title
     📝 Abstract
     
     The user can still edit both afterwards.
  ======================================================= */

  function choosePaper(
    paper: Paper
  ) {
    setSelectedPaper(paper);

    setTitle(
      paper.title || ""
    );

    setAbstract(
      paper.abstract?.trim() || ""
    );

    setPrediction(null);

    setError(null);
  }

  /* =======================================================
     SWITCH INPUT MODE
  ======================================================= */

  function switchMode(
    nextMode:
      | "manual"
      | "dataset"
  ) {
    setMode(nextMode);

    setPrediction(null);

    setError(null);

    if (
      nextMode === "manual"
    ) {
      setSelectedPaper(null);
    }
  }

  /* =======================================================
     CLEAR FORM
  ======================================================= */

  function clearForm() {
    setSelectedPaper(null);

    setTitle("");

    setAbstract("");

    setPrediction(null);

    setError(null);

    setPaperSearch("");
  }

  /* =======================================================
     PREDICT
     
     Calls the real FastAPI backend through:
     
     predictPaper(title, abstract)
     
     from:
     
     @/lib/api
  ======================================================= */

  async function handlePredict() {
    /*
     * Both title and abstract are required.
     */

    if (
      !title.trim() ||
      !abstract.trim()
    ) {
      setError(
        "Please provide both a title and an abstract."
      );

      return;
    }

    try {
      setPredicting(true);

      setPrediction(null);

      setError(null);

      /*
       * Call the real backend.
       */

      const result =
        await predictPaper(
          title.trim(),
          abstract.trim()
        );

      /*
       * Store the prediction result.
       */

      setPrediction(result);

    } catch (err) {
      console.error(err);

      if (
        err instanceof Error
      ) {
        setError(
          err.message
        );
      } else {
        setError(
          "Prediction failed. Please try again."
        );
      }

    } finally {
      setPredicting(false);
    }
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="section-head">

        <div>

          <div
            style={{
              color:
                "var(--pink)",
              fontWeight: 900,
              fontSize: 12,
              marginBottom: 7,
            }}
          >
            🐾 CLASSIFICATION PLAYGROUND
          </div>

          <h1>
            Let&apos;s classify a paper! 🐱✨
          </h1>

          <p>
            Give your research buddy a
            title and abstract and let&apos;s
            see what it discovers.
          </p>

        </div>

        <button
          className="btn btn-soft"
          onClick={clearForm}
          type="button"
        >
          <RefreshCcw
            size={14}
            style={{
              verticalAlign:
                "middle",
              marginRight: 5,
            }}
          />

          Clear
        </button>

      </div>

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div
          style={{
            marginBottom: 18,
            padding: 14,
            borderRadius: 14,
            background:
              "var(--soft-pink)",
            color:
              "#b64d78",
            fontSize: 12,
            fontWeight: 800,
            border:
              "1px solid #f4bfd4",
          }}
        >
          🥺 {error}
        </div>
      )}

      {/* =================================================
          MAIN FORM
      ================================================= */}

      <section
        className="card form-card"
      >

        {/* =================================================
            MODE SWITCH
        ================================================= */}

        <div className="mode-switch">

          <button
            type="button"
            className={`mode-button ${
              mode === "manual"
                ? "active"
                : ""
            }`}
            onClick={() =>
              switchMode(
                "manual"
              )
            }
          >
            ✍️ Manual Input
          </button>

          <button
            type="button"
            className={`mode-button ${
              mode === "dataset"
                ? "active"
                : ""
            }`}
            onClick={() =>
              switchMode(
                "dataset"
              )
            }
          >
            📚 Choose Dataset Paper
          </button>

        </div>

        {/* =================================================
            DATASET MODE
        ================================================= */}

        {mode === "dataset" && (
          <div
            className="dataset-picker"
          >

            <div
              className="dataset-picker-title"
            >
              📚 Pick a paper from
              your dataset
            </div>

            {/* SEARCH */}

            <div
              className="search-box"
            >

              <Search
                size={17}
              />

              <input
                className="input"
                value={
                  paperSearch
                }
                onChange={(e) =>
                  setPaperSearch(
                    e.target.value
                  )
                }
                placeholder="Search by title, author, or arXiv ID..."
              />

            </div>

            {/* PAPER LIST */}

            <div
              style={{
                marginTop: 12,
                maxHeight: 300,
                overflowY:
                  "auto",
                display:
                  "flex",
                flexDirection:
                  "column",
                gap: 7,
              }}
            >

              {/* LOADING */}

              {loadingPapers && (
                <div
                  style={{
                    padding: 20,
                    textAlign:
                      "center",
                    color:
                      "var(--muted)",
                    fontSize: 12,
                  }}
                >
                  🐾 Looking through
                  the papers...
                </div>
              )}

              {/* PAPERS */}

              {!loadingPapers &&
                filteredPapers.map(
                  (paper) => (
                    <button
                      key={
                        paper.id
                      }
                      type="button"
                      onClick={() =>
                        choosePaper(
                          paper
                        )
                      }
                      style={{
                        textAlign:
                          "left",

                        border:
                          selectedPaper?.id ===
                          paper.id
                            ? "2px solid var(--purple)"
                            : "1px solid var(--border)",

                        background:
                          "white",

                        borderRadius:
                          13,

                        padding:
                          12,

                        cursor:
                          "pointer",
                      }}
                    >

                      {/* TITLE */}

                      <strong
                        style={{
                          display:
                            "block",

                          color:
                            "var(--purple)",

                          fontSize:
                            12,
                        }}
                      >
                        {paper.title}
                      </strong>

                      {/* AUTHORS */}

                      <small
                        style={{
                          display:
                            "block",

                          marginTop:
                            5,

                          color:
                            "var(--muted)",
                        }}
                      >
                        {paper.authors}
                      </small>

                      {/* CLASS */}

                      {paper.target_classname && (
                        <span
                          className="class-badge"
                          style={{
                            display:
                              "inline-block",

                            marginTop:
                              7,
                          }}
                        >
                          {
                            paper.target_classname
                          }
                        </span>
                      )}

                    </button>
                  )
                )}

              {/* NO RESULTS */}

              {!loadingPapers &&
                filteredPapers.length ===
                  0 && (
                  <div
                    style={{
                      padding:
                        20,

                      textAlign:
                        "center",

                      color:
                        "var(--muted)",
                    }}
                  >
                    🥺 No papers
                    found.
                  </div>
                )}

            </div>

            {/* SELECTED PAPER */}

            {selectedPaper && (
              <div
                style={{
                  marginTop:
                    12,

                  color:
                    "var(--mint)",

                  fontWeight:
                    800,

                  fontSize:
                    11,
                }}
              >
                ✓ Selected:{" "}
                {
                  selectedPaper.id
                }
              </div>
            )}

          </div>
        )}

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="field">

          <label>
            📖 Paper Title
          </label>

          <input
            className="input"
            value={title}
            onChange={(e) => {
              setTitle(
                e.target.value
              );

              /*
               * If the user edits a dataset paper,
               * it is still okay. The selected paper
               * remains associated with the form.
               */
            }}
            placeholder="Enter the research paper title..."
          />

        </div>

        {/* =================================================
            ABSTRACT
        ================================================= */}

        <div className="field">

          <label>
            📝 Abstract
          </label>

          <textarea
            className="textarea"
            value={abstract}
            onChange={(e) => {
              setAbstract(
                e.target.value
              );
            }}
            placeholder="Paste or type the paper abstract here..."
          />

        </div>

        {/* =================================================
            DATASET INFORMATION
        ================================================= */}

        {selectedPaper && (
          <div
            style={{
              padding: 13,
              marginBottom:
                18,

              borderRadius:
                14,

              background:
                "var(--mint-light)",

              color:
                "#458d71",

              fontSize:
                11,

              fontWeight:
                700,
            }}
          >
            🐾 This information
            came from dataset
            paper{" "}
            <strong>
              {
                selectedPaper.id
              }
            </strong>
            . You can still edit
            it before predicting.
          </div>
        )}

        {/* =================================================
            PREDICT BUTTON
        ================================================= */}

        <button
          className="btn btn-primary"
          onClick={
            handlePredict
          }
          disabled={
            predicting
          }
          type="button"
        >
          {predicting
            ? "🐾 Thinking..."
            : "✨ Predict Contribution"}
        </button>

      </section>

      {/* ===================================================
          PREDICTION RESULT
      =================================================== */}

      {prediction && (
        <section
          className="prediction-result"
        >

          <div
            className="prediction-cat"
          >
            🐱
          </div>

          <div
            style={{
              color:
                "var(--pink)",

              fontSize:
                11,

              fontWeight:
                900,
            }}
          >
            PAWSITIVE RESULT! ✨
          </div>

          {/* PREDICTED CLASS */}

          <div
            className="prediction-label"
          >
            {
              prediction.predicted_class
            }
          </div>

          {/* CONFIDENCE */}

          <div
            className="confidence"
          >
            {(
              prediction.confidence *
              100
            ).toFixed(1)}
            % confidence
          </div>

          {/* =================================================
              PROBABILITY BREAKDOWN
          ================================================= */}

          {prediction.probabilities &&
            Object.keys(
              prediction.probabilities
            ).length > 0 && (
              <div
                style={{
                  width:
                    "100%",
                  maxWidth:
                    500,
                  marginTop:
                    20,
                }}
              >

                <div
                  style={{
                    color:
                      "var(--purple)",
                    fontWeight:
                      900,
                    fontSize:
                      12,
                    marginBottom:
                      10,
                  }}
                >
                  🌸 Confidence
                  breakdown
                </div>

                {Object.entries(
                  prediction.probabilities
                )
                  .sort(
                    (
                      [, a],
                      [, b]
                    ) => b - a
                  )
                  .map(
                    ([
                      className,
                      probability,
                    ]) => (
                      <div
                        key={
                          className
                        }
                        style={{
                          marginBottom:
                            9,
                        }}
                      >

                        {/* CLASS + PERCENTAGE */}

                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            fontSize:
                              11,
                            fontWeight:
                              800,
                            marginBottom:
                              4,
                          }}
                        >

                          <span>
                            🐾{" "}
                            {
                              className
                            }
                          </span>

                          <span>
                            {(
                              probability *
                              100
                            ).toFixed(
                              1
                            )}
                            %
                          </span>

                        </div>

                        {/* PROGRESS BAR */}

                        <div
                          style={{
                            width:
                              "100%",
                            height:
                              8,
                            borderRadius:
                              999,
                            background:
                              "var(--soft)",
                            overflow:
                              "hidden",
                          }}
                        >

                          <div
                            style={{
                              width: `${
                                probability *
                                100
                              }%`,

                              height:
                                "100%",

                              borderRadius:
                                999,

                              background:
                                "var(--purple)",

                              transition:
                                "width 0.5s ease",
                            }}
                          />

                        </div>

                      </div>
                    )
                  )}

              </div>
            )}

        </section>
      )}

    </main>
  );
}

/* =========================================================
   PAGE EXPORT

   Suspense is required because PredictContent uses
   useSearchParams().
========================================================= */

export default function PredictPage() {
  return (
    <Suspense
      fallback={
        <main className="page">
          🐾 Loading prediction
          playground...
        </main>
      }
    >
      <PredictContent />
    </Suspense>
  );
}