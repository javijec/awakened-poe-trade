<template>
  <section class="poe-panel" :class="$style[variant]">
    <slot />
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'UiPanel',
  props: {
    variant: {
      type: String as PropType<'default' | 'warning' | 'info'>,
      default: 'default'
    }
  }
})
</script>

<style lang="postcss" module>
.warning { border-color: #8d5829; }
.info { border-color: #4a6582; }
</style>
