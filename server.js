const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Pool, Client } = require("pg");
const dotenv = require("dotenv");
var fileupload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

dotenv.config();

const authRouter = require("./routes/api/auth.routes");
const userRouter = require("./routes/api/user.routes");
// const users = require("./routes/api/users");
const blog = require("./routes/api/blog");

const db = require("./models");
const Role = db.role;

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
  initial();
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}

// const readdirSync = require("fs");

const port = 8383;

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// app.use(cors(corsOptions)) // Use this after the variable declaration

// app.use(express.static('public'));

// app.use(express.json());
// app.use(bodyParser.json({limit: '50mb'}));

// app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: true,
  })
);

app.use(cors(corsOptions));
//serve static files
app.use(express.static("public"));
app.use(fileupload());
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

app.get("/", (req, res) => {
  res.status(200).json({ successMsg: "Connected" });
});

// route - This func is for importing routes files automaticaly. so we dont need to import separately
//readdirSync.readdir("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

// app.use("/users", users);
app.use("/api/blog", blog);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

app.listen(port, () => console.log(`Server has started in port: ${port}`));
