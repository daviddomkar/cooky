<script setup lang="ts">
type Props = {
  name: string;
  label: string;
};

defineProps<Props>();

const errors = useFormErrors();
</script>

<template>
  <div>
    <TextField :label="label" :name="`${name}.title`" />
    <div class="box-border sm:pl-12">
      <TextField
        class="h-32"
        :class="{
          'h-34': errors[`${name}.content`],
        }"
        label="Content"
        multiline
        :name="`${name}.content`"
      />
    </div>
  </div>
</template>
