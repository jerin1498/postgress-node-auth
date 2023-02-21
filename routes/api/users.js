// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { Pool, Client } = require("pg");
// const keys = require("../../config/keys");

// const client = new Client({
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT,
// });

// router.post("/checklogin", (req, res) => {
//   const username = "'" + req.body.username + "'";
//   const password = req.body.password;

//   try {
//     var pool = new Pool();

//     //console.log("SELECT * FROM public.'Users' WHERE username = '" + username + "' limit 1");

//     pool.query(
//       'SELECT * FROM public."Users" WHERE username = ' + username + " limit 1",
//       function (err, sres) {
//         //console.log("Response", sres);

//         if (sres != undefined) {
//           if (sres.rows.length > 0) {
//             if (sres.rows[0].userpass == password) {
//               const payload = {
//                 id: sres.rows[0].username,
//                 name: sres.rows[0].username,
//               };

//               jwt.sign(
//                 payload,
//                 keys.secretOrKey,
//                 {
//                   expiresIn: 31556926, // 1 year in seconds
//                 },
//                 (err, token) => {
//                   req.session.userid = sres.rows.refno;
//                   req.session.save();

//                   // localStorage.setItem("UserId", sres.rows.refno);
//                   // localStorage.setItem("token", token);

//                   res.json({
//                     success: true,
//                     message: "Login Success",
//                     Result: sres.rows,
//                     token: "Bearer " + token,
//                   });
//                 }
//               );
//             } else {
//               res.json({
//                 success: false,
//                 message: "Incorrect password",
//                 //user: sres.rows
//               });
//             }
//           } else {
//             res.json({
//               success: false,
//               message: "Invalid Username",
//             });
//           }
//         } else {
//           res.json({
//             success: false,
//             message: "Error Occured",
//           });
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// });

// module.exports = router;
