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

var biz = { name: "", year: 0, artist_id: 0 };
const q = "INSERT INTO albums VALUES (default, ${name}, ${year}, ${artist_id})";
const r = "SELECT id FROM albums WHERE name = ${name}";

prompt("Album name?")
  .then(val => {
    biz.name = val;
    return prompt("year: ");
  })
  .then(val => {
    biz.year = val;
    return prompt("Artist id?");
  })
  .then(val => {
    biz.artist_id = val;
    db.result(q, biz).then(res => {
      db.any(r, biz)
        .then(function(res) {
          console.log(`Created album with ID ${res[0].id}`);
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
