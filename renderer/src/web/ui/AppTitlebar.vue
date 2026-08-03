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
  color: #d6bd83;
  background: linear-gradient(180deg, #302310, #120e09 74%, #080705);
  border: 1px solid #604822;
  border-bottom-color: #8b6630;
  box-shadow: inset 0 1px 0 rgba(255, 226, 157, .17), inset 0 -1px 0 rgba(0, 0, 0, .72);
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
      color: #fff0bd;
      background: rgba(185, 149, 82, .14);
    }

    &.close:hover {
      color: #ffe3c4;
      background: linear-gradient(#713427, #30120e);
    }
  }
}
</style>
