const http = require("http");
const app = require("./app");

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(3005);
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// fastify permet la gestion de la base de données
//Il permet de vérifier rapidement les requêtes entrantes et sortantes
const fastify = require("fastify")({
  logger: true,
});

// helmet permet de sécuriser l'API
const helmet = require("@fastify/helmet");
require("dotenv").config();

// cors permet que le frontend appelle le backend
const cors = require("@fastify/cors");
const compress = require("@fastify/compress");
const auth = require("./middlewares/auth");

const start = async () => {
  try {
    await fastify.register(cors);
    await fastify.register(compress, {
      encodings: ["gzip"],
    });
    await fastify.register(require("@fastify/rate-limit"), {
      max: 2,
      timeWindow: 1000,
    });
    await fastify.listen(3005);
  } catch (error) {
    fastify.log.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
};
start();

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);
