<template>
    <div class="compass">
    <svg viewBox="0 0 100 100">

        <!-- círculo -->
        <circle cx="50" cy="50" r="45" class="circle"/>

        <!-- cardinales -->
        <text x="50" y="18" text-anchor="middle" class="label north">N</text>
        <text x="50" y="92" text-anchor="middle" class="label">S</text>
        <text x="90" y="55" text-anchor="middle" class="label">E</text>
        <text x="10" y="55" text-anchor="middle" class="label">W</text>

        <!-- flecha -->
        <g :style="{ transform: `rotate(${heading}deg)`, transformOrigin: '50% 50%' }">
            <polygon points="50,20 55,50 50,45 45,50" class="arrow"/>
        </g>

    </svg>
    </div>
</template>

<script setup>
    defineProps({
        heading: {
            type: Number,
            default: 0
        }
    })
</script>

<style>
.compass {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 50px;
  height: 50px;

  background: rgba(0,0,0,0.6);
  border-radius: 50%;
  backdrop-filter: blur(6px);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1000;
}

.circle {
  stroke: white;
  stroke-width: 2;
  fill: none;
}

.label {
  fill: white;
  font-size: 12px;
  font-weight: bold;
}

.north {
  fill: #22c55e; /* norte destacado */
}

.arrow {
  fill: red;
  transition: transform 0.3s ease;
}
</style>