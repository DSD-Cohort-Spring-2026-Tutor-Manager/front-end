"use client";

import { type ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./Theme";
import { cssVars } from "./Tokens";

// Build the :root block directly from cssVars — tokens.ts is the only source of truth.
const rootCSS = `:root {\n${Object.entries(cssVars)
  .map(([k, v]) => `  ${k}: ${v};`)
  .join("\n")}\n}`;

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={theme}>
      {/* :root vars generated from tokens.ts — never hand-edit globals.css for these */}
      <style dangerouslySetInnerHTML={{ __html: rootCSS }} />
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
