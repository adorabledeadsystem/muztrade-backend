import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import dotenv from "dotenv";
import nodemailer from 'nodemailer'
import fs from "fs"
import https from "https"

import {
  registerValidation,
  loginValidation,
  newsCreateValidation,
  photosCreateValidation,
} from "./validations.js";
import {
  UserController,
  NewsController,
  PhotosController,
} from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import cors from "cors";

mongoose
  .connect(
    "mongodb+srv://muztrade:admin@cluster0.dze7mk0.mongodb.net/muz?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("Connection failed", err));


const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();

var myemail = process.env.EMAIL;
var mypassword = process.env.PASSWORD;

function sendEmail( messageText ) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true,
      auth: {
        user: myemail,
        pass: mypassword,
      },
    });
    console.log(messageText.name, myemail)
    const mail_configs = {
      from: myemail,
      to: myemail,
      subject: "Заявка с сайта MuzTrade",
      html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>CodePen - OTP Email Template</title>
</head>
<body>
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <p>Заявка с сайта MuzTrade</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">Имя: ${messageText.name}<br>Номер: ${messageText.phone}
    ${messageText.email ? `<br>Почта: ${messageText.email}` : ''}
    ${messageText.theme ? `<br>Тема: ${messageText.theme}` : ''}
    ${messageText.service ? `<br>Вид услуги: ${messageText.service}` : ''}
    ${messageText.file ? `<br>Файл: <img src=${messageText.file}/>` : ''}
    ${messageText.comment ? `<br>Комментарий: ${messageText.comment}` : ''}
    </h2>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="border-bottom:1px solid #eee">
      <a href="http://muztrade.com/" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Перейти на MuzTrade</a>
    </div>
  </div>
</div>
</body>
</html>`
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message:' An error has occured ' + error});
      }
      return resolve("Email sent succesfuly".json());
    });
  });
}

app.post("/send", (req, res) => {
  console.log("Somebody just hit me");
  console.log(req.body);
  sendEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.use("/uploads", express.static("uploads"));

var key = fs.readFileSync( './key.key');
var cert = fs.readFileSync('./cert.crt');
var options = {
  key: key,
  cert: cert
};

app.get("/", (req, res) => {
  res.send("Server");
});

var server = https.createServer(options, app);

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/registr",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/user", checkAuth, UserController.user);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/news", NewsController.getAll);
app.get("/news/:id", NewsController.getOne);
app.post(
  "/news",
  checkAuth,
  newsCreateValidation,
  handleValidationErrors,
  NewsController.create
);
app.delete("/news/:id", checkAuth, NewsController.remove);
app.patch(
  "/news/:id",
  checkAuth,
  newsCreateValidation,
  handleValidationErrors,
  NewsController.update
);

app.get("/photos", PhotosController.getAll);
app.get("/photos/:id", PhotosController.getOne);

app.post(
  "/photos",
  checkAuth,
  photosCreateValidation,
  handleValidationErrors,
  PhotosController.create
);
app.delete("/photos/:id", checkAuth, PhotosController.remove);
app.patch(
  "/photos/:id",
  checkAuth,
  photosCreateValidation,
  handleValidationErrors,
  PhotosController.update
);

server.listen(4444, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server started!");
});

/*
app.listen(4444, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server started!");
});
*/