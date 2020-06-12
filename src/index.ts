import * as express from 'express';
import * as url from "url";
const bodyParser = require('body-parser');
const cors = require('cors');
  
const app: express.Application = express();
var envConfig = require('../config.json');

const productRoutes = require("./routes/product.routes");
const authRoutes = require('../src/routes/auth.routes');
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










