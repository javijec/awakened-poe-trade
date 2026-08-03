<template>
  <div :class="$style.titlebar">
    <slot />
    <button @click="emit('click')" class="truncate">{{ title }}</button>
    <button @click.stop="emit('close')" tabindex="-1"
      :class="[$style.button, $style.close]" title="Close"><i class="fas fa-window-close"></i></button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()

const emit = defineEmits<{
  (e: 'click' | 'close'): void
}>()
</script>

<style lang="postcss" module>
.titlebar {
  color: rgba(238, 238, 238, .58);
  background: #0d0d0d;
  border-bottom: 1px solid rgba(163, 141, 109, .18);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2rem;
  line-height: 2rem;

  button {
    @apply px-3;
    font-family: FontinSmallCaps, FrizQuadrataC;
    letter-spacing: .04em;

    &:hover {
      color: #eee;
      background: rgba(238, 238, 238, .06);
    }

    &.close:hover {
      color: #eee;
      background: rgba(109, 28, 28, .72);
    }
  }
}
</style>
