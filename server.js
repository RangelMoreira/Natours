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
//.catch((err) => console.log("ERROR"));

const port = process.env.port || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down");

  //Just kill the server
  server.close(() => {
    process.exit(1); //1 - for not sucessful exit -> Will aobort all pending and currently running requests
  });
});
