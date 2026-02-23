// ─── Design Tokens ────────────────────────────────────────────────────────────
// Single source of truth. MUI theme AND :root CSS variables both read from here.
"use client";

export const tokens = {
  color: {
    primary: "#cde8b5",
    primaryLight: "#60A5FA",
    primaryDark: "#1D4ED8",
    primaryContrast: "#FFFFFF",

    secondary: "#7C3AED",
    secondaryLight: "#A78BFA",
    secondaryDark: "#5B21B6",
    secondaryContrast: "#FFFFFF",

    error: "#DC2626",
    errorLight: "#FCA5A5",
    errorDark: "#B91C1C",

    warning: "#D97706",
    warningLight: "#FCD34D",
    warningDark: "#B45309",

    info: "#0891B2",
    infoLight: "#67E8F9",
    infoDark: "#0E7490",

    success: "#16A34A",
    successLight: "#86EFAC",
    successDark: "#15803D",

    bg: "#F8FAFC",
    bgPaper: "#FFFFFF",
    surface: "#074d3a",
    surfaceHover: "#F8FAFC",

    textPrimary: "#243A5E",
    textSecondary: "#f8faf7",
    textDisabled: "#94A3B8",

    border: "#E2E8F0",
    borderSubtle: "#F1F5F9",
  },
  shadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    full: "9999px",
  },
  space: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
  },
  font: {
    sans: '"Inter", "Helvetica Neue", Arial, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
} as const;

// ─── CSS Variable Map ─────────────────────────────────────────────────────────
// Maps token paths → CSS custom property names injected into :root
export const cssVars: Record<string, string> = {
  "--color-primary": tokens.color.primary,
  "--color-primary-light": tokens.color.primaryLight,
  "--color-primary-dark": tokens.color.primaryDark,
  "--color-primary-contrast": tokens.color.primaryContrast,

  "--color-secondary": tokens.color.secondary,
  "--color-secondary-light": tokens.color.secondaryLight,
  "--color-secondary-dark": tokens.color.secondaryDark,
  "--color-secondary-contrast": tokens.color.secondaryContrast,

  "--color-error": tokens.color.error,
  "--color-error-light": tokens.color.errorLight,
  "--color-error-dark": tokens.color.errorDark,

  "--color-warning": tokens.color.warning,
  "--color-warning-light": tokens.color.warningLight,
  "--color-warning-dark": tokens.color.warningDark,

  "--color-info": tokens.color.info,
  "--color-info-light": tokens.color.infoLight,
  "--color-info-dark": tokens.color.infoDark,

  "--color-success": tokens.color.success,
  "--color-success-light": tokens.color.successLight,
  "--color-success-dark": tokens.color.successDark,

  "--color-bg": tokens.color.bg,
  "--color-bg-paper": tokens.color.bgPaper,
  "--color-surface": tokens.color.surface,
  "--color-surface-hover": tokens.color.surfaceHover,

  "--color-text-primary": tokens.color.textPrimary,
  "--color-text-secondary": tokens.color.textSecondary,
  "--color-text-disabled": tokens.color.textDisabled,

  "--color-border": tokens.color.border,
  "--color-border-subtle": tokens.color.borderSubtle,

  "--shadow-sm": tokens.shadow.sm,
  "--shadow-md": tokens.shadow.md,
  "--shadow-lg": tokens.shadow.lg,

  "--radius-sm": tokens.radius.sm,
  "--radius-md": tokens.radius.md,
  "--radius-lg": tokens.radius.lg,
  "--radius-full": tokens.radius.full,

  "--font-sans": tokens.font.sans,
  "--font-mono": tokens.font.mono,
  "--variant-containedColor": tokens.color.textPrimary,
};
