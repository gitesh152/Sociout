import 'dotenv/config'
import express from "express";
const app = express(); //Initiating express app
const PORT = process.env.PORT || 80;
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import db from "./config/mongoose.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import localPassport from "./config/passport-local-strategy.js";
import jwtPassport from "./config/passport-jwt-strategy.js";
import GooglePassport from "./config/passport-google-strategy.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import expressEjsLayouts from 'express-ejs-layouts';
import flash from "connect-flash";
import setFlash from "./middlewares/setFlash.js";
import logger from "morgan";
import morgan from './middlewares/morganLogger.js';

//Using cors
import cors from "cors";
app.use(cors());

//setup the chat server to be used with socket.io
import { createServer } from "http";
const chatServer = createServer(app)
import chatSockets from "./config/chat_sockets.js";
chatSockets(chatServer);
// chatServer.listen(5000);

chatServer.listen(5000, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Chat Server started listening on port 5000");
    }
});

//Using ejs-layouts
app.use(expressEjsLayouts);

//middleware for using static files
app.use(express.static(path.join(__dirname, "./assets")));

//middleware to include directory for storing files
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//cookie parser for storing cookie during local passport auth
app.use(cookieParser());

//body-parser to read form body
app.use(bodyParser.urlencoded({ extended: true }));

//setting up view engine
app.set("view engine", "ejs");

//extracting style and script from views to layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//Setting up express session user session to fetch session object using session stored in cookie
app.use(
    session({
        name: process.env.SESSION_NAME,
        secret: process.env.SESSION_COOKIE_KEY,

        //when user is not logged in, identity is not made, session is not created , should we store extra info in it : false
        saveUninitialized: false,

        //when session has user data like id & other info, should we resave of even there is no change.
        resave: false,
        cookie: { maxAge: 100 * 360 * 100 },
        store: MongoStore.create(
            {
                mongoUrl: `${process.env.MONGO_URI}`,

                //Disable expired sessions cleaning
                autoRemove: "disabled",
            },
            (error) => console.log(error || "Connect mongodb for mongostore")
        ),
    })
);

//telling the app to use initialize passport
app.use(passport.initialize());

//telling the app to use passport session which is used to desrialize user object,
//when user first auth, user object is serialized and stored in cookie which is sent to server
//for further req eexcept auth req.
app.use(passport.session());

//when any req is made, this middleware will be called, locals will be set to user
//now when passport is initailized only then this fn will be initialized
app.use(passport.setAuthenticatedUser);

//since flash msgs are stored in session, so we have to use after session
app.use(flash());
app.use(setFlash);

//Using morgan logger
app.use(logger(morgan.mode, { stream: morgan.accessLogStream }));

//using express router , for that we define a middleware using app.use
import index_route from "./routes/index.js";
app.use("/", index_route);

//when user requests for undefiend routes
app.get("*", async (req, res) => {
    // console.log(req.query);
    return res.sendFile(path.join(__dirname, "./views/error.html"));
});

app.listen(PORT, (err) => {
    if (err) console.log(`Error in running server :${err}`);
    console.log(`Server is running on port ${PORT}`);
});
