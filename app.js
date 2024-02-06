const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const allRoutes = require("./routes/allRoutes");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(__dirname));

app.use(allRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  const { message = "Something unknown went wrong", statusCode = 500 } = err;
  res.status(statusCode).render("pages/error");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
