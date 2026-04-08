<template>
  <div class="gps-coordinate">
    <v-text-field
      v-model.number="internalValue"
      :label="label"
      density="compact"
      variant="outlined"
      :step="step"
      :min="min"
      :max="max"
      :disabled="disabled"
    >
      <template v-slot:append-inner>
        <div class="spinner-controls">
          <v-btn variant="plain" size="x-small" @click="increment(step)">
            <v-icon size="14">mdi-chevron-up</v-icon>
          </v-btn>
          <v-btn variant="plain" size="x-small" @click="increment(-step)">
            <v-icon size="14">mdi-chevron-down</v-icon>
          </v-btn>
        </div>
      </template>
    </v-text-field>
  </div>
</template>

<script>
export default {
  name: "GpsCoordinate",
  props: {
    modelValue: Number,
    label: String,
    step: Number,
    min: Number,
    max: Number,
    disabled:Boolean
  },
  emits: ["update:modelValue"],
  data() {
    return {
      internalValue: this.modelValue
    };
  },
  watch: {
    internalValue(val) {
      if (this.max !== undefined && val > this.max) val = this.max;
      if (this.min !== undefined && val < this.min) val = this.min;

      this.$emit("update:modelValue", val);
    },
    modelValue(val) {
      this.internalValue = val;
    }
  },
  methods: {
    increment(step) {
      let newValue = (this.internalValue || 0) + step;

      if (this.max !== undefined && newValue > this.max) return;
      if (this.min !== undefined && newValue < this.min) return;

      this.internalValue = parseFloat(newValue.toFixed(6));
    }
  },
  computed: {
    internalValue: {
        get() {
        if (this.internalValue === null || this.internalValue === undefined) return "";

        // 👇 SOLO lat/lon → 6 decimales
        if (this.step === 0.001) {
            return Number(this.internalValue).toFixed(6);
        }

        // 👇 altitud u otros
        return this.internalValue;
        },
        set(val) {
        let num = parseFloat(val);

        if (isNaN(num)) return;

        if (this.max !== undefined && num > this.max) num = this.max;
        if (this.min !== undefined && num < this.min) num = this.min;

        this.internalValue = num;
        }
    }
}
};
</script>

<style scoped>

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
:deep(.spinner-controls .v-btn:first-child) {
  border-bottom: 1px solid rgba(0,0,0,0.2);
} 
</style>