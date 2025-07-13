module.exports = {
  extends: ["next", "next/core-web-vitals"],
  plugins: ["@typescript-eslint", "react"],
  parser: "@typescript-eslint/parser",
  rules: {
    "react/react-in-jsx-scope": "off",
    // add your custom rules here
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
