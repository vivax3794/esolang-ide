<template>
  <v-textarea rows="10" :model-value="props.modelValue"
    @update:modelValue="(newValue) => emit('update:modelValue', newValue)" />
</template>

<script lang="ts" setup>

const props = defineProps<{
  modelValue: String;
}>();
const emit = defineEmits(["update:modelValue"]);
</script>
