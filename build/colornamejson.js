const fs = require("node:fs");

let colors;

fs.readFile("colors.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  colors = data;
});

fs.readFile("colornames.csv", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const colors = JSON.parse(data);
  console.log(colors);
});
