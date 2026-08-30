"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search as SearchIcon,
  Sparkles,
  ExternalLink,
} from "lucide-react";

import { cleanLatex } from "@/lib/cleanText";

type Paper = {
  id: string;
  title: string;
  abstract: string;
  authors: string;
  target_classname: string;
};

export default function SearchPage() {
  const [papers, setPapers] =
    useState<Paper[]>([]);

  const [query, setQuery] =
    useState("");

  const [classFilter, setClassFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response =
          await fetch("/api/papers");

        if (!response.ok) {
          throw new Error(
            "Failed to load papers"
          );
        }

        const data =
          await response.json();

        setPapers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const classes = useMemo(() => {
    return Array.from(
      new Set(
        papers.map(
          (paper) =>
            paper.target_classname
        )
      )
    ).sort();
  }, [papers]);

  const results = useMemo(() => {
    const q = query
      .trim()
      .toLowerCase();

    return papers
      .filter((paper) => {
        const matchesText =
          !q ||
          paper.title
            .toLowerCase()
            .includes(q) ||
          paper.authors
            .toLowerCase()
            .includes(q) ||
          paper.abstract
            .toLowerCase()
            .includes(q) ||
          paper.id
            .toLowerCase()
            .includes(q);

        const matchesClass =
          classFilter === "all" ||
          paper.target_classname ===
            classFilter;

        return (
          matchesText &&
          matchesClass
        );
      })
      .slice(0, 50);
  }, [
    papers,
    query,
    classFilter,
  ]);

  return (
    <main className="page">

      <div className="section-head">

        <div>

          <div
            style={{
              color: "var(--pink)",
              fontWeight: 900,
              fontSize: 12,
              marginBottom: 7,
            }}
          >
            📚 PAPER LIBRARY
          </div>

          <h1>
            Find a paper! 🔎
          </h1>

          <p>
            Search through the ClassiPaws paper
            collection.
          </p>

        </div>

        <span className="pill">
          🐾 {papers.length} papers
        </span>

      </div>

      <section className="card card-padding">

        <div className="search-box">

          <SearchIcon size={18} />

          <input
            className="input"
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search title, author, abstract, or arXiv ID..."
          />

        </div>

        <div
          style={{
            display: "flex",
            gap: 7,
            flexWrap: "wrap",
            marginTop: 15,
          }}
        >

          <button
            className={`tab ${
              classFilter === "all"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setClassFilter("all")
            }
          >
            🌸 All
          </button>

          {classes.map((item) => (

            <button
              key={item}
              className={`tab ${
                classFilter === item
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setClassFilter(item)
              }
            >
              🏷️ {item}
            </button>

          ))}

        </div>

      </section>

      {loading ? (

        <div
          className="card"
          style={{
            marginTop: 20,
            padding: 35,
            textAlign: "center",
          }}
        >
          🐾 Searching the library...
        </div>

      ) : (

        <div className="paper-list">

          {results.map((paper) => (

            <article
              key={paper.id}
              className="paper-card"
            >

              <div className="paper-top">

                <div
                  style={{
                    flex: 1,
                  }}
                >

                  {/* ------------------------------------------------
                      CLICKABLE PAPER TITLE
                  ------------------------------------------------ */}

                  <Link
                    href={`/papers/${encodeURIComponent(
                      paper.id
                    )}`}
                    style={{
                      textDecoration:
                        "none",
                      color: "inherit",
                    }}
                  >

                    <h2
                      className="paper-title"
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {cleanLatex(
                        paper.title
                      )}
                    </h2>

                  </Link>

                  <div className="paper-meta">

                    🆔 {paper.id}

                    {" · "}

                    👥{" "}
                    {cleanLatex(
                      paper.authors
                    )}

                  </div>

                </div>

                <span className="class-badge">
                  {paper.target_classname}
                </span>

              </div>

              {/* ------------------------------------------------
                  CLEAN ABSTRACT
              ------------------------------------------------ */}

              <p className="paper-abstract">
                {cleanLatex(
                  paper.abstract.trim()
                )}
              </p>

              <div className="paper-actions">

                {/* PAPER DETAILS BUTTON */}

                <Link
                  href={`/papers/${encodeURIComponent(
                    paper.id
                  )}`}
                  className="btn btn-soft"
                >
                  📄 View paper
                </Link>

                {/* PREDICT BUTTON */}

                <Link
                  href={`/predict?paper=${encodeURIComponent(
                    paper.id
                  )}`}
                  className="btn btn-soft"
                >
                  <Sparkles
                    size={13}
                    style={{
                      verticalAlign:
                        "middle",
                      marginRight: 4,
                    }}
                  />

                  Predict this paper
                </Link>

                {/* ARXIV LINK */}

                <a
                  href={`https://arxiv.org/abs/${encodeURIComponent(
                    paper.id
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-soft"
                >
                  <ExternalLink
                    size={13}
                    style={{
                      verticalAlign:
                        "middle",
                      marginRight: 4,
                    }}
                  />

                  arXiv
                </a>

              </div>

            </article>

          ))}

          {results.length === 0 && (

            <div
              className="card"
              style={{
                padding: 35,
                textAlign: "center",
              }}
            >

              <div
                style={{
                  fontSize: 38,
                }}
              >
                🥺
              </div>

              <h3>
                No papers found
              </h3>

              <p>
                Try another search term.
              </p>

            </div>

          )}

        </div>

      )}

    </main>
  );
}