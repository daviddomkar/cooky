import type { Meta, StoryObj } from "@storybook/vue3";

import BaseDialog from "./BaseDialog.vue";
import BaseButton from "./BaseButton.vue";

const meta: Meta<typeof BaseDialog> = {
  title: "Design System/Base/BaseDialog",
  component: BaseDialog,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof BaseDialog>;

export const Default: Story = {
  args: {
    title: "Awesome Dialog",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  render: (args) => ({
    components: { BaseDialog, BaseButton },
    setup() {
      const dialog = ref<boolean>(true);

      return { args, dialog };
    },
    template: `
      <BaseDialog v-bind="args" v-model="dialog">
        <template #activator="{ open }">
          <BaseButton @click="open">Open Dialog</BaseButton>
        </template>
        <div class="flex flex-row-reverse gap-2">
          <BaseButton expanded>Save</BaseButton>
          <BaseButton expanded variant="danger" @click="dialog = false">Close</BaseButton>
        </div>
      </BaseDialog>`,
  }),
};
