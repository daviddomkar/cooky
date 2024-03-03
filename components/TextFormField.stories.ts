import type { Meta, StoryObj } from "@storybook/vue3";

import TextFormField from "./TextFormField.vue";

const meta: Meta<typeof TextFormField> = {
  title: "TextFormField",
  component: TextFormField,
};

export default meta;

type Story = StoryObj<typeof TextFormField>;

export const Default: Story = {
  args: {
    label: "Label",
  },
  render: (args) => ({
    components: { TextFormField },
    setup() {
      return { args };
    },
    template: '<TextFormField v-bind="args">{{ args.default }}</TextFormField>',
  }),
};
