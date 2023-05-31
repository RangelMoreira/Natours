const fs = require("fs");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const Tour = require("../../models/tourModel");

dotenv.config({ path: "../../config.env" });

//Replacing the string '<PASSWORD>'  for the real password and
//returnig complete string fror connect

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

/*
  To connet to local database is just necessary 
  Change the value of "DB" for connect(process.env.DATABASE_LOCAL
*/
mongoose
  // .connect(process.env.DATABASE_LOCAL,{
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful!"));

//Read Json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

//IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data Successfully loaded!");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

//DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data Successfully deleted!");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

//console.log(process.argv);
