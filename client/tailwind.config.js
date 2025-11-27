import withMT from "@material-tailwind/react/utils/withMT";
 
export default withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        bubble1: 'bubble 1.2s ease-in-out infinite',
        bubble2: 'bubble 1.2s ease-in-out 0.2s infinite',
        bubble3: 'bubble 1.2s ease-in-out 0.4s infinite',
      },
      keyframes: {
        bubble: {
          '0%': {
            transform: 'translateY(0) scale(1)',
          },
          '50%': {
            transform: 'translateY(-10px) scale(1.2)',
          },
          '100%': {
            transform: 'translateY(0) scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
});