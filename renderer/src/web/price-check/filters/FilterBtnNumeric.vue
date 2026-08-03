<template>
  <div :class="[$style.btn, { [$style.active]: !filter.disabled }]">
    <button @click="filter.disabled = !filter.disabled" class="pl-2">{{ name }}</button>
    <input :class="$style.input" step="any" type="number"
      v-model.number="inputMin"
      @focus="inputFocus"
      @blur="inputMinBlur"
      @mousewheel.stop
      :style="{ width: `${1.2 + Math.max(String(inputMin).length, 2)}ch` }"
    >
    <template v-if="'max' in filter">
      <span>–</span>
      <input :class="$style.input" step="any" type="number"
        v-model.number="inputMax"
        @focus="inputFocus"
        @mousewheel.stop
        :style="{ width: `${1.2 + Math.max(String(inputMax).length, 2)}ch` }"
        placeholder="…"
      >
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch } from 'vue'
import { FilterNumeric } from './interfaces'

export default defineComponent({
  emits: [], // mutates filter
  props: {
    filter: {
      type: Object as PropType<FilterNumeric>,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const _inputMin = ref<number | ''>('')
    watch(() => props.filter, (filter) => {
      _inputMin.value = filter.value
    }, { immediate: true })

    const _inputMax = ref<number | ''>('')
    watch(() => props.filter, (filter) => {
      _inputMax.value = filter.max ?? ''
    }, { immediate: true })

    return {
      inputMin: computed<number | ''>({
        get () { return _inputMin.value },
        set (value) {
          _inputMin.value = value
          if (typeof value === 'number') {
            props.filter.value = value
          } else {
            props.filter.value = 0
          }
        }
      }),
      inputMax: computed<number | ''>({
        get () { return _inputMax.value },
        set (value) {
          _inputMax.value = value
          if (typeof value === 'number') {
            props.filter.max = value
          } else {
            props.filter.max = undefined
          }
        }
      }),
      inputFocus (e: FocusEvent) {
        const target = e.target as HTMLInputElement
        target.select()
        props.filter.disabled = false
      },
      inputMinBlur () {
        if (typeof _inputMin.value !== 'number') {
          _inputMin.value = 0
          props.filter.disabled = true
        }
      }
    }
  }
})
</script>

<style lang="postcss" module>
.btn {
  background: rgba(238, 238, 238, .025);
  border: 1px solid rgba(238, 238, 238, .1);
  border-radius: 3px;
  @apply pr-1;
  line-height: 1.25rem;

  &.active {
    border-color: rgba(163, 141, 109, .55);
    color: #e8d8b9;
  }
}

.input {
  @apply text-center;
  @apply bg-transparent;
  color: rgba(238, 238, 238, .82);
  @apply select-all;

  &:hover,
  &:focus {
    background: rgba(163, 141, 109, .12);
    margin-top: -1px;
    margin-bottom: -1px;
    border-top: 1px solid rgba(163, 141, 109, .55);
    border-bottom: 1px solid rgba(163, 141, 109, .55);
  }

  &::placeholder {
    color: rgba(238, 238, 238, .42);
  }

  &:focus { cursor: none; }
}
</style>
