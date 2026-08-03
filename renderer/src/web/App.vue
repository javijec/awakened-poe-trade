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
  background: #353f52;
}

#app {
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
  width: 0.875rem;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 0.375rem rgba(0,0,0,0.3);
}

::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 0.375rem rgba(0,0,0,0.5);
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.btn {
  @apply bg-gray-700 border border-gray-600;
  @apply px-2 py-1 text-gray-300;
  @apply leading-none;
  @apply rounded;
  box-shadow: inset 0 1px 0 rgba(255, 211, 133, 0.08);
  transition: color .15s ease, border-color .15s ease, background-color .15s ease;
  &:hover { @apply bg-gray-600 border-yellow-700 text-yellow-100; }
  &:focus-visible { @apply outline-none ring-1 ring-blue-400; }
  &:disabled { @apply opacity-40 cursor-not-allowed; }
}

.btn-icon {
  @apply text-xs text-gray-600;
}

.poe-panel {
  @apply bg-gray-800 border border-gray-700 rounded;
  background-image: linear-gradient(135deg, rgba(212, 160, 69, .05), transparent 44%);
  box-shadow: inset 0 1px 0 rgba(255, 223, 155, .06), 0 0 0 1px rgba(0, 0, 0, .18);
}

.poe-section-title {
  @apply text-xs uppercase tracking-wider text-yellow-600;
}

.poe-badge {
  @apply inline-flex items-center rounded border border-gray-600 bg-gray-900 px-1.5 py-0.5 text-xs text-gray-300;
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
