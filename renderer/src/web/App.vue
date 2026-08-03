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
  background: rgba(151, 119, 69, .055);
}

.table-stripped tbody tr:hover {
  background: linear-gradient(90deg, rgba(182, 142, 67, .18), rgba(182, 142, 67, .04));
}

#app {
  --kt-bg: #070706;
  --kt-surface: #12100d;
  --kt-surface-raised: #1b1711;
  --kt-text: #e8dfcc;
  --kt-muted: rgba(210, 194, 161, .66);
  --kt-gold: #b99552;
  --kt-gold-bright: #e5c57f;
  --kt-gold-dark: #5f4522;
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
  background: #0b0a08;
  border-left: 1px solid rgba(185, 149, 82, .16);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #4c351a, #a77a37, #4c351a);
  border: 1px solid #170f06;
  border-radius: 2px;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.btn {
  min-height: 29px;
  border: 1px solid #735027;
  border-radius: 2px;
  background: linear-gradient(180deg, rgba(255, 225, 154, .13), transparent 45%), linear-gradient(90deg, #21180d, #382814 48%, #21180d);
  box-shadow: inset 0 1px 0 rgba(255, 228, 163, .18), inset 0 -1px 0 rgba(0, 0, 0, .7), 0 1px 1px rgba(0, 0, 0, .45);
  color: #dcc28b;
  font-family: FontinSmallCaps, FrizQuadrataC;
  font-size: .75rem;
  letter-spacing: .05em;
  text-transform: uppercase;
  transition: background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, transform .2s ease;
  &:hover { border-color: #c79748; background: linear-gradient(180deg, rgba(255, 225, 154, .2), transparent 45%), linear-gradient(90deg, #392714, #60431f 48%, #392714); color: #fff0bd; }
  &:active { transform: translateY(1px); box-shadow: inset 0 2px 5px rgba(0, 0, 0, .65); }
  &:focus-visible { @apply outline-none; border-color: #e5c57f; box-shadow: 0 0 0 1px rgba(229, 197, 127, .45), 0 0 0 3px rgba(185, 149, 82, .2); }
  &:disabled { @apply opacity-40 cursor-not-allowed; }
}

html,
body {
  background: transparent;
}

.btn-icon {
  @apply text-xs;
  color: #b99552;
}

.poe-panel {
  border: 1px solid #574121;
  border-radius: 3px;
  background: linear-gradient(90deg, rgba(195, 153, 77, .08), transparent 4%, transparent 96%, rgba(195, 153, 77, .08)), linear-gradient(180deg, rgba(255, 235, 176, .07), transparent 18%), linear-gradient(135deg, #17130e, #0b0a08 72%);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .72), inset 0 1px 0 rgba(255, 226, 158, .12), 0 7px 18px rgba(0, 0, 0, .42);
}

.poe-section-title {
  color: #d2b77d;
  font-family: FontinSmallCaps, FrizQuadrataC;
  font-size: .625rem;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
}

.poe-badge {
  @apply inline-flex items-center px-1.5 py-0.5 text-xs;
  border: 1px solid #725429;
  border-radius: 2px;
  background: linear-gradient(180deg, rgba(255, 230, 161, .1), rgba(98, 68, 30, .2));
  color: #e0c37f;
}

input:not([type='checkbox']):not([type='radio']), select, textarea {
  border: 1px solid #5d4726 !important;
  border-radius: 2px !important;
  background: linear-gradient(180deg, #0a0907, #17120b) !important;
  color: #eee2c9 !important;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, .8), 0 1px 0 rgba(255, 225, 154, .06);
}

input:not([type='checkbox']):not([type='radio']):focus, select:focus, textarea:focus {
  outline: none;
  border-color: #c69647 !important;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, .8), 0 0 0 1px rgba(198, 150, 71, .25) !important;
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
