import { reactive } from 'vue'

const state = reactive({
  messageText: "",
  visible: false,
  position: {
    right: false,
    left: false,
    centered: false
  },
  alertColor: "red",
  alertType: "error"
})

function toast(message = "", type = "success", position = "centered") {
  state.alertColor =
    type === "error"
      ? "error"
      : type === "success"
      ? "success"
      : type === "warning"
      ? "warning"
      : "cyan"

  state.position.right = position === "right"
  state.position.left = position === "left"
  state.position.centered = position === "centered"

  state.messageText = message
  state.alertType = type
  state.visible = true
}

export function useSnackbar() {
  return {
    state,
    toast
  }
}