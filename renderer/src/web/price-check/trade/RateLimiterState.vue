<template>
  <button :class="[$style.button, { [$style.limited]: isLimited }]"
    :aria-expanded="showRateLimitState"
    @click="showRateLimitState = !showRateLimitState" v-bind="$attrs">
    <i class="fas" :class="isLimited ? 'fa-hourglass-half' : 'fa-tachometer-alt'" />
    {{ isLimited ? t('rate_limits.limited') : t('rate_limits.name') }}
  </button>
  <section v-if="showRateLimitState" :class="$style.panel" v-bind="$attrs">
    <header :class="$style.header">
      <span>{{ t('rate_limits.title') }}</span>
      <span :class="[$style.status, { [$style.queued]: isLimited }]">
        {{ isLimited ? t('rate_limits.waiting') : t('rate_limits.available') }}
      </span>
    </header>
    <div v-for="limit in limits" :key="limit.policy" :class="$style.policy">
      <div :class="$style.policyName">
        <i class="fas" :class="limit.icon" />
        {{ limit.label }}
      </div>
      <div v-for="(rule, idx) in limit.rules" :key="idx" :class="$style.rule">
        <span>{{ t('rate_limits.requests', { active: rule.active, max: rule.max }) }}</span>
        <span>{{ t('rate_limits.seconds', { value: rule.window }) }}</span>
        <span v-if="rule.queue" :class="$style.queue">{{ t('rate_limits.queued', { value: rule.queue }) }}</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { RATE_LIMIT_RULES } from './common'
import { PriceCheckWidget } from '@/web/overlay/interfaces'
import { AppConfig } from '@/web/Config'

export default defineComponent({
  inheritAttrs: false,
  setup () {
    const { t } = useI18n()
    const widget = computed(() => AppConfig<PriceCheckWidget>('price-check')!)

    const limits = computed(() => {
      const LIMITS = [
        { policy: 'trade-search-request-limit', label: t('rate_limits.searches'), icon: 'fa-search', rules: RATE_LIMIT_RULES.SEARCH },
        { policy: 'trade-exchange-request-limit', label: t('rate_limits.exchange'), icon: 'fa-coins', rules: RATE_LIMIT_RULES.EXCHANGE },
        { policy: 'trade-fetch-request-limit', label: t('rate_limits.listings'), icon: 'fa-list', rules: RATE_LIMIT_RULES.FETCH }
      ]

      return LIMITS.map((limit) => ({
        policy: limit.policy,
        label: limit.label,
        icon: limit.icon,
        hasQueue: Array.from(limit.rules).some(rl => rl.queue.value),
        rules: Array.from(limit.rules).map(rl => ({
          max: rl.max,
          window: rl.window,
          active: rl.stack.length,
          queue: rl.queue.value
        }))
      }))
    })

    const isLimited = computed(() => limits.value.some(limit => limit.hasQueue))

    const showRateLimitState = computed<boolean>({
      get () {
        return widget.value.showRateLimitState
      },
      set (value) {
        widget.value.showRateLimitState = value
      }
    })

    return {
      limits,
      t,
      showRateLimitState,
      isLimited
    }
  }
})
</script>

<style lang="postcss" module>
.button {
  @apply mx-6 px-3;
  @apply leading-6;
  border: 1px solid rgba(163, 141, 109, .32);
  border-bottom: 0;
  border-radius: 4px 4px 0 0;
  background: rgba(13, 12, 10, .94);
  color: rgba(196, 177, 140, .82);
  font-family: FontinSmallCaps, FrizQuadrataC;
  font-size: .7rem;
  letter-spacing: .065em;
  text-transform: uppercase;
  position: absolute;
  bottom: 0;

  &:hover {
    color: #f0d494;
    background: rgba(45, 37, 25, .96);
  }
}

.limited {
  border-color: rgba(196, 89, 67, .75);
  background: rgba(91, 32, 26, .94);
  color: #f2c19a;

  /* Animate.css */
  :global {
    animation: shakeX;
    animation-duration: 1s;
  }
}

.panel {
  width: 17.5rem;
  margin: 0 0 2.15rem 1.5rem;
  padding: .7rem;
  position: absolute;
  bottom: 0;
  border: 1px solid rgba(163, 141, 109, .52);
  border-radius: 4px;
  background:
    linear-gradient(135deg, rgba(163, 141, 109, .11), transparent 48%),
    rgba(12, 12, 11, .98);
  color: rgba(221, 214, 198, .88);
  box-shadow: 0 10px 26px rgba(0, 0, 0, .48), inset 0 1px 0 rgba(255, 232, 177, .07);
  font-family: FrizQuadrataC, sans-serif;
  font-size: .75rem;
}

.header {
  @apply flex items-center justify-between;
  padding-bottom: .5rem;
  border-bottom: 1px solid rgba(163, 141, 109, .22);
  color: #e4c67f;
  font-family: FontinSmallCaps, FrizQuadrataC;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .07em;
  text-transform: uppercase;
}

.status {
  color: #a9c78d;
  font-size: .65rem;
}

.queued { color: #e49a70; }

.policy { padding-top: .6rem; }

.policyName {
  color: #d8c49a;
  font-family: FontinSmallCaps, FrizQuadrataC;
  font-size: .7rem;
  letter-spacing: .05em;
  text-transform: uppercase;

  & i {
    width: 1rem;
    color: #b99552;
  }
}

.rule {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: .45rem;
  padding: .18rem 0 .18rem 1rem;
  color: rgba(211, 207, 196, .72);
  font-family: sans-serif;
  font-size: .68rem;
}

.queue { color: #e4a077; }
</style>
