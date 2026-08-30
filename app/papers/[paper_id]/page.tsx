"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Sparkles,
  Users,
  Tag,
} from "lucide-react";

import { getPaper } from "@/lib/api";
import { cleanLatex } from "@/lib/cleanText";

type Paper = {
  id: string;
  title: string;
  abstract: string;
  authors: string;
  target_classname: string;
};

export default function PaperPage() {
  const params = useParams();

  const paperId =
    typeof params.paper_id === "string"
      ? params.paper_id
      : "";

  const [paper, setPaper] =
    useState<Paper | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadPaper() {
      if (!paperId) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result =
          await getPaper(paperId);

        setPaper(result);

      } catch (err) {
        console.error(err);

        setError(
          "Unable to load this paper."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPaper();
  }, [paperId]);

  if (loading) {
    return (
      <main className="page">

        <div
          className="card"
          style={{
            padding: 50,
            textAlign: "center",
          }}
        >
          🐾 Loading paper...
        </div>

      </main>
    );
  }

  if (error || !paper) {
    return (
      <main className="page">

        <div
          className="card"
          style={{
            padding: 50,
            textAlign: "center",
          }}
        >

          <div
            style={{
              fontSize: 45,
            }}
          >
            🥺
          </div>

          <h2>
            Paper not found
          </h2>

          <p>
            {error ||
              "The requested paper could not be found."}
          </p>

          <Link
            href="/search"
            className="btn btn-soft"
            style={{
              display: "inline-flex",
              marginTop: 15,
            }}
          >
            <ArrowLeft size={15} />
            Back to search
          </Link>

        </div>

      </main>
    );
  }

  const arxivUrl =
    `https://arxiv.org/abs/${encodeURIComponent(
      paper.id
    )}`;

  const pdfUrl =
    `https://arxiv.org/pdf/${encodeURIComponent(
      paper.id
    )}`;

  return (
    <main className="page">

      {/* -------------------------------------------------------
          BACK BUTTON
      ------------------------------------------------------- */}

      <div
        style={{
          marginBottom: 20,
        }}
      >

        <Link
          href="/search"
          className="btn btn-soft"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <ArrowLeft size={15} />

          Back to papers
        </Link>

      </div>

      {/* -------------------------------------------------------
          PAPER HEADER
      ------------------------------------------------------- */}

      <section
        className="card"
        style={{
          padding: 30,
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-start",
            gap: 20,
            flexWrap: "wrap",
          }}
        >

          <div
            style={{
              flex: 1,
              minWidth: 280,
            }}
          >

            <div
              style={{
                color: "var(--pink)",
                fontWeight: 900,
                fontSize: 12,
                marginBottom: 10,
              }}
            >
              📄 RESEARCH PAPER
            </div>

            <h1
              style={{
                marginBottom: 15,
              }}
            >
              {cleanLatex(
                paper.title
              )}
            </h1>

            {/* ------------------------------------------------
                AUTHORS
            ------------------------------------------------ */}

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginBottom: 10,
                color:
                  "var(--muted)",
                lineHeight: 1.6,
              }}
            >

              <Users
                size={16}
                style={{
                  marginTop: 4,
                  flexShrink: 0,
                }}
              />

              <span>
                {cleanLatex(
                  paper.authors
                )}
              </span>

            </div>

            {/* ------------------------------------------------
                ARXIV ID
            ------------------------------------------------ */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color:
                  "var(--muted)",
              }}
            >

              <FileText size={16} />

              <span>
                arXiv ID:{" "}
                <strong>
                  {paper.id}
                </strong>
              </span>

            </div>

          </div>

          {/* CLASSIFICATION */}

          <span className="class-badge">

            <Tag
              size={13}
              style={{
                verticalAlign:
                  "middle",
                marginRight: 5,
              }}
            />

            {paper.target_classname}

          </span>

        </div>

      </section>

      {/* -------------------------------------------------------
          ACTION BUTTONS
      ------------------------------------------------------- */}

      <section
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 20,
        }}
      >

        <a
          href={arxivUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-soft"
        >

          <ExternalLink size={15} />

          Open on arXiv

        </a>

        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-soft"
        >

          <FileText size={15} />

          View PDF

        </a>

        <Link
          href={`/predict?paper=${encodeURIComponent(
            paper.id
          )}`}
          className="btn btn-soft"
        >

          <Sparkles size={15} />

          Predict this paper

        </Link>

      </section>

      {/* -------------------------------------------------------
          ABSTRACT
      ------------------------------------------------------- */}

      <section
        className="card"
        style={{
          padding: 30,
          marginTop: 20,
        }}
      >

        <div
          style={{
            color: "var(--purple)",
            fontWeight: 900,
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          ABSTRACT
        </div>

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.85,
            color:
              "var(--text)",
            whiteSpace:
              "pre-wrap",
          }}
        >
          {cleanLatex(
            paper.abstract
          )}
        </p>

      </section>

      {/* -------------------------------------------------------
          PAPER INFORMATION
      ------------------------------------------------------- */}

      <section
        className="card"
        style={{
          padding: 25,
          marginTop: 20,
        }}
      >

        <div
          style={{
            color: "var(--purple)",
            fontWeight: 900,
            fontSize: 13,
            marginBottom: 15,
          }}
        >
          PAPER INFORMATION
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 15,
          }}
        >

          <InfoItem
            label="arXiv ID"
            value={paper.id}
          />

          <InfoItem
            label="Classification"
            value={
              paper.target_classname
            }
          />

          <InfoItem
            label="Authors"
            value={cleanLatex(
              paper.authors
            )}
          />

        </div>

      </section>

    </main>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: 15,
        borderRadius: 12,
        background:
          "var(--background)",
      }}
    >

      <small
        style={{
          display: "block",
          marginBottom: 5,
          color:
            "var(--muted)",
          fontWeight: 700,
        }}
      >
        {label}
      </small>

      <strong
        style={{
          lineHeight: 1.5,
        }}
      >
        {value}
      </strong>

    </div>
  );
}