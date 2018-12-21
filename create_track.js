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

var biz = { name: "", album_id: 0, duration: 0 };
const q = "INSERT INTO tracks VALUES (default, ${name}, ${album_id}, ${duration})";
const r = "SELECT id FROM tracks WHERE name = ${name}";

prompt("Track name?")
  .then(val => {
    biz.name = val;
    return prompt("Album ID? ");
  })
  .then(val => {
    biz.album_id = val;
    return prompt("Duration in seconds?");
  })
  .then(val => {
    biz.duration = val;
    db.result(q, biz).then(res => {
      db.any(r, biz)
        .then(function(res) {
          console.log(`Created Track with ID ${res[0].id}`);
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
