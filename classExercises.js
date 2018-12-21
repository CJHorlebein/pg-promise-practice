const express = require("express");
const app = express();
const bodyParser = require("body-parser");

let promise = require("bluebird");

const initOptions = {
  promiseLib: promise
};

const pgp = require("pg-promise")(initOptions);

const config = {
  host: "localhost",
  port: 5432,
  database: "restaurant_db",
  user: "postgres"
};

const db = pgp(config);

// db.query("SELECT * FROM restaurant").then(function(results) {
//   results.forEach(function(r) {
//     console.log(r.id, r.name, r.category);
//   });
// });

// db.one("SELECT * FROM restaurant WHERE name='McDonalds'").then(function(r) {
//   console.log(r.id, r.name, r.address, r.category);
// });

// let name = "Narf";
// const query = `INSERT INTO restaurant("name") \
//   VALUES('${name}')`;

// db.result(query).then(function(results) {
//   console.log(results);
// });

var biz = { name: "Waffle House" };
const q = "INSERT INTO restaurant \
  VALUES (default, ${name})";

db.result(q, biz).then(function(result) {
  console.log(result);
});

pgp.end();
