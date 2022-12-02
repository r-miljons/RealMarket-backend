require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const listingsRoutes = require("./routes/listings");

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/listings", listingsRoutes);

app.get("/", (req,res) => {
    res.status(200).json({ message: "Welcome to the node api, send GET to /listings for more info" })
})

// connect to db
mongoose.connect(process.env.DB_CONNECTION)
  .then(() => {
    // start listening on port when connection is established
    app.listen(process.env.PORT, () => {
      console.log("App is live on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  })


