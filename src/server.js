require("dotenv").config();
const connection = require("./config/database");
const express = require("express");
const app = express();
const port = process.env.PORT || 8002;
const fileUpload = require("express-fileupload");
const routerAPI = require("./routes/api");
const path = require("path");

const cors = require("cors");
app.use(express.static(path.join("./src", "public")));

app.use(cors());

app.use(express.json());
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/v1/api/", routerAPI);
app.use(
  "/images",
  express.static(path.join(__dirname, "public/images/upload"))
);
(async () => {
  try {
    await connection();
    app.listen(port, () => {
      console.log(`Backend zero app listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>check error connection db", error);
  }
})();
