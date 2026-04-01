//import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { customIcons } from './icons'
import colors from 'vuetify/util/colors'

export default createVuetify({
  components,
  directives,

  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
            primary: "#005596",
           /*  error: "#B00020", */
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#EF6C00",
            grey: colors.grey.lighten2,
            greendarken: colors.green.darken2,
            yellowdarken: colors.yellow.darken2,
            error: colors.red.darken2,
        }
      },
      light: { 
        colors:{
            primary: "#005596",
            /* error: "#B00020", */
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#FB8C00",
            grey: colors.grey.lighten2,
            greendarken: colors.green.darken1,
            yellowdarken: colors.yellow.darken2,
            error: colors.red.darken4,

        }
      }
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      connection: 'custom:connection'
    },
    sets: {
      mdi,
      custom: customIcons
    }
  }
})
