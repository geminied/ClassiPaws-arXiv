"use client";

import { useState } from "react";
import {
  BarChart3,
  Trophy,
} from "lucide-react";
import { models } from "@/lib/data";
import { PerformanceChart } from "@/components/PerformanceChart";

type Metric =
  | "macroF1"
  | "accuracy"
  | "weightedF1";

const metrics: {
  value: Metric;
  label: string;
}[] = [
  {
    value: "macroF1",
    label: "Macro F1",
  },
  {
    value: "accuracy",
    label: "Accuracy",
  },
  {
    value: "weightedF1",
    label: "Weighted F1",
  },
];

export default function Performance() {
  const [metric, setMetric] =
    useState<Metric>("macroF1");

  const best = [...models].sort(
    (a, b) =>
      b[metric] - a[metric]
  )[0];

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
            📊 MODEL LAB
          </div>

          <h1>
            Model Performance ✨
          </h1>

          <p>
            See how your trained models perform
            across different evaluation metrics.
          </p>

        </div>

        <span className="pill">
          🏆 Best: {best.name}
        </span>

      </div>

      <div className="stats">

        <Stat
          label="Total Models"
          value={models.length}
          emoji="🧠"
        />

        <Stat
          label="Disciplines"
          value="8"
          emoji="📚"
        />

        <Stat
          label="Best Macro F1"
          value={Math.max(
            ...models.map(
              (x) => x.macroF1
            )
          ).toFixed(3)}
          emoji="🌸"
        />

        <Stat
          label="Best Accuracy"
          value={Math.max(
            ...models.map(
              (x) => x.accuracy
            )
          ).toFixed(3)}
          emoji="🎯"
        />

      </div>

      <div className="section-head">

        <h2>
          How are our models doing? 🐾
        </h2>

        <div className="tabs">

          {metrics.map((item) => (
            <button
              key={item.value}
              className={`tab ${
                metric === item.value
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setMetric(item.value)
              }
            >
              {item.label}
            </button>
          ))}

        </div>

      </div>

      <section
        className="card"
        style={{
          padding: 25,
        }}
      >

        <div
          style={{
            color: "var(--purple)",
            fontFamily:
              "var(--font-nunito)",
            fontWeight: 900,
            marginBottom: 15,
          }}
        >
          <BarChart3
            size={16}
            style={{
              verticalAlign:
                "middle",
              marginRight: 6,
            }}
          />

          {metric === "macroF1"
            ? "Macro F1 Score"
            : metric === "accuracy"
              ? "Accuracy"
              : "Weighted F1 Score"}
        </div>

        <PerformanceChart
          models={models}
          metric={metric}
        />

      </section>

    </main>
  );
}

function Stat({
  label,
  value,
  emoji,
}: {
  label: string;
  value: string | number;
  emoji: string;
}) {
  return (
    <div className="card stat">

      <small>
        {emoji} {label}
      </small>

      <strong>
        {value}
      </strong>

    </div>
  );
}