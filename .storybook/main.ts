import type { StorybookConfig } from "@storybook-vue/nuxt";

const config: StorybookConfig = {
  stories: ["../components/**/*.mdx", "../components/**/*.stories.ts"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook-vue/nuxt",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
