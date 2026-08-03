<template>
  <div class="flex gap-px">
    <template v-if="builtin">
      <button @click="open(false)" :class="[$style.button, $style.left]">{{ t('Trade') }}</button>
      <button @click="open(true)" :class="[$style.button, $style.right]"><i class="fas fa-external-link-alt text-xs" /></button>
    </template>
    <button v-else
      @click="open(true)" :class="$style.button">{{ t('Trade') }} <i class="fas fa-external-link-alt text-xs" /></button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, inject, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Host } from '@/web/background/IPC'
import { AppConfig } from '@/web/Config'
import { PriceCheckWidget } from '@/web/overlay/widgets'

export default defineComponent({
  props: {
    getLink: {
      type: Function as PropType<() => string>,
      required: true
    }
  },
  setup (props) {
    const showBrowser = inject<(url: string) => void>('builtin-browser')!
    const { t } = useI18n()

    return {
      t,
      builtin: computed(() => {
        if (!Host.isElectron) return false
        const priceCheck = AppConfig('price-check') as PriceCheckWidget
        return priceCheck.builtinBrowser
      }),
      open (isExternal: boolean) {
        const link = props.getLink()
        if (isExternal) {
          window.open(link)
        } else {
          showBrowser(link)
        }
      }
    }
  }
})
</script>

<style lang="postcss" module>
.button {
  min-height: 1.5rem;
  padding: 0 .5rem;
  border: 1px solid rgba(163, 141, 109, .38);
  border-radius: 3px;
  background: rgba(163, 141, 109, .14);
  color: #e8d8b9;
  font-family: FontinSmallCaps, FrizQuadrataC;
  font-size: .75rem;
  letter-spacing: .04em;
  transition: background-color .15s ease, border-color .15s ease;

  &:hover {
    border-color: rgba(196, 177, 140, .72);
    background: rgba(163, 141, 109, .25);
  }
}

.left { border-top-right-radius: 0; border-bottom-right-radius: 0; }
.right { border-top-left-radius: 0; border-bottom-left-radius: 0; margin-left: -1px; }
</style>
