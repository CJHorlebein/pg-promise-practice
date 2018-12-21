const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const promise = require("bluebird");

const initOptions = {
  promiseLib: promise
};

const pgp = require("pg-promise")(initOptions);

const config = {
  host: "localhost",
  port: 5432,
  database: "musical_db",
  user: "postgres"
};

const db = pgp(config);

var co = require("co");
var prompt = require("prompt-promise");

var biz = { name: "" };
const q = "INSERT INTO artists VALUES (default, ${name})";
const r = "SELECT id FROM artists WHERE name = ${name}";

prompt("Artist name? ")
  .then(value => {
    biz.name = value;
    db.result(q, biz).then(res => {
      db.any(r, biz)
        .then(function(results) {
          console.log(`Created artist with ID ${results[0].id}`);
        })
        .then(res => {
          pgp.end();
          prompt.done();
        });
    });
  })
  .catch(function rejected(err) {
    console.log("error:", err.stack);
    pgp.end();
    prompt.finish();
  });

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

// var biz = { name: val };
// const q = "INSERT INTO albums \
//   VALUES (default, ${name})";

// db.result(q, biz).then(function(result) {
//   console.log(result);
// });
