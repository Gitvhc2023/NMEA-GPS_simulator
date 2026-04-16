<template>
    <v-snackbar
        absolute
        top
        :timeout="3000"
        v-model="state.visible"
        :color="state.alertColor"
        :right="state.position.right"
        :left="state.position.left"
        :centered="state.position.centered"
    >
    <span class="body-2 mr-3">{{ state.messageText }}</span>
    <template v-slot:actions>
      <v-icon class="ml-auto" color="white">
            {{
                state.alertColor === "green"
                ? "mdi-check"
                : state.alertColor === "red"
                ? "mdi-alert-octagon-outline"
                : state.alertColor === "orange"
                ? "mdi-alert-circle"
                : "mdi-information-outline"
            }}
            </v-icon>

    </template>
    
    </v-snackbar>
</template>
<script setup>
import { useSnackbar } from '../composables/useSnackbar';

const { state } = useSnackbar()
</script>
<style scoped>
.snackbar-content {
  display: flex;
  align-items: center;
}

.snackbar-content span {
  margin-right: 12px;
}

.snackbar-content v-icon {
  margin-left: auto;
}
</style>