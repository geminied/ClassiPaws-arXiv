"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [animations, setAnimations] =
    useState(true);

  const [decorations, setDecorations] =
    useState(true);

  const [defaultInput, setDefaultInput] =
    useState<"manual" | "dataset">(
      "manual"
    );

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
            ⚙️ PERSONALIZE
          </div>

          <h1>
            Make ClassiPaws yours! 🌸
          </h1>

          <p>
            Adjust the little details of your
            research companion.
          </p>

        </div>

      </div>

      <div
        style={{
          display: "grid",
          gap: 15,
          maxWidth: 750,
        }}
      >

        <SettingCard
          emoji="✨"
          title="Cute animations"
          description="Keep the little floating and hover effects."
        >
          <Toggle
            value={animations}
            onChange={setAnimations}
          />
        </SettingCard>

        <SettingCard
          emoji="🌸"
          title="Mascot decorations"
          description="Show the cute stars, paws, flowers, and mascots."
        >
          <Toggle
            value={decorations}
            onChange={setDecorations}
          />
        </SettingCard>

        <div className="card card-padding">

          <div
            style={{
              display: "flex",
              gap: 13,
              alignItems: "center",
            }}
          >

            <div style={{ fontSize: 27 }}>
              🐾
            </div>

            <div>
              <h3
                style={{
                  margin: 0,
                  color: "var(--purple)",
                }}
              >
                Default prediction input
              </h3>

              <p
                style={{
                  margin: "4px 0 15px",
                  fontSize: 12,
                }}
              >
                Choose what the Predict page opens
                with.
              </p>
            </div>

          </div>

          <div className="mode-switch">

            <button
              className={`mode-button ${
                defaultInput === "manual"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setDefaultInput("manual")
              }
            >
              ✍️ Manual
            </button>

            <button
              className={`mode-button ${
                defaultInput === "dataset"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setDefaultInput("dataset")
              }
            >
              📚 Dataset
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}

function SettingCard({
  emoji,
  title,
  description,
  children,
}: {
  emoji: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="card card-padding"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
      }}
    >

      <div
        style={{
          display: "flex",
          gap: 13,
          alignItems: "center",
        }}
      >

        <div
          style={{
            width: 48,
            height: 48,
            display: "grid",
            placeItems: "center",
            borderRadius: 16,
            background:
              "var(--purple-light)",
            fontSize: 23,
          }}
        >
          {emoji}
        </div>

        <div>

          <h3
            style={{
              margin: 0,
              color: "var(--purple)",
            }}
          >
            {title}
          </h3>

          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12,
            }}
          >
            {description}
          </p>

        </div>

      </div>

      {children}

    </div>
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 54,
        height: 30,
        border: 0,
        borderRadius: 999,
        padding: 3,
        background: value
          ? "var(--purple)"
          : "#d7d2e5",
        transition: "0.2s",
      }}
      aria-label="Toggle setting"
    >
      <span
        style={{
          display: "block",
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "white",
          transform: value
            ? "translateX(24px)"
            : "translateX(0)",
          transition: "0.2s",
        }}
      />
    </button>
  );
}