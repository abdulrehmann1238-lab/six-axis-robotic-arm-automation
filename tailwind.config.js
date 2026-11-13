/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          bg: '#F5F5F1',
          bgSecondary: '#ECEDE8',
          surface: '#FFFFFF',
          text: '#202724',
          textMuted: '#68716D',
          accent: '#426B5B',
          accentLight: '#8EA99A',
          warm: '#B18A62',
          border: '#E2E5DF',
          dark: '#202923',
          darkSurface: '#29342E',
          darkBorder: '#3A4840',
          success: '#56866A',
          warning: '#B58A4C',
          fault: '#B45F57',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow-packet': 'flowPacket 2.5s linear infinite',
      },
      keyframes: {
        flowPacket: {
          '0%': { offsetDistance: '0%' },
          '100%': { offsetDistance: '100%' },
        }
      }
    },
  },
  plugins: [],
}

