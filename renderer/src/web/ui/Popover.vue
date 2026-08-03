<template>
  <component :is="tagName" ref="target" v-bind="$attrs">
    <slot name="target" />
  </component>
  <div ref="content">
    <slot name="content" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, PropType } from 'vue'
import tippy, { Instance, Placement } from 'tippy.js'
import 'tippy.js/dist/tippy.css'

export default defineComponent({
  name: 'UiPopover',
  inheritAttrs: false,
  props: {
    trigger: {
      type: String,
      default: undefined
    },
    boundary: {
      type: String,
      default: undefined
    },
    placement: {
      type: String as PropType<Placement>,
      default: undefined
    },
    arrow: {
      type: Boolean,
      default: true
    },
    delay: {
      type: [Array, Number] as PropType<number | [number | null, number | null]>,
      default: 0
    },
    theme: {
      type: String,
      default: 'poe'
    },
    tagName: {
      type: String,
      default: 'span'
    }
  },
  setup (props) {
    const target = ref<HTMLElement>(null!)
    const content = ref<HTMLElement>(null!)
    let instance: Instance

    onMounted(() => {
      instance = tippy(target.value, {
        content: content.value,
        interactive: true,
        theme: props.theme,
        trigger: props.trigger,
        placement: props.placement,
        arrow: props.arrow,
        delay: props.delay,
        maxWidth: 'none',
        popperOptions: {
          modifiers: [
            ...(props.boundary
              ? [{
                  name: 'preventOverflow',
                  options: {
                    boundary: document.querySelector(props.boundary)
                  }
                }]
              : [])
          ]
        }
      })
    })

    onBeforeUnmount(() => {
      instance.destroy()
    })

    return {
      target,
      content
    }
  }
})
</script>

<style lang="postcss">
.tippy-box {
  @apply rounded;
}

.tippy-content {
  @apply p-1;
}

.tippy-box[data-theme~='poe'] {
  border: 1px solid #75582c;
  border-radius: 2px;
  background: linear-gradient(135deg, rgba(207, 164, 79, .1), transparent 42%), linear-gradient(180deg, #1c1710, #0b0907);
  color: #e3d2ad;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .72), inset 0 1px 0 rgba(255, 227, 157, .13), 0 10px 28px rgba(0, 0, 0, .62);
}

.tippy-box[data-theme~='poe'] > .tippy-arrow { color: #1c1710; }
.tippy-box[data-theme~='poe'][data-placement^='top'] > .tippy-arrow::before { border-top-color: #75582c; }
.tippy-box[data-theme~='poe'][data-placement^='bottom'] > .tippy-arrow::before { border-bottom-color: #75582c; }
.tippy-box[data-theme~='poe'][data-placement^='left'] > .tippy-arrow::before { border-left-color: #75582c; }
.tippy-box[data-theme~='poe'][data-placement^='right'] > .tippy-arrow::before { border-right-color: #75582c; }
</style>
