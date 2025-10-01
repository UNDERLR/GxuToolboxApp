module.exports = {
    root: true,
    extends: "@react-native",
    rules: {
        quotes: ["warn", "double"],
        semi: "warn",
        "react-native/no-inline-styles": 0,
        "react-hooks/exhaustive-deps": 0,
        "curly": 0,
        "@typescript-eslint/no-unused-vars": 1,
    },
};
