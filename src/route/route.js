const { upgrader } = require("../controller/upgrader");

const AppRoutes = [
  {
    method: "POST",
    path: "/upgrade",
    options: {
      payload: {
        parse: true,
        allow: "multipart/form-data",
        multipart: { output: "stream" },
      },
    },
    handler: (request, h) => {
      return upgrader(request, h);
    },
  },
  {
    method: "GET",
    path: "/files/{fileName*}",
    handler: (request, h) => {
      return h.file(`files/${request.params.fileName}`);
    },
  },
  {
    method: "GET",
    path: "/{any*}",
    handler: (request, h) => {
      return { message: "Url Not Found" };
    },
  },
];

module.exports = AppRoutes;
