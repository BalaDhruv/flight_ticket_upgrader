"use strict";

const Hapi = require("@hapi/hapi");
const routes = require("./route/route");
const Path = require("path");

const server = Hapi.server({
  port: 3000,
  host: "localhost",
  routes: {
    files: {
      relativeTo: Path.join(__dirname, "../", "public"),
    },
  },
});

server.route(routes);

const init = async () => {
  await server.register(require("@hapi/inert"));
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  process.exit(1);
});

init();

module.exports = server;
