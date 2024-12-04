import { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'foreground': '#171717', // Define the foreground color here
        'background': '#ffffff', // Optional: Ensure the background color is also defined
        'textBlue': '#5D9ACC', // Blue for the footer background and texts
        'buttonBlue': '#659FCF', // Blue for buttons like "Submit"
        'textGray': '#171717', // Gray for text and strokes
        'formGray': '#9EA2AB', // Gray for input fields, placeholders, and rating stars
        'starYellow': '#F5A200', // Yellow for star ratings
        'lightBackground': '#E4F3FF', // Light background colors
        'babyBlue': '#B4DCFD', // Light blue for background like Shopping Cart page
        'labelGreen': '#67B35B', // Green for Warranty label and snackbar
        'lightHeaderBlue': '#E4F3FF', // Added for secondary headers
        'dangerRed': '#BA4F4F', // Red for snackbar, deactivate, etc
      },
      fontFamily: {
        sans: ['Gabarito', 'sans-serif'],
        decor: ['Darumadrop One', 'sans-serif'],
      },
      fontSize: {
        'heading-xl': ['48px', { lineHeight: '48px', letterSpacing: '0.02em', fontWeight: '700'}], // Large headings, such as Product Name, Sale & Promo, etc
        'heading-md': ['32px', { lineHeight: '32px', letterSpacing: '0.02em', fontWeight: '600' }], // Medium headings, such as Reviews and Hello Username
        'body-lg': ['18px', { lineHeight: '24px', letterSpacing: '0.01em', fontWeight: '400' }], // Section heading
        'body-md': ['18px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '400' }], // Product details
        'body-sm': ['14px', { lineHeight: '18px', letterSpacing: '0.01em', fontWeight: '400' }], // Small body text, such as review and description
        'label-md': ['16px', { lineHeight: '24px', letterSpacing: '0.02em', fontWeight: '500' }], // Labels and big buttons
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '500'}], // Small labels
        'body-xs': ['12px', { lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '400' }], // Extra small body text

      },
      spacing: {
        buttonPadding: '12px 32px', // Padding for buttons
      },
    },
  },
  plugins: [],
};

export default config;
