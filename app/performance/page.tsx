"use client";

import { useState } from "react";
import { BarChart3, Trophy } from "lucide-react";
import { models } from "@/lib/data";
import { PerformanceChart } from "@/components/PerformanceChart";

type Metric = "macroF1" | "accuracy" | "weightedF1";

const metricOptions: { value: Metric; label: string }[] = [
  { value: "macroF1", label: "Macro F1" },
  { value: "accuracy", label: "Accuracy" },
  { value: "weightedF1", label: "Weighted F1" },
];

export default function Performance() {
  const [m, setM] = useState<Metric>("macroF1");

  const best = [...models].sort((a, b) => b[m] - a[m])[0];

  return (
    <main className="page">
      <div className="section-head">
        <div>
          <h1>Model Performance</h1>
          <p>Compare trained models across evaluation metrics.</p>
        </div>

        <span className="pill">
          <Trophy size={13} />
          Best: {best.name}
        </span>
      </div>

      <div className="stats">
        <Stat l="Total Models" v={models.length} />

        <Stat l="Disciplines" v="8" />

        <Stat
          l="Best Macro F1"
          v={Math.max(...models.map((x) => x.macroF1)).toFixed(3)}
        />

        <Stat
          l="Best Accuracy"
          v={Math.max(...models.map((x) => x.accuracy)).toFixed(3)}
        />
      </div>

      <div className="section-head">
        <h2>Performance Comparison</h2>

        <div className="tabs">
          {metricOptions.map((option) => (
            <button
              key={option.value}
              className={`tab ${m === option.value ? "active" : ""}`}
              onClick={() => setM(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <section className="card chartcard">
        <b>
          <BarChart3 size={16} />

          {m === "macroF1"
            ? "Macro F1 Score"
            : m === "accuracy"
              ? "Accuracy"
              : "Weighted F1 Score"}
        </b>

        <PerformanceChart models={models} metric={m} />
      </section>
    </main>
  );
}

function Stat({
  l,
  v,
}: {
  l: string;
  v: string | number;
}) {
  return (
    <div className="card stat">
      <small>{l}</small>
      <strong>{v}</strong>
    </div>
  );
}