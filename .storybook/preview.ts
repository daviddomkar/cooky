import { setup, type Preview, type VueRenderer } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import { withThemeByClassName } from "@storybook/addon-themes";

setup((app) => {
  app.component("RouterLink", {
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    methods: {
      log() {
        action("link target")(this.to);
      },
    },
    template: '<a @click="log"><slot></slot></a>',
  });
});

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    withThemeByClassName<VueRenderer>({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
