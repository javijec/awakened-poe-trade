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
  color: #dfd3b6;
}
.track {
  display: inline-flex;
  width: 1.5rem;
  height: .75rem;
  align-items: center;
  padding: 1px;
  border: 1px solid #5e4827;
  border-radius: 2px;
  background: linear-gradient(#090806, #21170d);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, .75);
  transition: background-color .15s ease, border-color .15s ease;
}
.on { border-color: #b78d43; background: linear-gradient(#5f441e, #2a1c0d); }
.knob {
  width: .5rem;
  height: .5rem;
  border-radius: 1px;
  background: #8c7b5a;
  box-shadow: inset 0 1px 0 rgba(255, 237, 188, .3);
  transition: transform .15s ease, background-color .15s ease;
}
.on .knob { transform: translateX(.75rem); background: #e2bd68; }
.toggle:focus-visible { outline: none; }
.toggle:focus-visible .track { box-shadow: 0 0 0 2px rgba(163, 141, 109, .2); }
</style>
