var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const saltRound = 10;

const jwt = require('jsonwebtoken');


router.post('/register', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, saltRound, (err, hash) => {
        if (err) {
            console.log(err);
        }
        pool.query("insert into users (username,password) values(?,?)", [username, hash], function (error, result) {
            if (error) {
                console.log(error);
                res.status(200).json({ status: false, result: 'Registration Failed' });
            }
            else {
                res.status(200).json({ status: true, result: 'Successfully Register' });
            }
        })
    })
})

router.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    pool.query("select * from users where username=?", [username], function (err, result) {
        if (err) {
            console.log(err);
            res.json({ auth: false, message: "Server Error" });  
        }

        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (error, response) => {
                if (response) {
                    const id = result[0].id;
                    console.log(id);
                    const token = jwt.sign({ id }, "jwtSecert", {
                        expiresIn: '1h',
                    });

                    res.json({ auth: true, token: token, result: result });
                }
                else{
                    res.json({ auth: false, message: "Wrong Username Password" }); 
                }
            })
        }
        else{
            res.json({ auth: false, message: "No User exits" });  
        }
    })
})

module.exports = router