//use path module
const path = require("path");
//use express module
const express = require("express");
//use hbs view engine
const hbs = require("hbs");
//use bodyParser middleware
const bodyParser = require("body-parser");
//use mysql database
const mysql = require("mysql");
const app = express();
//use md5 encrypt
const md5 = require("md5");

//konfigurasi koneksi
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud_node",
});

//connect ke database
conn.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected...");
});

//set views file
app.set("views", path.join(__dirname, "views"));
//set view engine
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public sebagai static folder untuk static file
app.use("/assets", express.static(__dirname + "/public"));

//route untuk homepage
app.get("/", (req, res) => {
  let sql = "SELECT * FROM pengguna";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.render("v_pengguna", {
      results: results,
    });
  });
});

//route untuk insert data
app.post("/simpan", (req, res) => {
  let data = {
    username: req.body.username,
    password: md5(req.body.password),
    nama: req.body.nama,
  };
  let sql = "INSERT INTO pengguna SET ?";
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

//route untuk update data
app.post("/edit", (req, res) => {
  let sql;
  if (req.body.password === "") {
    sql =
      "UPDATE pengguna SET username='" +
      req.body.username +
      "', nama='" +
      req.body.nama +
      "' WHERE id_user=" +
      req.body.id_user;
  }
  if (req.body.password != "") {
    sql =
      "UPDATE pengguna SET username='" +
      req.body.username +
      "', password='" +
      md5(req.body.password) +
      "', nama='" +
      req.body.nama +
      "' WHERE id_user=" +
      req.body.id_user;
  }
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

//route untuk delete data
app.post("/delete", (req, res) => {
  let sql = "DELETE FROM pengguna WHERE id_user=" + req.body.id_user + "";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

//server listening
app.listen(8000, () => {
  console.log("Server is running at port 8000");
});
