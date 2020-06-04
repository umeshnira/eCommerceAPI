var express = require("express"),
  path = require("path"),
  http = require("http");
var cors = require("cors");
var url = require("url");
var bodyParser = require("body-parser");
var app = express();
var envConfig = require('./config.json');

const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");
const productTypeRoutes = require("./routes/productType.routes");
const subProductTypeRoutes = require("./routes/subProductType.routes");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.set("port", process.env.PORT || envConfig.environment.port);

app.use("/products", productRoutes);
app.use("/subProductTypes", subProductTypeRoutes);
app.use("/productTypes", productTypeRoutes);
app.use("/auth", authRoutes);

app.listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});










