const express = require("express");
const morgan = require("morgan");
const admin = require("./api/routes/admin.routes");
const patient = require("./api/routes/patient.routes");
const notFound = require("./utils/middlewares/notFound");
const { handlerErrors } = require("./utils/middlewares/errors");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

const config = require("../config/index");

const app = express();

app.set("views", path.join(__dirname, "/api/public/views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./api/public/")));

app.use("/admin", admin);
app.use("/", patient);

app.use(notFound);
app.use(handlerErrors);

const server = app.listen(config.port, () => {
  console.log(`Server on port ${config.port}`);
});

module.exports = { app, server };
