export const CLASS_INFO: Record<
  string,
  {
    name: string;
    emoji: string;
  }
> = {

  cs: {
    name: "Computer Science",
    emoji: "💻"
  },

  math: {
    name: "Mathematics",
    emoji: "📐"
  },

  physics: {
    name: "Physics",
    emoji: "🌌"
  },

  stat: {
    name: "Statistics",
    emoji: "📊"
  },

  "q-bio": {
    name: "Quantitative Biology",
    emoji: "🧬"
  },

  "q-fin": {
    name: "Quantitative Finance",
    emoji: "💰"
  },

  eess: {
    name:
      "Electrical Engineering & Systems Science",
    emoji: "⚡"
  },

  econ: {
    name: "Economics",
    emoji: "💼"
  }
};


export function getClassInfo(
  value: string
) {

  return (
    CLASS_INFO[value] || {
      name: value,
      emoji: "📚"
    }
  );
}