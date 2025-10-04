
import type { Config } from "tailwindcss";
export default {
        darkMode: ["class"],
        content: ["./index.html", "./src/**/*.{ts,tsx}"],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom colors for Pair Up Events
				pairup: {
					darkBlue: '#1A2A33',
					darkBlueAlt: '#223842',
					cyan: '#27E9F3',
					yellow: '#FECC08',
					cream: '#F5E6C8'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
                        keyframes: {
                                'fade-in': {
                                        '0%': {
                                                opacity: '0',
                                                transform: 'translateY(10px)'
                                        },
                                        '100%': {
                                                opacity: '1',
                                                transform: 'translateY(0)'
                                        }
                                }
                        },
                        animation: {
                                'fade-in': 'fade-in 0.5s ease-out forwards'
                        },
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				display: ['Poppins', 'sans-serif']
			},
			transitionProperty: {
				// Enables the utility class `transition-shadow`
				shadow: 'box-shadow',
				// Optional combo if you ever want to animate both box-shadow and opacity together: `transition-shadow-opacity`
				'shadow-opacity': 'box-shadow, opacity'
			}
		}
	},
        plugins: [],
} satisfies Config;
