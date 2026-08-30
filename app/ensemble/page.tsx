export default function EnsemblePage() {
  const models = [
    {
      emoji: "🤖",
      name: "BERT",
      color: "var(--purple-light)",
    },
    {
      emoji: "🧠",
      name: "BiGRU",
      color: "var(--pink-light)",
    },
    {
      emoji: "🌸",
      name: "Logistic Regression",
      color: "var(--blue-light)",
    },
  ];

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
            🧠 THE TEAM
          </div>

          <h1>
            Meet the ensemble! 🐾
          </h1>

          <p>
            See how multiple models can work
            together to produce a final prediction.
          </p>

        </div>

      </div>

      <section
        className="card"
        style={{
          padding: 30,
          textAlign: "center",
        }}
      >

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >

          {models.map((model, index) => (
            <div
              key={model.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >

              <div
                style={{
                  width: 150,
                  padding: 20,
                  borderRadius: 20,
                  background:
                    model.color,
                }}
              >

                <div
                  style={{
                    fontSize: 34,
                  }}
                >
                  {model.emoji}
                </div>

                <strong
                  style={{
                    display: "block",
                    marginTop: 8,
                    color:
                      "var(--purple)",
                  }}
                >
                  {model.name}
                </strong>

              </div>

              {index <
                models.length - 1 && (
                <div
                  style={{
                    color:
                      "var(--pink)",
                    fontSize: 25,
                  }}
                >
                  →
                </div>
              )}

            </div>
          ))}

        </div>

        <div
          style={{
            margin:
              "28px auto 0",
            width: 220,
            padding: 22,
            borderRadius: 22,
            background:
              "linear-gradient(135deg,#eee6ff,#ffe8f2)",
          }}
        >

          <div
            style={{
              fontSize: 38,
            }}
          >
            🐾
          </div>

          <strong
            style={{
              display: "block",
              color:
                "var(--purple)",
              fontSize: 17,
              marginTop: 7,
            }}
          >
            Final Prediction
          </strong>

          <small
            style={{
              color:
                "var(--muted)",
            }}
          >
            Everyone votes, ClassiPaws decides ✨
          </small>

        </div>

      </section>

    </main>
  );
}