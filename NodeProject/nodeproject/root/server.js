const express = require("express");
const app = express();
const port = 3030;
const mysql = require("mysql");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require('multer')
    // const upload = multer({ dest: 'uploads/' })
const path = require('path')


dotenv.config();
// console.log("config", process.env);

app.use(cors());

app.get("/", (req, res) => {
    res.send({ Home: "Welcome Home Page!" });
});

app.listen(port, () => {
    console.log(`server is listening on port : ${port}`);
});

// Connect to db

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "testdb",
});

connection.connect((err) => {
    if (err) {
        console.log("error", err);
    }
    console.log("Connection successful");
});

//Post Request for signup

const jsonparser = bodyparser.json();

app.post("/signup", jsonparser, (req, res) => {
    // res.send("Request Posted!");

    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };
    connection.query(`SELECT email FROM users WHERE email='${user.email}'`,
        (err, result) => {
            if (err) {
                res.send(err)
            } else {
                // console.log(result);
                if (result.length) {
                    res.status(409).send("Email already registred! Please Log In!")
                } else {

                    bcrypt.hash(user.password, 10, (err, hash) => {
                        connection.query(
                            `INSERT INTO users(name, email, password) VALUES ('${user.name}','${user.email}','${hash}')`
                        );
                        if (err) {
                            console.log("Hash Error", err);
                        }
                        console.log("User added!");
                        res.status(201).send("User added!");
                    });
                }
            }
        })

});

//Generating Access Token

function createAccessToken(user) {
    // console.log(process.env.TOKEN_SECRET);
    return jwt.sign({ email: user.email, id: user.id },
        process.env.TOKEN_SECRET, {
            expiresIn: 3000,
        }
    );
}

//POST Request for LogIn

app.post("/login", jsonparser, (req, res) => {
    const userInput = {
        email: req.body.email,
        password: req.body.password,
    };
    // console.log("user login mail", userInput.email, userInput.password);

    connection.query(
        `SELECT * FROM users where email = '${userInput.email}' limit 1`,
        (err, resp) => {
            if (err) {
                res.status(401).send(err);
            }

            if (resp.length) {
                const user = resp[0];
                // console.log(resp[0]);

                bcrypt.compare(userInput.password, user.password, (err, result) => {
                    if (result) {
                        // res.status(200).send(result);
                        const token = createAccessToken(user);
                        res.json({ token: token });
                    } else {
                        res.status(200).send(result);
                    }
                });
            } else {
                res.status(401).send("Unauthorised User!");
            }
        }
    );
});

//Middleware
const auth_token = (req, res, next) => {
    const header = req.headers["authorization"];
    // console.log(header);
    const token = header && header.split(" ")[1];
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token!" });
    }
    try {
        const decodedtoken = jwt.decode(token);
        req.Useremail = decodedtoken.email;
        req.Userid = decodedtoken.id;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token!" });
    }
};

// GET Request

app.get("/me", auth_token, (req, res) => {
    // const header = req.headers["authorization"];
    // const token = header && header.split(" ")[1];
    // const DecodedToken = jwt.decode(token);
    connection.query(
        `SELECT id, name, email FROM users WHERE email= '${req.Useremail}' `,
        (err, resp) => {
            if (err) {
                res.send(err);
            } else {
                res.send(resp[0]);
            }
        }
    );
});

// Specific User's Posts by their Id

app.get("/me/:id", auth_token, (req, res) => {
    let id = req.params.id;
    connection.query(
        `SELECT  users.id, users.name, posts.image, posts.id, posts.title, posts.description, posts.slug, posts.author_id, posts.created_at, posts.updated_at FROM users INNER JOIN posts ON users.id = posts.author_id WHERE posts.author_id = '${id}' AND users.email = '${req.Useremail}' ORDER BY created_at DESC`,
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

// All users

app.get("/user", (req, res) => {
    connection.query(`SELECT * FROM users`, (err, resp) => {
        if (err) {
            resp.send("Error", err);
        } else {
            res.send(resp);
        }
    });
});

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname)
    }
})

const uploads = multer({ storage: storage })

//Serve images

app.use(express.static(path.join(__dirname, 'uploads')))

// Adding Posts

app.post("/posts", jsonparser, uploads.single('image'), auth_token, (req, res) => {
    // console.log(req, "uploads function");
    const postdata = {
        title: req.body.title,
        description: req.body.description,
        author_id: req.Userid,
        image: req.file.originalname
    };
    // return res.status(201).send(postdata);

    var SlugCount = 0;
    const slug = postdata.title
        .toLowerCase()
        .split(/[ ]+/)
        .join(" ")
        .replaceAll(" ", "-");
    connection.query(
        `SELECT COUNT(slug) AS slugcount FROM posts WHERE (slug) LIKE '%${slug}%'`,
        (err, rows) => {
            if (err) {
                throw err;
            }
            SlugCount = rows[0].slugcount;
            console.log("Rows", SlugCount);
            // return SlugCount;
            console.log(SlugCount, "slugcount");
            if (SlugCount > 0) {
                // console.log("hggh");
                connection.query(
                    `INSERT INTO posts(title, description, slug, author_id, image) VALUES ('${
            postdata.title
          }', '${postdata.description}', '${slug + "-" + SlugCount}', '${
            postdata.author_id
          }', '${postdata.image}')`,
                    (err) => {
                        if (err) {
                            return res.status(400).send(err);
                        }
                        // console.log("else status", result);
                        return res.status(201).send("Post Added");
                    }
                );
            } else {
                // console.log("bye");
                connection.query(
                    `INSERT INTO posts(title, description, slug, author_id, image) VALUES ('${postdata.title}', '${postdata.description}', '${slug}', '${postdata.author_id}', '${postdata.image}')`,
                    (err) => {
                        if (err) {
                            return res.status(400).send(err, "Error!");
                        }
                        // console.log("else status", result);
                        return res.status(201).send("Post Added");
                    }
                );
            }
        }
    );
});

//All Posts

app.get("/posts", (req, res) => {
    connection.query(
        `SELECT * FROM posts ORDER BY created_at DESC`,
        (err, resp) => {
            if (err) {
                res.send(resp);
            } else {
                res.send(resp);
            }
        }
    );
});

// Single Post find through the slug

app.get("/posts/:slug", (req, res) => {
    let slug = req.params.slug;
    // console.log(slug, "slug");
    connection.query(
        `SELECT posts.id, users.name, posts.title, posts.description, posts.created_at, posts.updated_at, posts.author_id, posts.image FROM users INNER JOIN posts ON users.id = posts.author_id WHERE posts.slug = '${slug}'`,
        (err, resp) => {
            if (err) {
                res.send(err);
            } else {
                // console.log(resp);
                res.send(resp);
            }
        }
    );
});

// Delete Post using Post_id

app.delete("/posts/:id", auth_token, (req, res) => {
    let id = req.params.id;
    // console.log(id);
    connection.query(
        `DELETE posts FROM users INNER JOIN posts WHERE posts.id = '${id}' AND posts.author_id = '${req.Userid}'`,
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Update Post using Post_id

app.put("/posts/:id", jsonparser, uploads.single('image'), auth_token, (req, res) => {
    const updatedData = {
        title: req.body.title,
        description: req.body.description,
        image: req.file.originalname,
        updatedAt: new Date(),
    };
    let id = req.params.id;
    let idCount = 0;
    connection.query(
        `SELECT COUNT(id) AS Id_Count FROM posts WHERE posts.id = '${id}' AND posts.author_id = '${req.Userid}'`,
        (err, rows) => {
            if (err) {
                throw err;
            }
            idCount = rows[0].Id_Count;
            if (idCount) {
                connection.query(
                    `UPDATE posts SET title = '${updatedData.title}', description = '${updatedData.description}',image = '${updatedData.image}', updated_at = NOW() WHERE posts.id= '${id}' AND posts.author_id = '${req.Userid}'`,
                    (err, result) => {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send(result);
                            // console.log(result);
                        }
                    }
                );
            } else {
                res.status(401).send("Wrong credentials!");
            }
        }
    );
});

//comments

// Comments on a Post

app.post("/comments/:id", jsonparser, auth_token, (req, res) => {
    const commentData = {
        comment: req.body.comment,
        username: req.body.username,
    };
    let post_id = req.params.id;
    connection.query(
        `INSERT INTO comments(comments, post_id, user_name, user_id) VALUES ('${commentData.comment}', '${post_id}', '${commentData.username}','${req.Userid}')`,
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Get comments

//Get commments by post ID(comments on posts)
app.get("/comments/:id", (req, res) => {
    let postid = req.params.id;
    connection.query(
        `SELECT comments.id, comments.user_name, users.name, comments.user_id, comments.comments, comments.commentAt FROM users RIGHT JOIN posts ON users.id= posts.author_id RIGHT JOIN comments ON posts.id = comments.post_id WHERE posts.author_id=users.id AND comments.post_id='${postid} AND users.id = comments.user_id'`,
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

//Get commnet by comment ID

app.get("/commentsbyid/:id", (req, res) => {
    let commentid = req.params.id;
    connection.query(
        `SELECT  comments.id,comments.comments FROM comments WHERE comments.id= '${commentid}'`,
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

//Update Comments by using Comment_ID

app.put("/comments/:id", auth_token, jsonparser, (req, res) => {
    let comment_id = req.params.id
    let updated_comment = req.body.updatedcomment -

        connection.query(`UPDATE comments SET comments.comments = '${updated_comment}', comments.UpdatedAt = NOW() WHERE comments.id = '${comment_id}' AND comments.user_id = '${req.Userid}'`,
            (err, result) => {
                if (err) {
                    res.send(err)
                } else {
                    res.send(result)
                }
            })
})

// Delete comment using Comment Id

app.delete("/comments/:id", auth_token, (req, res) => {
    let comment_id = req.params.id;
    // console.log(comment_id, "comment id and ", req.Userid, "user id");
    connection.query(`DELETE comments FROM comments LEFT JOIN posts ON comments.post_id = posts.id LEFT JOIN users ON posts.author_id = users.id WHERE comments.id = '${comment_id}' AND (posts.author_id = '${req.Userid}' OR comments.user_id = '${req.Userid}')`,
        (err, result) => {
            if (err) {
                res.send(err)
            } else {
                res.send(result)
            }
        }
    )
})