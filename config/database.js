const mongoose = require("mongoose");
const connexion = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect(
        process.env.MONGODB_URL
    );
    const db = mongoose.connection;

    db.on("error", (err) => {
        console.log(err);
    });

    db.once("open", () => {

        console.log("DB connection established");
    });

}

exports.connexion = connexion;