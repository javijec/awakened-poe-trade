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
.warning { @apply border-yellow-900; }
.info { @apply border-blue-900; }
</style>
