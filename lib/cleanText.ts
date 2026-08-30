/**
 * Converts common LaTeX notation into clean readable text.
 *
 * This is intended for displaying arXiv titles/abstracts as normal text.
 * It does NOT attempt to render mathematical equations.
 */

export function cleanLatex(text: string = ""): string {
  if (!text) {
    return "";
  }

  let result = text;

  // ---------------------------------------------------------
  // Remove LaTeX math delimiters
  // ---------------------------------------------------------

  result = result.replace(/\$\$(.*?)\$\$/g, "$1");
  result = result.replace(/\\\[(.*?)\\\]/g, "$1");
  result = result.replace(/\\\((.*?)\\\)/g, "$1");

  // Single $ delimiters
  result = result.replace(/\$(.*?)\$/g, "$1");

  // ---------------------------------------------------------
  // Common LaTeX formatting commands
  // ---------------------------------------------------------

  result = result.replace(
    /\\textbf\{([^{}]*)\}/g,
    "$1"
  );

  result = result.replace(
    /\\textit\{([^{}]*)\}/g,
    "$1"
  );

  result = result.replace(
    /\\emph\{([^{}]*)\}/g,
    "$1"
  );

  result = result.replace(
    /\\texttt\{([^{}]*)\}/g,
    "$1"
  );

  result = result.replace(
    /\\mathrm\{([^{}]*)\}/g,
    "$1"
  );

  result = result.replace(
    /\\mathbf\{([^{}]*)\}/g,
    "$1"
  );

  result = result.replace(
    /\\mathit\{([^{}]*)\}/g,
    "$1"
  );

  // ---------------------------------------------------------
  // Common LaTeX symbols
  // ---------------------------------------------------------

  const symbols: Record<string, string> = {
    "\\alpha": "α",
    "\\beta": "β",
    "\\gamma": "γ",
    "\\delta": "δ",
    "\\epsilon": "ε",
    "\\varepsilon": "ε",
    "\\zeta": "ζ",
    "\\eta": "η",
    "\\theta": "θ",
    "\\vartheta": "ϑ",
    "\\iota": "ι",
    "\\kappa": "κ",
    "\\lambda": "λ",
    "\\mu": "μ",
    "\\nu": "ν",
    "\\xi": "ξ",
    "\\pi": "π",
    "\\varpi": "ϖ",
    "\\rho": "ρ",
    "\\sigma": "σ",
    "\\varsigma": "ς",
    "\\tau": "τ",
    "\\upsilon": "υ",
    "\\phi": "φ",
    "\\varphi": "φ",
    "\\chi": "χ",
    "\\psi": "ψ",
    "\\omega": "ω",

    "\\Gamma": "Γ",
    "\\Delta": "Δ",
    "\\Theta": "Θ",
    "\\Lambda": "Λ",
    "\\Xi": "Ξ",
    "\\Pi": "Π",
    "\\Sigma": "Σ",
    "\\Upsilon": "Υ",
    "\\Phi": "Φ",
    "\\Psi": "Ψ",
    "\\Omega": "Ω",

    "\\rightarrow": "→",
    "\\to": "→",
    "\\leftarrow": "←",
    "\\gets": "←",
    "\\leftrightarrow": "↔",

    "\\Rightarrow": "⇒",
    "\\Leftarrow": "⇐",
    "\\Leftrightarrow": "⇔",

    "\\times": "×",
    "\\cdot": "·",
    "\\pm": "±",
    "\\mp": "∓",
    "\\oplus": "⊕",
    "\\otimes": "⊗",
    "\\ominus": "⊖",

    "\\leq": "≤",
    "\\le": "≤",
    "\\geq": "≥",
    "\\ge": "≥",
    "\\neq": "≠",
    "\\ne": "≠",
    "\\approx": "≈",
    "\\sim": "∼",

    "\\infty": "∞",
    "\\partial": "∂",
    "\\nabla": "∇",

    "\\in": "∈",
    "\\notin": "∉",
    "\\subset": "⊂",
    "\\subseteq": "⊆",
    "\\cup": "∪",
    "\\cap": "∩",

    "\\forall": "∀",
    "\\exists": "∃",

    "\\propto": "∝",
    "\\sum": "Σ",
    "\\prod": "Π",

    "\\ldots": "…",
    "\\cdots": "⋯",
    "\\dots": "…",

    "\\%": "%",
    "\\&": "&",
    "\\_": "_",
    "\\#": "#",
    "\\$": "$",

    "\\textbackslash": "\\",
  };

  for (const [latex, symbol] of Object.entries(symbols)) {
    result = result.split(latex).join(symbol);
  }

  // ---------------------------------------------------------
  // Superscripts and subscripts
  // ---------------------------------------------------------

  result = result.replace(
    /\^\{([^{}]*)\}/g,
    "^$1"
  );

  result = result.replace(
    /_\{([^{}]*)\}/g,
    "_$1"
  );

  // ---------------------------------------------------------
  // Special accented characters
  // ---------------------------------------------------------

  result = result.replace(
    /\\v\{([^{}]*)\}/g,
    "$1"
  );

  result = result.replace(
    /\\'([a-zA-Z])/g,
    "$1"
  );

  result = result.replace(
    /\\"([a-zA-Z])/g,
    "$1"
  );

  result = result.replace(
    /\\`([a-zA-Z])/g,
    "$1"
  );

  result = result.replace(
    /\\\^([a-zA-Z])/g,
    "$1"
  );

  result = result.replace(
    /\\~([a-zA-Z])/g,
    "$1"
  );

  // ---------------------------------------------------------
  // Remove remaining braces
  // ---------------------------------------------------------

  result = result.replace(/[{}]/g, "");

  // ---------------------------------------------------------
  // Remove common LaTeX commands that don't contribute
  // visible text
  // ---------------------------------------------------------

  result = result.replace(
    /\\(?:small|large|Large|Large|smallskip|medskip|bigskip)\b/g,
    ""
  );

  // ---------------------------------------------------------
  // Clean escaped whitespace
  // ---------------------------------------------------------

  result = result.replace(/\\\s+/g, " ");

  // ---------------------------------------------------------
  // Remove remaining backslash commands.
  //
  // Example:
  // \foo{bar} -> bar
  // ---------------------------------------------------------

  result = result.replace(
    /\\[a-zA-Z]+\*?/g,
    ""
  );

  // ---------------------------------------------------------
  // Clean multiple spaces
  // ---------------------------------------------------------

  result = result.replace(/\s+/g, " ");

  return result.trim();
}