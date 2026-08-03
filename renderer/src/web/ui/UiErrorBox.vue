<template>
  <div :class="$style.box" role="alert">
    <h4 :class="$style.title">
      <i class="fas fa-exclamation-triangle" />
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
  border: 1px solid rgba(163, 74, 60, .72);
  background:
    linear-gradient(115deg, rgba(139, 55, 43, .18), transparent 56%),
    rgba(14, 13, 12, .96);
  @apply rounded;
  @apply px-4 py-2;
  @apply flex flex-col gap-y-1;
  color: rgba(225, 219, 205, .84);
  box-shadow: inset 0 1px 0 rgba(255, 223, 155, .07), 0 8px 20px rgba(0, 0, 0, .18);

  & :global(p) {
    @apply m-0;
    line-height: 1.45;
  }
}

.title {
  @apply flex items-center gap-2;
  color: #e8bc72;
  font-family: FontinSmallCaps, FrizQuadrataC;
  font-size: .8rem;
  font-weight: 700;
  letter-spacing: .055em;
  text-transform: uppercase;

  & i {
    color: #d9a441;
  }
}

.actions {
  @apply flex gap-x-2 justify-end;
  @apply mt-1;

  & button {
    min-width: 4rem;
  }
}
</style>
