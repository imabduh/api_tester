const express = require("express");
const bodyParser = require("body-parser");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

const Data = sequelize.define("Data", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

sequelize.sync().then(() => {
  console.log("Database Berjalan");
});

app.get("/", async (req, res) => {
  const data = await Data.findAll();
  res.json(data);
});

app.post("/", async (req, res) => {
  const { name } = req.body;
  const data = await Data.create({ name });
  res.status(201).json(data);
});

app.get("/:id", async (req, res) => {
  const data = await Data.findOne({
    order: [["id", "DESC"]],
  });
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ message: "Data not found" });
  }
});

app.put("/", async (req, res) => {
  const data = await Data.findOne({
    order: [["id", "DESC"]],
  });
  if (data) {
    const { name } = req.body;
    data.name = name;
    await data.save();
    res.json(data);
  } else {
    res.status(404).json({ message: "Data not found" });
  }
});

app.delete("/", async (req, res) => {
  const lastData = await Data.findOne({
    order: [["id", "DESC"]],
  });
  if (lastData) {
    await lastData.destroy();
    return res.status(204).send();
  } else {
    return res.status(404).json({ message: "No data found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server Berjalan http://localhost:${PORT}`);
});
