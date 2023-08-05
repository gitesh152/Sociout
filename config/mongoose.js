import mongoose from "mongoose";
mongoose.connect(`${process.env.MONGO_URI}`);
const db = mongoose.connection;

//If error connecting mongodb
db.on("error", console.error.bind(console, "Error connecting db"));

//Once databse is open and connected
db.once("open", () => console.log(`Connected to db ${db.name}`));
export default db;
