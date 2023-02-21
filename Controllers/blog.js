const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool, Client } = require("pg")

const uploadFile = require("../middleware/upload");

//import { uploadFile } from "../middleware/upload";

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
})

export const addBlog = async (req, res) => {
    try {

        //console.log("Request", req.body);

        try {

            //let fileUrl = await uploadFile(req);

            var pool = new Pool();

            const {type, category, title, short_description, description, tags, author, minutes} = req.body;

            //type = "'" + type + "'";

            console.log("Type", type);
            // console.log("category", category);
            // console.log("title", title);
            // console.log("short_description", short_description);
            // console.log("description", description);
            // console.log("tags", tags);
            // console.log("author", author);
            // console.log("minutes", minutes);

            var query = 'INSERT INTO public."blognews"(type, category, title, short_description, description, tags, author, image, created_by, created_date) VALUES ()'
    
            //console.log("SELECT * FROM public.'Users' WHERE username = '" + username + "' limit 1");
    
            // pool.query(query, function (err, sres) {
        
            //     if(sres != undefined)
            //     {
            //         if (sres.rows.length > 0) {
    
            //             if(sres.rows[0].userpass == password)
            //             {
            //                 const payload = {
            //                     id: sres.rows[0].username,
            //                     name: sres.rows[0].username
            //                 };
            
            //                 jwt.sign(
            //                     payload,
            //                     keys.secretOrKey,
            //                     {
            //                         expiresIn: 31556926 // 1 year in seconds
            //                     },
            //                     (err, token) => {
            //                         res.json({
            //                             success: true,
            //                             message: "Login Success",
            //                             Result: sres.rows,
            //                             token: "Bearer " + token
            //                         });
            //                     }
            //                 );
            //             }
            //             else
            //             {
            //                 res.json({
            //                     success: false,
            //                     message: "Incorrect password",
            //                     //user: sres.rows
            //                 });
            //             }
        
                        
            //         }
            //         else {
            //             res.json({
            //                 success: false,
            //                 message: "Invalid Username",
            //             });
            //         }
            //     }
            //     else
            //     {
            //         res.json({
            //             success: false,
            //             message: "Error Occured",
            //         });
            //     }
                
            // });
    
        }
        catch (error) {
            console.log(error);
        }

        

        // req.body.formData.forEach(element => {
        //     console.log("Inside For each", element)
        // })

        // uploadFile(req, req.file, res);

        // if (req.file == undefined) {
        //     return res.status(400).send({ message: "Please upload a file!" });
        // }

        // res.status(200).send({
        //     message: "Uploaded the file successfully: " + req.file.originalname,
        // });
    } catch (err) {
        // res.status(500).send({
        //     message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        // });
    }
};