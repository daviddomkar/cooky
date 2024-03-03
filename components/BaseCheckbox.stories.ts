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
    modelValue: "terms",
    checked: true,
    default: "Agree Terms & Conditions",
  },
  render: (args) => ({
    setup() {
      return { args };
    },
    components: { BaseCheckbox },
    template: '<BaseCheckbox v-bind="args">{{ args.default }}</BaseCheckbox>',
  }),
};
