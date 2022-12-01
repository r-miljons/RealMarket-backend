require("dotenv").config();
const express = require("express");

const listingsRoutes = require("./routes/listings");

const app = express();

app.use("/listings", listingsRoutes);

app.get("/", (req,res) => {
    res.status(200).json({ message: "Welcome to the node api, send GET to /listings for more info" })
})

app.listen(process.env.PORT, () => {
  console.log("App is live on port", process.env.PORT);
});
