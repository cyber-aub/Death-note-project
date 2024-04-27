import type { Config } from 'tailwindcss'
import  defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  important: '#app',
  corePlugins: {
    preflight: false,
  },
    content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'death-note': ['DeathNote', ...defaultTheme.fontFamily.sans],
        'old-london': ['OldLondon', ...defaultTheme.fontFamily.sans],
        'gothic-war': ['GothicWar', ...defaultTheme.fontFamily.sans],
      },
      minWidth : {
        '96' : "24rem",
      },
      height: {
        "100" : "30rem",
        "112": "37rem",
      }
    }
  },
  
  plugins: [],
}
export default config
