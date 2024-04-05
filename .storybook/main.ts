import type { StorybookConfig } from "@storybook-vue/nuxt";

const config: StorybookConfig = {
  stories: ["../components/**/*.mdx", "../components/**/*.stories.ts"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-themes",
    "@storybook/addon-actions",
  ],
  framework: {
    name: "@storybook-vue/nuxt",
    options: {
      // @ts-ignore
      docgen :"vue-component-meta"
    },
  },
  docs: {
    autodocs: "tag",
  },
  // @ts-ignore
  staticDirs: ["./public"],
};
export default config;
