<script setup lang="ts">
import type { Output } from "valibot";
import type { SubmissionHandler } from "vee-validate";

type Props = {
  user?: {
    username: string;
    name: string;
    profileImageId?: string | null;
  };
  comment?: {
    id: string;
    content: string;
    author: {
      username: string;
      name: string;
      profileImageId?: string | null;
    };
    hearts: {
      author: {
        id: string;
        username: string;
      };
    }[];
  };
  onSubmit?: SubmissionHandler<Output<typeof CommentFormSchema>>;
  onDelete?: (id: string) => Promise<void>;
  onLike?: (id: string) => Promise<void>;
  onUnlike?: (id: string) => Promise<void>;
  reply?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  user: undefined,
  comment: undefined,
  onSubmit: undefined,
  onDelete: undefined,
  onLike: undefined,
  onUnlike: undefined,
  reply: false,
});

const { handleSubmit, handleReset, isSubmitting, setValues } = useForm({
  validationSchema: toTypedSchema(CommentFormSchema),
  initialValues: {
    content: props.comment?.content ?? "",
  },
});

const changingLikeness = ref(false);

const editing = ref(false);

const canCreate = computed(() => props.user && !props.comment);

const canEdit = computed(
  () => props.user && props.user?.username === props.comment?.author?.username,
);

const submit = handleSubmit(async (values, opts) => {
  await props.onSubmit?.(values, opts as any);
  editing.value = false;
  opts.resetForm();
});

const editComment = () => {
  setValues({
    content: props.comment?.content ?? "",
  });
  editing.value = true;
};

const deleteComment = async () => {
  await props.onDelete?.(props.comment!.id);
};

const isLiked = computed(() =>
  props.comment?.hearts.some(
    (heart) => heart.author.username === props.user?.username,
  ),
);

const toggleLikeness = async () => {
  try {
    changingLikeness.value = true;

    if (isLiked.value) {
      await props.onUnlike?.(props.comment!.id);
    } else {
      await props.onLike?.(props.comment!.id);
    }
  } finally {
    changingLikeness.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-end justify-between gap-4">
      <ProfileLink class="self-start" :user="comment?.author ?? user!" />
      <div v-if="canEdit" class="flex gap-2">
        <BaseButton
          v-if="!editing"
          spread="compact"
          variant="secondary"
          @click="editComment"
        >
          <div class="i-material-symbols:edit h-6 w-6" />
        </BaseButton>
        <BaseButton
          v-else
          spread="compact"
          variant="danger"
          @click="editing = false"
        >
          <div class="i-material-symbols:close-rounded h-6 w-6" />
        </BaseButton>
        <ConfirmationDialog
          v-if="!editing"
          :on-confirm="deleteComment"
          :reason="
            reply
              ? 'Your reply will be deleted.'
              : 'Your comment will be deleted.'
          "
        >
          <template #activator="{ open }">
            <BaseButton spread="compact" variant="danger" @click="open">
              <div class="i-material-symbols:delete h-6 w-6" />
            </BaseButton>
          </template>
        </ConfirmationDialog>
      </div>
    </div>

    <form
      v-if="canCreate || (canEdit && editing)"
      class="flex flex-col"
      @reset="handleReset"
      @submit="submit"
    >
      <TextField
        class="h-32"
        :label="reply ? 'Write a reply' : 'Write a comment'"
        multiline
        name="content"
      />
      <BaseButton class="self-end" :loading="isSubmitting" type="submit">
        Submit
      </BaseButton>
    </form>
    <div v-if="comment && !editing" class="flex flex-col gap-4">
      <p class="my-0 whitespace-pre-wrap">{{ comment.content }}</p>
      <div
        v-if="user && comment?.author?.username !== user?.username"
        class="flex items-center gap-4"
      >
        <BaseButton
          density="compact"
          :disabled="changingLikeness"
          spread="none"
          variant="transparent"
          @click="toggleLikeness"
        >
          <template #icon>
            <div
              class="i-cooky:favourites h-6 w-6"
              :class="{
                'text-red': isLiked,
              }"
            />
          </template>
          {{ comment.hearts.length }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
