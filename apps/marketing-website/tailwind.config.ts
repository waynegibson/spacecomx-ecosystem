import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import tailwindForms from '@tailwindcss/forms'
import tailwindTypography from '@tailwindcss/typography'

export default <Partial<Config>>{
  theme: {
    fontFamily: {
      display: ['sans-serif', ...defaultTheme.fontFamily.sans],
      primary: ['sans-serif', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        ...defaultTheme.colors,
      },
    },
  },
  plugins: [
    tailwindForms(),
    tailwindTypography(),
  ],
}
