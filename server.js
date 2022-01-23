const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 80;
const dotenv = require("dotenv").config();
// const connect = require("./apps/db/connect");
const ejs = require("ejs");
const layouts = require("express-ejs-layouts");
const appRoutes = require("./apps/routes/app");
const authRoutes = require("./apps/routes/auth");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(layouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(appRoutes);
app.use(authRoutes);

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
