import { createTheme, type Theme } from "@mui/material/styles";
import { tokens } from "./Tokens";

// MUI palette requires real color values (not CSS vars), so we pull from tokens.
export const theme: Theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: tokens.color.primary,
      light: tokens.color.primaryLight,
      dark: tokens.color.primaryDark,
      contrastText: tokens.color.primaryContrast,
    },
    secondary: {
      main: tokens.color.secondary,
      light: tokens.color.secondaryLight,
      dark: tokens.color.secondaryDark,
      contrastText: tokens.color.secondaryContrast,
    },
    error: {
      main: tokens.color.error,
      light: tokens.color.errorLight,
      dark: tokens.color.errorDark,
    },
    warning: {
      main: tokens.color.warning,
      light: tokens.color.warningLight,
      dark: tokens.color.warningDark,
    },
    info: {
      main: tokens.color.info,
      light: tokens.color.infoLight,
      dark: tokens.color.infoDark,
    },
    success: {
      main: tokens.color.success,
      light: tokens.color.successLight,
      dark: tokens.color.successDark,
    },
    background: {
      default: tokens.color.bg,
      paper: tokens.color.bgPaper,
    },
    text: {
      primary: tokens.color.textPrimary,
      secondary: tokens.color.textSecondary,
      disabled: tokens.color.textDisabled,
    },
    divider: tokens.color.border,
  },
  typography: {
    fontFamily: tokens.font.sans,
    h1: { fontWeight: 700, fontSize: "2.5rem", lineHeight: 1.2 },
    h2: { fontWeight: 700, fontSize: "2rem", lineHeight: 1.25 },
    h3: { fontWeight: 600, fontSize: "1.75rem", lineHeight: 1.3 },
    h4: { fontWeight: 600, fontSize: "1.5rem", lineHeight: 1.35 },
    h5: { fontWeight: 600, fontSize: "1.25rem", lineHeight: 1.4 },
    h6: { fontWeight: 600, fontSize: "1rem", lineHeight: 1.4 },
    subtitle1: { fontWeight: 500, fontSize: "1rem" },
    subtitle2: { fontWeight: 500, fontSize: "0.875rem" },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontSize: "0.875rem", lineHeight: 1.57 },
    button: { fontWeight: 600, textTransform: "none" },
    caption: { fontSize: "0.75rem" },
    overline: { fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em" },
  },
  shape: { borderRadius: 10 },
  spacing: 8,
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, padding: "8px 20px", fontWeight: 600 },
        sizeLarge: { padding: "12px 28px", fontSize: "1rem" },
        sizeSmall: { padding: "4px 12px", fontSize: "0.8125rem" },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid var(--color-border)`,
          backgroundColor: "var(--color-bg-paper)",
        },
      },
    },
    MuiTextField: { defaultProps: { variant: "outlined", size: "small" } },
    MuiChip: { styleOverrides: { root: { fontWeight: 500, borderRadius: 8 } } },
    MuiTooltip: { defaultProps: { arrow: true } },
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiAppBar: { defaultProps: { elevation: 0, color: "inherit" } },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "var(--color-border)" } },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 32,
          padding: "6px 16px",
          borderRadius: 7,
          fontWeight: 400,
          fontSize: "0.875rem",
          textTransform: "none",
          color: "var(--color-textPrimary)",
          transition:
            "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
          "&:hover": {
            color: "var(--color-text-primary)",
            backgroundColor: "var(--color-border-subtle)",
          },
          "&.Mui-selected": {
            color: "var(--color-text-primary)",
            fontWeight: 700,
            backgroundColor: "var(--color-bg-paper)",
            boxShadow: "var(--shadow-sm)",
          },
          "&.Mui-disabled": {
            color: "var(--color-text-disabled)",
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          overflow: "hidden",
          background: "var(--color-bg)",
        },
      },
    },
    MuiTable: {
      defaultProps: { size: "medium" },
      styleOverrides: {
        root: {
          borderCollapse: "separate",
          borderSpacing: "0 15px",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableRow-head": {
            backgroundColor: "var(--color-bg)",
            "&:hover": {
              backgroundColor: "var(--color-bg) !important",
            },
          },
          "& .MuiTableCell-head": {
            color: "var(--color-text-primary)",
            fontWeight: 600,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: "1px solid var(--color-border)",
            padding: "12px 16px",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--color-surface)",
          borderSpacing: "0 10px",
          borderRadius: 16,
          transition: "background-color 0.15s ease",
          "&:hover": {
            backgroundColor: "var(--color-surface) !important",
          },
          "&.Mui-selected": {
            backgroundColor: "var(--color-primary-light) !important",
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          color: "var(--color-text-secondary)",
          "& .MuiTableRow-root": {
            transition: "background-color 0.15s ease",
            "&:hover": { backgroundColor: "var(--color-surface-hover)" },
            "&:last-child .MuiTableCell-body": { borderBottom: "none" },
          },
          "& .MuiTableCell-body": {
            color: "var(--color-text-secondary)",
            fontWeight: "bold",
            fontSize: "0.875rem",
            padding: "14px 16px",
            borderBottom: "1px solid var(--color-border-subtle)",
          },
        },
      },
    },
    MuiTableFooter: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--color-surface)",
          "& .MuiTableCell-footer": {
            borderTop: "1px solid var(--color-border)",
            borderBottom: "none",
            color: "var(--color-text-secondary)",
            fontSize: "0.875rem",
            fontWeight: 500,
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop: "1px solid var(--color-border)",
          color: "var(--color-text-secondary)",
        },
        select: { fontWeight: 500 },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: "var(--color-text-secondary)",
          fontWeight: 600,
          "&:hover": { color: "var(--color-text-primary)" },
          "&.Mui-active": {
            color: "var(--color-primary)",
            "& .MuiTableSortLabel-icon": { color: "var(--color-primary)" },
          },
        },
      },
    },
  },
});
