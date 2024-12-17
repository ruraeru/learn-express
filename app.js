const express = require("express");
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

try {
    fs.readdirSync("uploads");
} catch (err) {
    console.error("uploads 폴더거 없어서 uploads 폴더를 생성합니다.");
    fs.mkdirSync("uploads");
}

dotenv.config();
const indexRouter = require("./routes");
const userRouter = require("./routes/user");

const app = express();
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "vies"));
app.set("view engine", "pub");

app.use(morgan("dev"));
// app.use("/", express.static(path.join(__dirname, "public")))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    },
    name: "session-cookie"
}));

app.use("/", indexRouter);
app.use("/user", userRouter);

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, "uploads/");
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
})

app.post("/upload", upload.none(), (req, res) => {
    console.log(req.body);
    res.send("ok")
})

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중")
})