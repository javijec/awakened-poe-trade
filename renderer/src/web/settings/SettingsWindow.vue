<template>
<div :class="$style.root">
  <div :class="$style.window" class="grow layout-column">
    <AppTitleBar @close="cancel" :title="t('settings.title')" />
    <div class="flex grow min-h-0">
      <div :class="$style.sidebar" class="pl-2 pt-2 flex flex-col gap-1" style="min-width: 10rem;">
        <template v-for="item of menuItems">
          <button v-if="item.type === 'menu-item'"
            @click="item.select" :class="[$style['menu-item'], { [$style['active']]: item.isSelected }]">
            <i class="fas w-5 text-center" :class="item.icon" />
            {{ item.name }}
          </button>
          <div v-else
            class="border-b mx-2 border-gray-800" />
        </template>
        <button v-if="menuItems.length >= 4"
          :class="$style['quit-btn']" @click="quit">{{ t('app.quit') }}</button>
      </div>
      <div :class="$style.content" class="text-gray-100 grow layout-column">
        <div :class="$style.contentBody" class="grow overflow-y-auto rounded-tl">
          <div :class="$style.contentHeader" class="px-5 py-3 flex items-center justify-between">
            <div class="poe-section-title">{{ t(selectedComponent.name!) }}</div>
            <span v-if="configDirty" class="poe-badge text-yellow-200"><i class="fas fa-circle text-yellow-700 text-xs mr-1" />{{ t('settings.unsaved') }}</span>
          </div>
          <component v-if="configClone"
            :is="selectedComponent" :config="configClone" :configWidget="configWidget" />
        </div>
        <div :class="$style.footer" class="p-2 flex justify-end gap-x-2">
          <button @click="save" class="btn px-3" :disabled="!configDirty">{{ t('Save') }}</button>
          <button @click="cancel" class="btn px-3">{{ t('Cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, shallowRef, computed, Component, PropType, nextTick, inject, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppConfig, updateConfig, saveConfig, pushHostConfig, Config } from '@/web/Config'
import { Host } from '@/web/background/IPC'
import type { Widget, WidgetManager, WidgetSpec } from '@/web/overlay/interfaces'
import AppTitleBar from '@/web/ui/AppTitlebar.vue'

function lazySettingsComponent (name: string, loader: () => Promise<Component>) {
  return Object.assign(defineAsyncComponent(loader), { name })
}

const SettingsHotkeys = lazySettingsComponent('hotkeys', () => import('./hotkeys.vue'))
const SettingsChat = lazySettingsComponent('chat', () => import('./chat.vue'))
const SettingsGeneral = lazySettingsComponent('general', () => import('./general.vue'))
const SettingsPricecheck = lazySettingsComponent('price_check.name', () => import('../price-check/settings-price-check.vue'))
const SettingsItemcheck = lazySettingsComponent('item.info', () => import('../item-check/settings-item-check.vue'))
const SettingsDebug = lazySettingsComponent('debug', () => import('./debug.vue'))
const SettingsMaps = lazySettingsComponent('map_check.name', () => import('../map-check/settings-maps.vue'))
const SettingsStashSearch = lazySettingsComponent('stash-search-editor', () => import('../stash-search/stash-search-editor.vue'))
const SettingsStopwatch = lazySettingsComponent('settings-stopwatch', () => import('../stopwatch/settings-stopwatch.vue'))
const SettingsItemSearch = lazySettingsComponent('settings-item-search', () => import('../item-search/settings-item-search.vue'))

function quit () {
  Host.sendEvent({
    name: 'CLIENT->MAIN::user-action',
    payload: { action: 'quit' }
  })
}

export default defineComponent({
  widget: {
    type: 'settings',
    instances: 'single',
    initInstance: () => {
      return {
        wmId: 0,
        wmType: 'settings',
        wmTitle: '{icon=fa-cog}',
        wmWants: 'hide',
        wmZorder: 'exclusive',
        wmFlags: ['invisible-on-blur', 'ignore-ui-visibility']
      }
    }
  } satisfies WidgetSpec,
  components: { AppTitleBar },
  props: {
    config: {
      type: Object as PropType<Widget>,
      required: true
    }
  },
  setup (props) {
    const wm = inject<WidgetManager>('wm')!
    const { t } = useI18n()

    nextTick(() => {
      props.config.wmWants = 'hide'
    })

    const selectedComponent = shallowRef<Component>(SettingsHotkeys)

    const configClone = shallowRef<Config | null>(null)
    // Settings may be mounted after the widget has already been requested.
    // Run this once immediately as well as on later transitions so the pages
    // never render without their configuration model.
    watch(() => props.config.wmWants, (wmWants) => {
      if (wmWants === 'show') {
        configClone.value = reactive(JSON.parse(JSON.stringify(AppConfig())))
      } else {
        configClone.value = null
        if (selectedWmId.value != null) {
          selectedWmId.value = null
          selectedComponent.value = SettingsHotkeys
        }
      }
    }, { immediate: true })

    const selectedWmId = shallowRef<number | null>(null)
    const configWidget = computed(() => configClone.value?.widgets.find(w => w.wmId === selectedWmId.value))

    watch(() => props.config.wmFlags, (wmFlags) => {
      const flagStr = wmFlags.find(flag => flag.startsWith('settings::widget='))
      if (flagStr) {
        const _wmId = Number(flagStr.split('=')[1])
        const _widget = wm.widgets.value.find(w => w.wmId === _wmId)!
        selectedWmId.value = _wmId
        selectedComponent.value = menuByType(_widget.wmType)[0][0]
        wm.setFlag(props.config.wmId, flagStr, false)
      }
    }, { deep: true })

    // Settings must always expose the complete configuration menu. Opening it
    // from a widget selects the related page, but must not hide the rest.
    const menuItems = computed(() => flatJoin(
      menuByType()
        .map(group => group.map(component => ({
          name: t(component.name!),
          select () { selectedComponent.value = component },
          isSelected: (selectedComponent.value === component),
          icon: menuIcon(component),
          type: 'menu-item' as const
        }))),
      () => ({ type: 'separator' as const })
    ))

    return {
      t,
      save () {
        updateConfig(configClone.value!)
        saveConfig()
        pushHostConfig()

        wm.hide(props.config.wmId)
      },
      cancel () {
        wm.hide(props.config.wmId)
      },
      quit,
      menuItems,
      selectedComponent,
      configClone,
      configWidget,
      configDirty: computed(() => JSON.stringify(configClone.value) !== JSON.stringify(AppConfig()))
    }
  }
})

function menuByType (type?: string) {
  switch (type) {
    case 'stash-search':
      return [[SettingsStashSearch]]
    case 'timer':
      return [[SettingsStopwatch]]
    case 'item-check':
      return [[SettingsItemcheck, SettingsMaps]]
    case 'price-check':
      return [[SettingsPricecheck]]
    case 'item-search':
      return [[SettingsItemSearch]]
    default:
      return [
        [SettingsHotkeys, SettingsChat],
        [SettingsGeneral],
        [SettingsPricecheck, SettingsMaps, SettingsItemcheck],
        [SettingsDebug]
      ]
  }
}

function flatJoin<T, J> (arr: T[][], joinEl: () => J) {
  const out: Array<T | J> = []
  for (const nested of arr) {
    out.push(...nested)
    out.push(joinEl())
  }
  return out.slice(0, -1)
}

function menuIcon (component: Component) {
  switch (component.name) {
    case 'hotkeys': return 'fa-keyboard'
    case 'chat': return 'fa-comment'
    case 'general': return 'fa-sliders-h'
    case 'price_check.name': return 'fa-search-dollar'
    case 'map_check.name': return 'fa-map'
    case 'item.info': return 'fa-scroll'
    case 'stash-search-editor': return 'fa-archive'
    case 'settings-stopwatch': return 'fa-stopwatch'
    case 'settings-item-search': return 'fa-search'
    case 'debug': return 'fa-bug'
    default: return 'fa-cog'
  }
}
</script>

<style lang="postcss" module>
.window {
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;
  margin: 0 auto;
  max-width: 50rem;
  max-height: 38rem;
  overflow: hidden;
  background: var(--kt-bg);
  border: 1px solid rgba(163, 141, 109, .24);
  box-shadow: 0 18px 50px rgba(0, 0, 0, .5);
  @apply rounded-b;
  &:global {
    animation-name: slideInDown;
    animation-duration: 1s;
  }
}

.root :global(input:not([type='checkbox']):not([type='radio'])),
.root :global(select),
.root :global(textarea) {
  border: 1px solid rgba(238, 238, 238, .12) !important;
  border-radius: 3px !important;
  background: rgba(238, 238, 238, .035) !important;
  color: #eeeeee !important;
  box-shadow: inset 0 1px 0 rgba(0, 0, 0, .3);
}
.root :global(input:not([type='checkbox']):not([type='radio']):focus),
.root :global(select:focus),
.root :global(textarea:focus) {
  outline: none;
  border-color: rgba(163, 141, 109, .72) !important;
  box-shadow: 0 0 0 2px rgba(163, 141, 109, .12);
}
.root :global(hr) {
  border-color: rgba(163, 141, 109, .16) !important;
}

.sidebar {
  background: linear-gradient(90deg, #090806, #16120c);
  border-right: 1px solid #5d4523;
  box-shadow: inset -1px 0 0 rgba(255, 223, 150, .08);
}

.content { background: #0a0907; }
.contentBody { background: linear-gradient(135deg, rgba(185, 149, 82, .05), transparent 36%), #0a0907; }
.contentHeader {
  border-bottom: 1px solid #5d4523;
  background: linear-gradient(180deg, rgba(255, 225, 154, .08), rgba(29, 23, 14, .82));
}
.footer {
  border-top: 1px solid #5d4523;
  background: linear-gradient(#18130c, #0a0806);
}

.menu-item {
  text-align: left;
  @apply p-2;
  line-height: 1;
  color: #a99a7b;
  border-left: 2px solid transparent;
  border-bottom: 1px solid rgba(185, 149, 82, .08);
  font-family: FontinSmallCaps, FrizQuadrataC;
  letter-spacing: .04em;

  &:hover {
    color: #f5dc9e;
    background: linear-gradient(90deg, rgba(173, 127, 49, .22), transparent);
  }

  &.active {
    color: #ffe8a8;
    background: linear-gradient(90deg, rgba(173, 127, 49, .32), rgba(66, 46, 21, .14));
    border-left-color: #d0a457;
    box-shadow: inset 0 1px 0 rgba(255, 232, 172, .09), inset 0 -1px 0 rgba(0, 0, 0, .42);
  }
}

.quit-btn {
  color: #a99a7b;
  border: 1px solid #5d4523;
  @apply p-1 mt-2 mr-2 rounded;
  background: linear-gradient(#1b150d, #0b0906);

  &:hover {
    @apply text-red-400;
    @apply border-red-400;
  }
}

</style>
