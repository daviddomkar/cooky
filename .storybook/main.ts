import type { StorybookConfig } from "@storybook-vue/nuxt";

const config: StorybookConfig = {
  stories: ["../components/**/*.mdx", "../components/**/*.stories.ts"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook-vue/nuxt",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  // @ts-ignore
  staticDirs: ["./public"],
};
export default config;
