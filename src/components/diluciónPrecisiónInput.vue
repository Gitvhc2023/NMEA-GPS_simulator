<template>
  <div >
    <v-text-field
      v-model="displayValue"
      density="compact"
      variant="outlined"
      control-variant="stacked"
      step="0.1"
      min="0.5"
      max="99.9"
      @input="onInput"
      @blur="normalize"
      
    >
      <template v-slot:prepend-inner>
        <v-icon
          :color="status.color"
          icon="mdi-circle-medium"
        />
    </template>
      <template v-slot:append-inner>
        <div class="spinner-controls" >
          <v-btn  variant="plain" size="x-small"  @click="change(0.1)" >
              <v-icon size="14" >mdi-chevron-up</v-icon>
          </v-btn>
          <v-btn variant="plain" size="x-small"  @click="change(-0.1)" >
              <v-icon size="14" >mdi-chevron-down</v-icon>
          </v-btn>
        </div>
      </template>
    </v-text-field>
    
  </div>
  
</template>

<script setup>
import { ref, watch, computed } from 'vue'

// props
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0.5
  }
})

// emit
const emit = defineEmits(['update:modelValue'])

// estado local (string para controlar input)
const displayValue = ref(props.modelValue.toFixed(1))

// sync externo
watch(() => props.modelValue, (val) => {
  displayValue.value = (val ?? 0.5).toFixed(1)
})

//NORMALIZACIÓN CENTRAL
const normalizeValue = (val) => {
  if (isNaN(val)) val = 0.5

  val = Math.max(0.5, Math.min(99.9, val))
  return Math.round(val * 10) / 10
}

// input manual
const onInput = (e) => {
  const val = parseFloat(e.target.value)
  const fixed = normalizeValue(val)

  displayValue.value = fixed.toFixed(1)
  emit('update:modelValue', fixed)
}

// cuando pierde foco
const normalize = () => {
  const val = parseFloat(displayValue.value)
  const fixed = normalizeValue(val)

  displayValue.value = fixed.toFixed(1)
  emit('update:modelValue', fixed)
}

// botones
const change = (step) => {
  let val = parseFloat(displayValue.value)
  val = normalizeValue(val + step)

  displayValue.value = val.toFixed(1)
  emit('update:modelValue', val)
}

// indicador visual
const status = computed(() => {
  
  const v = parseFloat(displayValue.value)

  if (v <= 1.5) return { text: 'Excelente', color: 'success' }
  if (v <= 2.5) return { text: 'Buena', color: 'warning' }
  return { text: 'Mala', color: 'error' }
})
</script>

<style scoped>
:deep(.dop-container) {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
:deep(.dop-input .v-field__append-inner) {
  padding: 0 !important;
  margin: 0 !important;
  height: 100%;
  display: flex;
  align-items: stretch;  
} 

:deep(.spinner-controls) {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 40px;
  border-inline-start: 1px solid rgba(0,0,0,0.2);
  margin-right: -10px;
}

:deep(.spinner-controls .v-btn) {
  flex: 1;
  min-width: 0 !important;
  height: 50%;
  padding: 0;
  border-radius: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.spinner-controls .v-btn:first-child {
  border-bottom: 1px solid rgba(0,0,0,0.2);
}
</style>