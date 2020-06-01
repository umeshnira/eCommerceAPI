var express = require("express"),
  path = require("path"),
  http = require("http");
var url = require("url");
var bodyParser = require("body-parser");
var app = express();

const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");
const productTypeRoutes = require("./routes/productType.routes");
const subProductTypeRoutes = require("./routes/subProductType.routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("port", process.env.PORT || 8100);
app.use(express.static(path.join(__dirname, "../dist/ECommerceApplication")));
app.listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});

function supportCrossOriginScript(req, res, next) {
  res.status(200);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type", "Authorization");
  next();
}

app.use("/products", productRoutes);
app.use("/subProductType", subProductTypeRoutes);
app.use("/productType", productTypeRoutes);
app.use("/auth",authRoutes);







// app.options('/submitIssue', supportCrossOriginScript);
// app.post('/submitIssue', supportCrossOriginScript, function (req, res) {
//     var descrip = req.body.descrip;
//     var priority = req.body.priority;
//     var employeeid = req.body.employeeid;
//     var filename1=req.body.filename1;

//     connection.query('set @descrip=?;set @priority=?;set @employeeid=?;set @filename1=?;  call usp_submitissue(@descrip,@priority,@employeeid,@filename1)', [ descrip, priority,employeeid,filename1], function (err, rows) {
//         if (err) {
//             console.log("Problem with MySQL" + err);
//         }
//         else {
//             console.log("NewItem  is  " + JSON.stringify(rows[4]));

//             res.end(JSON.stringify(rows[4]));
//         }
//         res.end();
//     });

// });
