import type { Meta, StoryObj } from "@storybook/vue3";

import BaseCheckbox from "./BaseCheckbox.vue";

const meta = {
  title: "Design System/Base/BaseCheckbox",
  component: BaseCheckbox,
} satisfies Meta<typeof BaseCheckbox>;

export default meta;

type Story = StoryObj<typeof BaseCheckbox>;

export const Default: Story = {
  args: {
    name: "checkboy",
  },
  render: (args) => ({
    setup() {
      return { args };
    },
    components: { BaseCheckbox },
    template:
      '<BaseCheckbox v-bind="args">Agree to our <a class="cursor-pointer text-primary underline">Terms</a> & <a class="cursor-pointer text-primary underline">Privacy Policy</a></BaseCheckbox>',
  }),
};
