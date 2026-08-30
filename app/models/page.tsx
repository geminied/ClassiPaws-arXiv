import { models } from "@/lib/data";
import Link from "next/link";

export default function ModelsPage() {
  const ranked = [...models]
    .sort(
      (a, b) =>
        b.macroF1 - a.macroF1
    )
    .slice(0, 5);

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
            🏆 MODEL HALL OF FAME
          </div>

          <h1>
            Our smartest little models 🧠
          </h1>

          <p>
            The five strongest models according to
            Macro F1.
          </p>

        </div>

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 15,
        }}
      >

        {ranked.map((model, index) => {

          const medals = [
            "🥇",
            "🥈",
            "🥉",
            "🌟",
            "✨",
          ];

          return (
            <div
              key={model.name}
              className="card"
              style={{
                padding: 22,
                position: "relative",
                overflow: "hidden",
              }}
            >

              <div
                style={{
                  fontSize: 32,
                }}
              >
                {medals[index]}
              </div>

              <h2
                style={{
                  margin:
                    "10px 0 4px",
                  color:
                    "var(--purple)",
                }}
              >
                {model.name}
              </h2>

              <p
                style={{
                  fontSize: 11,
                  marginTop: 0,
                }}
              >
                Model configuration
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: 8,
                  marginTop: 18,
                }}
              >

                <Metric
                  label="Macro F1"
                  value={model.macroF1}
                />

                <Metric
                  label="Accuracy"
                  value={model.accuracy}
                />

                <Metric
                  label="Weighted F1"
                  value={model.weightedF1}
                />

              </div>

            </div>
          );
        })}

      </div>

      <div
        style={{
          marginTop: 25,
          textAlign: "center",
        }}
      >
        <Link
          href="/performance"
          className="btn btn-soft"
        >
          📊 Compare all models
        </Link>
      </div>

    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      style={{
        padding: 11,
        background:
          "var(--purple-light)",
        borderRadius: 12,
      }}
    >
      <small
        style={{
          color: "var(--muted)",
          fontSize: 9,
        }}
      >
        {label}
      </small>

      <strong
        style={{
          display: "block",
          color: "var(--purple)",
          fontSize: 16,
        }}
      >
        {value.toFixed(3)}
      </strong>
    </div>
  );
}