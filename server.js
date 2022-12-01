require("dotenv").config();
const express = require("express");

const app = express();

app.get("/", (req,res) => {
    res.status(200).json({ message: "Welcome to the node api" })
})

app.listen(process.env.PORT, () => {
  console.log("App is live on port", process.env.PORT);
});
