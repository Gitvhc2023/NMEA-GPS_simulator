import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css'

import { useSnackbar } from './composables/useSnackbar'
const {state, toast } = useSnackbar()

const app = createApp(App)

app.provide('snackbar', {
  state,
  toast
})
app.use(vuetify)

app.mount('#app')

//createApp(App).mount('#app')
