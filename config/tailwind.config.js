/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require("tailwindcss/colors");
//for tailwind styles to be applied to cypress component tests i have include a second relative path
/** @type {import('tailwindcss').Config} */
module.exports = {
    prefix: "tw-",
    content: ["./src/client/**/*.{js,jsx,ts,tsx}", "../src/client/**/*.{js,jsx,ts,tsx}"],
    theme: {
        container: {
            center: true,
        },
        colors: {
            primary: colors.slate,
            error: colors.slate,
            secondary: colors.slate,
            success: colors.slate,
            neutral: colors.slate,
            warning: colors.slate,
        },
        extend: {
            fontFamily: {
                LogoFont: ["Gluten", "cursive"],
            },
        },
    },
    plugins: [],
};
