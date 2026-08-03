<template>
  <button
    @click="updateInput" :class="$style.toggle" :aria-pressed="modelValue">
    <span :class="[$style.track, { [$style.on]: modelValue }]"><span :class="$style.knob" /></span>
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UiToggle',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  setup (props, ctx) {
    return {
      updateInput () {
        ctx.emit('update:modelValue', !props.modelValue)
      }
    }
  }
})
</script>

<style lang="postcss" module>
.toggle {
  display: inline-flex;
  height: 1.375rem;
  align-items: center;
  gap: .375rem;
  color: rgba(238, 238, 238, .7);
}
.track {
  display: inline-flex;
  width: 1.5rem;
  height: .75rem;
  align-items: center;
  padding: 1px;
  border: 1px solid rgba(238, 238, 238, .16);
  border-radius: 999px;
  background: rgba(238, 238, 238, .04);
  transition: background-color .15s ease, border-color .15s ease;
}
.on { border-color: rgba(163, 141, 109, .65); background: rgba(163, 141, 109, .24); }
.knob {
  width: .5rem;
  height: .5rem;
  border-radius: 999px;
  background: rgba(238, 238, 238, .6);
  transition: transform .15s ease, background-color .15s ease;
}
.on .knob { transform: translateX(.75rem); background: #e8d8b9; }
.toggle:focus-visible { outline: none; }
.toggle:focus-visible .track { box-shadow: 0 0 0 2px rgba(163, 141, 109, .2); }
</style>
