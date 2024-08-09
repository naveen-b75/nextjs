const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './magentoComponents/**/*.{js,ts,jsx,tsx}',
    './bigCommerceComponents/**/*.{js,ts,jsx,tsx}',
    './shopifyComponents/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-josefinSans)']
      },
      colors: {
        lightBlack: '#222222'
      },
      boxShadow: {
        productCard: '0px 1px 4px 0px rgba(0, 0, 0, 0.20)',
        plpShadow: '0px 1px 4px 2px rgba(0, 0, 0, 0.10)',
        menuShadow: '0 0px 4px 0px rgba(0, 0, 0, 0.25)'
      },
      gridTemplateColumns: {
        custom: 'repeat(4, minmax(0, auto))'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        blink: {
          '0%': { opacity: 0.2 },
          '20%': { opacity: 1 },
          '100% ': { opacity: 0.2 }
        }
      },
      animation: {
        fadeIn: 'fadeIn .3s ease-in-out',
        carousel: 'marquee 60s linear infinite',
        blink: 'blink 1.4s both infinite'
      }
    }
  },
  future: {
    hoverOnlyWhenSupported: true
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              'animation-delay': value
            };
          }
        },
        {
          values: theme('transitionDelay')
        }
      );
    })
  ]
};
