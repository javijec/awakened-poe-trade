<template>
  <div id="app" class="text-sm font-poe-sc">
    <OverlayWindow />
  </div>
</template>

<script setup lang="ts">
import OverlayWindow from './overlay/OverlayWindow.vue'
</script>

<style lang="postcss">
@import url('@fortawesome/fontawesome-free/css/all.min.css');
@import url('animate.css/animate.css');
@import url('../assets/font.css');
@tailwind base;
@tailwind components;
@tailwind utilities;

.table-stripped tbody tr:nth-child(odd) {
  background: rgba(238, 238, 238, .035);
}

.table-stripped tbody tr:hover {
  background: rgba(163, 141, 109, .1);
}

#app {
  --kt-bg: #050505;
  --kt-surface: #0d0d0d;
  --kt-surface-raised: #151515;
  --kt-text: #eeeeee;
  --kt-muted: rgba(238, 238, 238, .58);
  --kt-gold: #a38d6d;
  --kt-blue: #284a7b;
  color: var(--kt-text);
  /* The Electron overlay sits on top of the game: only panels may be opaque. */
  background: transparent;
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  overflow: hidden;
  justify-content: space-between;

  :focus {
    outline: 0;
  }
}

.layout-column {
  display: flex;
  flex-direction: column;
  height: 100%;
}

::-webkit-scrollbar {
  width: 7px;
}

::-webkit-scrollbar-track {
  background: rgba(238, 238, 238, .03);
}

::-webkit-scrollbar-thumb {
  background: rgba(163, 141, 109, .24);
  border: 1px solid rgba(5, 5, 5, .35);
  border-radius: 999px;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.btn {
  min-height: 28px;
  border: 1px solid rgba(238, 238, 238, .1);
  border-radius: 2px;
  background: rgba(238, 238, 238, .03);
  color: rgba(238, 238, 238, .8);
  font-family: FontinSmallCaps, FrizQuadrataC;
  font-size: .75rem;
  letter-spacing: .05em;
  text-transform: uppercase;
  transition: background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, transform .2s ease;
  &:hover { background: rgba(238, 238, 238, .08); border-color: rgba(238, 238, 238, .3); color: #eee; }
  &:active { transform: translateY(1px); }
  &:focus-visible { @apply outline-none; border-color: rgba(163, 141, 109, .72); box-shadow: 0 0 0 1px rgba(163, 141, 109, .3), 0 0 0 3px rgba(163, 141, 109, .14); }
  &:disabled { @apply opacity-40 cursor-not-allowed; }
}

html,
body {
  background: transparent;
}

.btn-icon {
  @apply text-xs text-gray-600;
}

.poe-panel {
  border: 1px solid rgba(163, 141, 109, .2);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(238, 238, 238, .035), rgba(238, 238, 238, .012)), radial-gradient(circle at top left, rgba(163, 141, 109, .1), transparent 48%), rgba(5, 5, 5, .78);
  box-shadow: inset 0 1px 0 rgba(238, 238, 238, .04), 0 10px 28px rgba(0, 0, 0, .18);
}

.poe-section-title {
  color: rgba(196, 177, 140, .84);
  font-family: FontinSmallCaps, FrizQuadrataC;
  font-size: .625rem;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
}

.poe-badge {
  @apply inline-flex items-center px-1.5 py-0.5 text-xs;
  border: 1px solid rgba(163, 141, 109, .26);
  border-radius: 999px;
  background: rgba(163, 141, 109, .08);
  color: rgba(196, 177, 140, .94);
}

@keyframes ring {
  0% {
    -webkit-transform: rotate(-15deg);
    -ms-transform: rotate(-15deg);
    transform: rotate(-15deg);
  }

  2% {
    -webkit-transform: rotate(15deg);
    -ms-transform: rotate(15deg);
    transform: rotate(15deg);
  }

  4% {
    -webkit-transform: rotate(-18deg);
    -ms-transform: rotate(-18deg);
    transform: rotate(-18deg);
  }

  6% {
    -webkit-transform: rotate(18deg);
    -ms-transform: rotate(18deg);
    transform: rotate(18deg);
  }

  8% {
    -webkit-transform: rotate(-22deg);
    -ms-transform: rotate(-22deg);
    transform: rotate(-22deg);
  }

  10% {
    -webkit-transform: rotate(22deg);
    -ms-transform: rotate(22deg);
    transform: rotate(22deg);
  }

  12% {
    -webkit-transform: rotate(-18deg);
    -ms-transform: rotate(-18deg);
    transform: rotate(-18deg);
  }

  14% {
    -webkit-transform: rotate(18deg);
    -ms-transform: rotate(18deg);
    transform: rotate(18deg);
  }

  16% {
    -webkit-transform: rotate(-12deg);
    -ms-transform: rotate(-12deg);
    transform: rotate(-12deg);
  }

  18% {
    -webkit-transform: rotate(12deg);
    -ms-transform: rotate(12deg);
    transform: rotate(12deg);
  }

  20% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
}

.faa-ring {
  animation: ring 2s ease;
  transform-origin-x: 50%;
  transform-origin-y: 0px;
  transform-origin-z: initial;
}
</style>
