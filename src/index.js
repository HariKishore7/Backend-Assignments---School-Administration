const express = require("express");
const app = express();
app.use(express.json());
const studentArray = require("./InitialData.js");
const bodyParser = require("body-parser");
const port = 8080;
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// your code goes here

app.get("/api/student", (req, res) => {
  res.send(studentArray);
});
app.get("/api/student/:id", (req, res) => {
  const object = studentArray[req.params.id - 1];
  if (typeof object === "undefined") {
    res.sendStatus(404);
  } else {
    res.send(object);
  }
});
app.delete("/api/student/:id", (req, res) => {
  const object = studentArray[req.params.id - 1];
  if (typeof object === "undefined") {
    res.sendStatus(404);
  } else {
    delete studentArray[req.params.id - 1];
    res.sendStatus(200);
  }
});
app.post("/api/student", (req, res) => {
  if (req.body.name && req.body.currentClass && req.body.division){
    const id = studentArray.length + 1;
    const name = req.body.name;
    const currentClass = Number(req.body.currentClass);
    const division = req.body.division;
    studentArray.push({
      id: id,
      name: name,
      currentClass: currentClass,
      division: division,
    });
    res.send({ id: id });
  } else {
    res.sendStatus(400);
  }
});
const nullOrUndefined = (variable) => {
  return variable === null || variable === undefined ? true : false;
};
app.put("/api/student/:id", (req, res) => {
  const object = studentArray[req.params.id - 1];
  if (nullOrUndefined(object)) {
    res.sendStatus(400);
  } else {
    if (req.body.name || req.body.currentClass || req.body.division) {
      if (req.body.name) {
        object.name = req.body.name;
      }
      if (req.body.currentClass) {
        object.currentClass = Number(req.body.currentClass);
      }
      if (req.body.division) {
        object.division = req.body.division;
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  }
});
app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;