<template>
  <div :class="$style.box" role="alert">
    <h4 class="text-red-300 flex items-center gap-2">
      <i class="fas fa-exclamation-triangle text-yellow-600" />
      <slot name="name">Error comes here.</slot>
    </h4>
    <slot />
    <div v-if="$slots.actions" :class="$style.actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UiErrorBox'
})
</script>

<style lang="postcss" module>
.box {
  @apply border border-red-900 bg-gray-900;
  @apply rounded;
  @apply px-4 py-2;
  @apply flex flex-col gap-y-1;
  background-image: linear-gradient(135deg, rgba(212, 160, 69, .05), transparent 44%);
  box-shadow: inset 0 1px 0 rgba(255, 223, 155, .06);
}

.actions {
  @apply flex gap-x-1 justify-end;

  & button {
    min-width: 4rem;
  }
}
</style>
