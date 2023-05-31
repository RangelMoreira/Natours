const mongoose = require("mongoose");

const dotenv = require("dotenv");
/*
We should add first the dotenv and after the app
*/

dotenv.config({ path: "./config.env" });
const app = require("./app");

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

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
