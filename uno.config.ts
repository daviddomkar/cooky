import type { Theme } from "unocss/preset-uno";
import { defineConfig, presetUno, presetIcons, presetWebFonts } from "unocss";
import { presetForms } from "@julr/unocss-preset-forms";
import transformerDirectives from "@unocss/transformer-directives";
import { presetTheme } from "unocss-preset-theme";

const lightTheme = {
  colors: {
    primary: "#ffbd3e",
    secondary: "#ff5f54",
    surface: "#ffffff",
    "surface-container": "#f5f5f5",
    on: {
      primary: "#ffffff",
      surface: "#101010",
      "surface-variant": "#b6b6b6",
    },
  },
} as Theme;

const darkTheme = {
  colors: {
    primary: "#ffbd3e",
    secondary: "#ff5f54",
    surface: "#222222",
    "surface-container": "#101010",
    on: {
      primary: "#ffffff",
      surface: "#ffffff",
      "surface-variant": "#ffffff",
    },
  },
} as Theme;

export default defineConfig({
  presets: [
    presetForms(),
    presetUno({
      dark: "media",
    }),
    presetIcons(),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: "ABeeZee:400",
        display: "Koulen:400",
      },
    }),
    presetTheme({
      theme: {
        dark: darkTheme,
      },
    }),
  ],
  transformers: [transformerDirectives()],
  preflights: [
    {
      getCSS: () => {
        return `
          body {
            @apply font-sans text-on-surface bg-surface;
          }

          h1, h2, h3, h4, h5, h6 {
            @apply font-display font-normal;
          }
        `;
      },
    },
  ],
  theme: lightTheme,
});
