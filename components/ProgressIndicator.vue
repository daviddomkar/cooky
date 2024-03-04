<template>
  <div class="loader">
    <div />
    <div />
    <div />
  </div>
</template>

<style>
.loader {
  position: relative;
  width: 44px;
  height: 12px;
}

.loader div {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.loader div:nth-child(1) {
  left: 0px;
  animation: scale 1.8s -0.32s infinite;
}

.loader div:nth-child(2) {
  left: 16px;
  animation: scale 1.8s -0.16s infinite;
}

.loader div:nth-child(3) {
  left: 32px;
  animation: scale 1.8s infinite;
}

@keyframes scale {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
</style>
