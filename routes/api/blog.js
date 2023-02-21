const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool, Client } = require("pg")

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
})

var session;

router.post("/addBlog", function (req, res) {

    try {

        var filePath=null;

        if (req.files) {
            let image = req.files.banner;

            image.mv("./Content/Images/" + image.name, async (err, done) => {
                if (err) {
                    console.log("err");
                }
            });

            filePath = "http://localhost:8383/Content/Images/" + image.name;
        }

        var pool = new Pool();

        var { type, category, title, short_description, description, tags, author, minutes} = req.body;

        // //console.log("Tags", JSON.parse(tags));

        // tags = JSON.parse(tags);

        // var blog_tags = "";

        // tags.forEach(element => {
        //     blog_tags = blog_tags + element.display + ", ";
        // });

        // blog_tags = blog_tags.substring(0, blog_tags.length - 1);

        // //console.log("Login User", req.session.userid);

        blog_tags = tags;

        var created_by = 1;

        type = "'" + type + "'";
        title = "'" + title + "'";
        short_description = "'" + short_description + "'";
        description = "'" + description + "'";
        blog_tags = "'" + blog_tags + "'";
        minutes = "'" + minutes + "'";

        var curDate = new Date();

        curDate = curDate.toISOString()

        curDate = "'" + curDate + "'";

        var query = 'INSERT INTO public."blognews"(type, category, title, short_description, description, tags, author, image, minutes_to_read, created_by, created_date)';

        query = query + " VALUES (" + type + "," + category + "," + title + "," + short_description + "," + description + "," + blog_tags + "," + author + ",'" + filePath + "', " + minutes + "," + created_by + "," + curDate + ")  RETURNING blog_id";

        pool.query(query, function (err, response) {

            if (err) {
                res.json({
                    success: false,
                    message: err.toString(),
                });
            }

            if (response != undefined) {
                if (response.rows.length > 0) {

                    res.json({
                        success: true,
                        message: "Blog added Successfully",
                        Result: response.rows,
                    });
                }
                else {
                    res.json({
                        success: false,
                        message: "Something went wrong",
                    });
                }
            }
            else {
                res.json({
                    success: false,
                    message: "Something went wrong",
                });
            }

        });

        // res.json({
        //     success: true,
        //     message: "Something went wrong",
        // });

    }
    catch (error) {
        console.log(error);
    }
})

router.post("/getAllBlogsNews", function (req, res) {

    try {

        var pool = new Pool();

        const type = "'" + req.body.type + "'";

        var query = 'SELECT blog_id, category, title, short_description, tags, image, minutes_to_read FROM public.blognews WHERE delete_status = 0 AND type = ' + type + ' ORDER BY blog_id ASC';

        pool.query(query, function (err, response) {

            if (err) {
                res.json({
                    success: false,
                    message: err.toString(),
                });
            }

            if (response != undefined) {
                if (response.rows.length > 0) {

                    res.json({
                        success: true,
                        message: "Blogs are available",
                        Result: response.rows,
                    });
                }
                else {
                    res.json({
                        success: false,
                        message: "Blogs not available",
                    });
                }
            }
            else {
                res.json({
                    success: false,
                    message: "Something went wrong",
                });
            }
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: error.toString(),
        });
    }
})

router.post("/getBlogById", function (req, res) {

    try {

        var pool = new Pool();

        const id = req.body.id;

        var query = 'SELECT * FROM public.blognews WHERE delete_status = 0 AND blog_id = ' + id + ' ORDER BY blog_id ASC';

        pool.query(query, function (err, response) {

            if (err) {
                res.json({
                    success: false,
                    message: err.toString(),
                });
            }

            if (response != undefined) {
                if (response.rows.length > 0) {

                    res.json({
                        success: true,
                        message: "Blog available",
                        Result: response.rows,
                    });
                }
                else {
                    res.json({
                        success: false,
                        message: "Blogs not available",
                    });
                }
            }
            else {
                res.json({
                    success: false,
                    message: "Something went wrong",
                });
            }
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: error.toString(),
        });
    }
})

router.post("/updateBlog", function (req, res) {

    try {

        var filePath=null;

        if (req.files) {
            let image = req.files.banner;

            image.mv("./Content/Images/" + image.name, async (err, done) => {
                if (err) {
                    console.log("err");
                }
            });

            filePath = "http://localhost:8383/Content/Images/" + image.name;
        }

        var pool = new Pool();

        var { type, category, title, short_description, description, tags, author, minutes, blog_id } = req.body;

        var modified_by = 1;

        type = "'" + type + "'";
        title = "'" + title + "'";
        short_description = "'" + short_description + "'";
        description = "'" + description + "'";
        tags = "'" + tags + "'";
        minutes = "'" + minutes + "'";

        var curDate = new Date();

        curDate = curDate.toISOString()

        curDate = "'" + curDate + "'";

        var query = '';

        if(filePath != null)
        {
            query = "UPDATE public.blognews SET type = " + type + ", category = " + category + ", title = " + title + ", short_description = " + short_description + ", description = " + description + ", tags=" + tags + ", author = " + author + ", image = '" + filePath + "', minutes_to_read  = " + minutes + ",  modified_by = " + modified_by + ", modified_date = " + curDate + " WHERE blog_id = " + blog_id + " RETURNING blog_id";
        }
        else{
            query = "UPDATE public.blognews SET type = " + type + ", category = " + category + ", title = " + title + ", short_description = " + short_description + ", description = " + description + ", tags=" + tags + ", author = " + author + ", minutes_to_read  = " + minutes + ",  modified_by = " + modified_by + ", modified_date = " + curDate + " WHERE blog_id = " + blog_id + " RETURNING blog_id";
        }
        
        pool.query(query, function (err, response) {

            if (err) {
                res.json({
                    success: false,
                    message: err.toString(),
                });
            }

            if (response != undefined) {
                if (response.rows.length > 0) {

                    res.json({
                        success: true,
                        message: "Blog updated Successfully",
                        Result: response.rows,
                    });
                }
                else {
                    res.json({
                        success: false,
                        message: "Something went wrong",
                    });
                }
            }
            else {
                res.json({
                    success: false,
                    message: "Something went wrong",
                });
            }

        });

    }
    catch (error) {
        console.log(error);
    }
})

router.post("/DeleteBlogById", function (req, res) {

    try {

        var pool = new Pool();

        var { id, userID } = req.body;

        var curDate = new Date();

        curDate = curDate.toISOString()

        curDate = "'" + curDate + "'";

        var query = 'UPDATE public.blognews SET delete_status = 1, deleted_by = ' + userID + ', deleted_date = ' + curDate + ' WHERE blog_id = ' + id + ' RETURNING blog_id';

        pool.query(query, function (err, response) {

            if (err) {
                res.json({
                    success: false,
                    message: err.toString(),
                });
            }

            console.log("Response", response);

            if (response != undefined) {
                if (response.rows.length > 0) {

                    res.json({
                        success: true,
                        message: "Deleted successfully",
                        //Result: response.rows,
                    });
                }
                else {
                    res.json({
                        success: false,
                        message: "Blogs/News not available",
                    });
                }
            }
            else {
                res.json({
                    success: false,
                    message: "Something went wrong",
                });
            }
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: error.toString(),
        });
    }
})

//<----------------------------------------- BLOG CATEGORIES -- START ---------------------------------------->


router.post("/addBlogCategories", function (req, res) {

    try {

        var pool = new Pool();

        var { category_name } = req.body;

        var created_by = 1;

        category_name = "'" + category_name + "'";

        var curDate = new Date();

        curDate = curDate.toISOString()

        curDate = "'" + curDate + "'";

        var query = 'INSERT INTO public."blog_categories"(category_name, added_by, added_date)';

        query = query + " VALUES (" + category_name + "," + created_by + "," + curDate + ")  RETURNING category_id";

        pool.query(query, function (err, response) {

            if (err) {
                res.json({
                    success: false,
                    message: err.toString(),
                });
            }

            if (response != undefined) {
                if (response.rows.length > 0) {

                    res.json({
                        success: true,
                        message: "Blog added Successfully",
                        Result: response.rows,
                    });
                }
                else {
                    res.json({
                        success: false,
                        message: "Something went wrong",
                    });
                }
            }
            else {
                res.json({
                    success: false,
                    message: "Something went wrong",
                });
            }

        });

    }
    catch (error) {
        console.log(error);
    }
})

router.post("/getAllBlogsCategories", function (req, res) {

    try {

        console.log("Login User", req.session.userid);
        // console.log("Login token", localStorage.getItem('token'));

        var pool = new Pool();

        var query = 'SELECT category_id, category_name FROM public.blog_categories WHERE delete_status = 0';

        pool.query(query, function (err, response) {

            if (err) {
                res.json({
                    success: false,
                    message: err.toString(),
                });
            }

            if (response != undefined) {
                if (response.rows.length > 0) {

                    res.json({
                        success: true,
                        message: "Categories are available",
                        Result: response.rows,
                    });
                }
                else {
                    res.json({
                        success: false,
                        message: "Categories not available",
                    });
                }
            }
            else {
                res.json({
                    success: false,
                    message: "Something went wrong",
                });
            }
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: error.toString(),
        });
    }
})

router.post("/getBlogCategoryById", function (req, res) {

    try {

        var pool = new Pool();

        const category_id = req.body.category_id;

        var query = 'SELECT category_id, category_name FROM public.blog_categories WHERE delete_status = 0 AND category_id= ' + category_id;

        pool.query(query, function (err, response) {

            if (err) {
                res.json({
                    success: false,
                    message: err.toString(),
                });
            }

            if (response != undefined) {
                if (response.rows.length > 0) {

                    res.json({
                        success: true,
                        message: "Category available",
                        Result: response.rows,
                    });
                }
                else {
                    res.json({
                        success: false,
                        message: "Category not available",
                    });
                }
            }
            else {
                res.json({
                    success: false,
                    message: "Something went wrong",
                });
            }
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: error.toString(),
        });
    }
})

router.post("/updateBlogCategory", function (req, res) {

    try {

        var pool = new Pool();

        var { category_name, category_id } = req.body;

        var modified_by = 2;

        category_name = "'" + category_name + "'";

        var curDate = new Date();

        curDate = curDate.toISOString()

        curDate = "'" + curDate + "'";

        var query = 'UPDATE public.blog_categories SET category_name = ' + category_name + ', modified_by = ' + modified_by + ', modified_date = ' + curDate + ' WHERE category_id = ' + category_id + ' RETURNING category_id';

        pool.query(query, function (err, response) {

            if (err) {
                res.json({
                    success: false,
                    message: err.toString(),
                });
            }

            if (response != undefined) {
                if (response.rows.length > 0) {

                    res.json({
                        success: true,
                        message: "Category updated Successfully",
                        Result: response.rows,
                    });
                }
                else {
                    res.json({
                        success: false,
                        message: "Category not available to delete",
                    });
                }
            }
            else {
                res.json({
                    success: false,
                    message: "Category went wrong",
                });
            }

        });

    }
    catch (error) {
        console.log(error);
    }
})

router.post("/DeleteBlogCategory", function (req, res) {

    try {

        var pool = new Pool();

        var { category_id } = req.body;

        var deleted_by = 1;

        var curDate = new Date();

        curDate = curDate.toISOString()

        curDate = "'" + curDate + "'";

        var query = 'UPDATE public.blog_categories SET delete_status = 1, deleted_by = ' + deleted_by + ', deleted_date = ' + curDate + ' WHERE category_id = ' + category_id + ' RETURNING category_id';

        pool.query(query, function (err, response) {

            if (err) {
                res.json({
                    success: false,
                    message: err.toString(),
                });
            }

            if (response != undefined) {
                if (response.rows.length > 0) {

                    res.json({
                        success: true,
                        message: "Category deleted Successfully",
                        Result: response.rows,
                    });
                }
                else {
                    res.json({
                        success: false,
                        message: "Category not available to delete",
                    });
                }
            }
            else {
                res.json({
                    success: false,
                    message: "Category went wrong",
                });
            }

        });

    }
    catch (error) {
        console.log(error);
    }
})

module.exports = router;