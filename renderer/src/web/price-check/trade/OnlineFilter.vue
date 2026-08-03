<template>
  <ui-popover :delay="[80, null]" placement="bottom-start" boundary="#price-window">
    <template #target>
      <button :class="$style.trigger" :data-warning="showWarning()">
        <span><i class="fas fa-history"></i> {{ t(popoverLabelId()) }}</span>
        <span v-if="showLeagueName()">, {{ filters.trade.league }}</span>
      </button>
    </template>
    <template #content>
      <div :class="$style.content">
        <div class="flex flex-col gap-y-1">
          <div class="mb-1">
            <ui-toggle
              :modelValue="filters.trade.offline"
              @update:modelValue="onOfflineUpdate">{{ t(':offline_toggle') }}</ui-toggle>
          </div>
          <template v-if="byTime">
            <ui-radio v-model="filters.trade.listed" :value="undefined">{{ t(':listed_any_time') }}</ui-radio>
            <ui-radio v-model="filters.trade.listed" value="1day">{{ t(':listed_1day') }}</ui-radio>
            <ui-radio v-model="filters.trade.listed" value="3days">{{ t(':listed_3days') }}</ui-radio>
            <ui-radio v-model="filters.trade.listed" value="1week">{{ t(':listed_1week') }}</ui-radio>
            <ui-radio v-model="filters.trade.listed" value="2weeks">{{ t(':listed_2weeks') }}</ui-radio>
            <ui-radio v-model="filters.trade.listed" value="1month">{{ t(':listed_1month') }}</ui-radio>
            <ui-radio v-model="filters.trade.listed" value="2months">{{ t(':listed_2months') }}</ui-radio>
          </template>
        </div>
        <div class="flex flex-col gap-y-1">
          <div class="mb-1">
            <ui-toggle v-if="api === 'bulk'" :class="{ 'invisible': filters.trade.offline }"
              v-model="filters.trade.onlineInLeague">{{ t(':in_league_toggle') }}</ui-toggle>
            <ui-toggle v-if="api === 'trade'" :class="{ 'invisible': filters.trade.offline }"
              v-model="filters.trade.merchantOnly">{{ t(':merchant_toggle') }}</ui-toggle>
          </div>
          <ui-radio v-for="league of tradeLeagues" :key="league.id"
            v-model="filters.trade.league" :value="league.id">{{ league.id }}</ui-radio>
          <template v-if="byTime">
            <ui-radio class="mt-3" v-model="filters.trade.currency" :value="undefined">{{ t(':currency_any') }}</ui-radio>
            <ui-radio v-model="filters.trade.currency" value="chaos">{{ t(':currency_only_chaos') }}</ui-radio>
            <ui-radio v-model="filters.trade.currency" value="divine">{{ t(':currency_only_div') }}</ui-radio>
            <ui-radio v-model="filters.trade.currency" value="chaos_divine">{{ t(':currency_chaos_div') }}</ui-radio>
          </template>
        </div>
      </div>
    </template>
  </ui-popover>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18nNs } from '@/web/i18n'
import UiRadio from '@/web/ui/UiRadio.vue'
import UiToggle from '@/web/ui/UiToggle.vue'
import UiPopover from '@/web/ui/Popover.vue'
import type { ItemFilters } from '../filters/interfaces'
import { useLeagues } from '@/web/background/Leagues'

export default defineComponent({
  components: { UiRadio, UiToggle, UiPopover },
  props: {
    filters: {
      type: Object as PropType<ItemFilters>,
      required: true
    },
    byTime: {
      type: Boolean,
      default: false
    },
    api: {
      type: String as PropType<'trade' | 'bulk'>,
      required: true
    }
  },
  setup (props) {
    const leagues = useLeagues()
    const { t } = useI18nNs('online_filter')

    return {
      t,
      tradeLeagues: leagues.list,
      showLeagueName: () => leagues.selectedId.value !== props.filters.trade.league,
      showWarning: () => Boolean(
        (props.filters.trade.listed &&
          ['1day', '3days', '1week'].includes(props.filters.trade.listed)) ||
        (props.filters.trade.currency &&
          props.filters.trade.currency !== 'chaos_divine')
      ),
      popoverLabelId: () => {
        if (props.filters.trade.offline) {
          return 'Offline'
        } else if (props.api === 'trade' && props.filters.trade.merchantOnly) {
          return ':merchant_toggle'
        }
        return 'Online'
      },
      onOfflineUpdate (offline: boolean) {
        const { filters } = props
        filters.trade.offline = offline
        if (props.byTime) {
          filters.trade.listed = (offline) ? '2months' : undefined
        }
      }
    }
  }
})
</script>

<style lang="postcss" module>
.trigger {
  margin-right: .25rem;
  padding: .125rem .5rem;
  border: 1px solid transparent;
  border-radius: 3px;
  color: rgba(225, 215, 190, .7);

  &:hover {
    border-color: rgba(163, 141, 109, .32);
    background: rgba(163, 141, 109, .08);
    color: #e8d8b9;
  }

  &[data-warning='true'] { color: #d6a558; }
}

.content {
  display: flex;
  gap: 2rem;
  padding: .6rem;
  color: rgba(225, 215, 190, .9);

  :global(button) { color: inherit; }
  :global(button:hover) { color: #e8d8b9; }
}
</style>
