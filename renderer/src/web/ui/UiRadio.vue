<template>
  <button
    @click="updateInput"
    :class="$style['radio']">
    <i v-if="!isChecked" class="far fa-circle"></i>
    <i v-else class="fas fa-check-circle"></i>
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'UiRadio',
  emits: ['update:modelValue'],
  props: {
    value: {
      type: null,
      required: true
    },
    modelValue: {
      type: null,
      required: true
    }
  },
  setup (props, ctx) {
    return {
      isChecked: computed(() => {
        return props.modelValue === props.value
      }),
      updateInput () {
        ctx.emit('update:modelValue', props.value)
      }
    }
  }
})
</script>

<style lang="postcss" module>
.radio {
  display: flex;
  @apply gap-x-1;
  align-items: baseline;
  text-align: left;
  color: #dfd3b6;

  & i { color: #c79a4b; text-shadow: 0 1px 1px #000; }
  &:hover { color: #fff0c6; }
}
</style>
