import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Sparkles,
  BarChart3,
  Trophy,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <main className="page">

      <section className="hero">

        <div className="hero-content">

          <div className="hero-eyebrow">
            🐾 Your little research companion
          </div>

          <h1>
            Research smarter,
            <br />
            <span>one paper</span>{" "}
            <em>at a time.</em> ✨
          </h1>

          <p>
            Welcome to ClassiPaws-arXiv! Explore research papers,
            discover their categories, compare machine-learning
            models, and predict the classification of new papers.
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 22,
            }}
          >
            <Link
              href="/search"
              className="btn btn-primary"
            >
              🔎 Explore Papers
            </Link>

            <Link
              href="/predict"
              className="btn btn-soft"
            >
              🐱 Try Prediction
            </Link>
          </div>

        </div>

        <Image
          src="/hero-cat.png"
          alt="ClassiPaws mascot"
          width={280}
          height={300}
          className="hero-image"
        />

        <div
          className="decor"
          style={{
            top: 25,
            right: 300,
            fontSize: 25,
          }}
        >
          ✨
        </div>

        <div
          className="decor"
          style={{
            top: 55,
            right: 350,
            fontSize: 16,
          }}
        >
          ⭐
        </div>

        <div
          className="decor"
          style={{
            bottom: 40,
            left: 40,
            fontSize: 18,
          }}
        >
          🌸
        </div>

      </section>

      <section style={{ marginTop: 30 }}>

        <div className="section-head">

          <div>
            <h2>What can we do? 🐾</h2>

            <p>
              Pick your research adventure.
            </p>
          </div>

        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 15,
          }}
        >

          <FeatureCard
            href="/search"
            icon="🔎"
            title="Find Papers"
            text="Search research papers by title, author, keyword, or class."
          />

          <FeatureCard
            href="/predict"
            icon="🐱"
            title="Predict a Class"
            text="Give ClassiPaws a title and abstract and let it predict the category."
          />

          <FeatureCard
            href="/performance"
            icon="📊"
            title="Compare Models"
            text="Explore accuracy, F1 scores, and model performance."
          />

          <FeatureCard
            href="/models"
            icon="🏆"
            title="Top Models"
            text="Meet the strongest models and see what makes them special."
          />

        </div>

      </section>

      <section style={{ marginTop: 35 }}>

        <div
          className="card"
          style={{
            padding: 25,
            background:
              "linear-gradient(135deg,#fff,#f6f0ff)",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 15,
            }}
          >

            <div
              style={{
                width: 54,
                height: 54,
                display: "grid",
                placeItems: "center",
                borderRadius: 18,
                background: "#ffe7f1",
                fontSize: 27,
              }}
            >
              📚
            </div>

            <div>

              <h3
                style={{
                  margin: 0,
                  color: "var(--purple)",
                  fontSize: 19,
                }}
              >
                Built for curious researchers ✨
              </h3>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 12,
                }}
              >
                Explore the dataset, inspect papers, experiment
                with predictions, and understand model behaviour.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

function FeatureCard({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="card"
      style={{
        padding: 22,
        display: "block",
      }}
    >

      <div
        style={{
          fontSize: 28,
          marginBottom: 12,
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          margin: 0,
          color: "var(--purple)",
          fontSize: 18,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: 12,
          marginBottom: 15,
        }}
      >
        {text}
      </p>

      <div
        style={{
          color: "var(--pink)",
          fontSize: 11,
          fontWeight: 900,
        }}
      >
        Explore <ArrowRight size={13} style={{ verticalAlign: "middle" }} />
      </div>

    </Link>
  );
}