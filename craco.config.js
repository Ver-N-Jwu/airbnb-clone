// import CracoAlias from "craco-alias";
const cracoAlias = require("craco-alias");

module.exports = {
  plugins: [
    {
      plugin: cracoAlias,
      options: { baseUrl: "./src", source: "tsconfig", tsConfigPath: "tsconfig.paths.json" },
    },
  ],
};
