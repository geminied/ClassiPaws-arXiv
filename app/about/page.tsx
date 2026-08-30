import Image from "next/image";

export default function AboutPage() {
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
            📖 THE STORY
          </div>

          <h1>
            About ClassiPaws 🐾
          </h1>

          <p>
            A friendly little home for exploring
            research papers and machine learning.
          </p>

        </div>

      </div>

      <section
        className="card"
        style={{
          padding: 30,
          display: "grid",
          gridTemplateColumns:
            "minmax(0,1fr) 220px",
          gap: 30,
          alignItems: "center",
        }}
      >

        <div>

          <h2>
            What is ClassiPaws? ✨
          </h2>

          <p>
            ClassiPaws-arXiv is designed as an
            interactive research-paper exploration
            and classification platform.
          </p>

          <p>
            Instead of treating research-paper
            classification as a plain table of
            predictions, the application brings
            paper discovery, prediction, and model
            evaluation together in one place.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 20,
            }}
          >
            <span className="pill">
              🔎 Paper Search
            </span>

            <span className="pill">
              🐱 Prediction
            </span>

            <span className="pill">
              📊 Evaluation
            </span>

            <span className="pill">
              🧠 Models
            </span>
          </div>

        </div>

        <Image
          src="/about-mascot.png"
          alt="ClassiPaws mascot"
          width={220}
          height={220}
          style={{
            width: "100%",
            height: "auto",
          }}
        />

      </section>

      <section
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 15,
        }}
      >

        <InfoCard
          emoji="📚"
          title="Explore"
          text="Look through research papers and inspect their available metadata."
        />

        <InfoCard
          emoji="✨"
          title="Predict"
          text="Enter a paper manually or select one from the dataset."
        />

        <InfoCard
          emoji="📊"
          title="Evaluate"
          text="Compare models and understand their reported performance."
        />

      </section>

    </main>
  );
}

function InfoCard({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <div
      className="card"
      style={{
        padding: 22,
      }}
    >

      <div
        style={{
          fontSize: 28,
        }}
      >
        {emoji}
      </div>

      <h3
        style={{
          color: "var(--purple)",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: 12,
        }}
      >
        {text}
      </p>

    </div>
  );
}