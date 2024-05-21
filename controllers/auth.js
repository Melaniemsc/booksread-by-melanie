const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/user.js")

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs", {user:req.session.user});
})

router.get("/sign-in", (req,res) =>{
    res.render("auth/sign-in.ejs", {user:req.session.user})
})

router.get("/sign-out",(req,res) =>{
    req.session.destroy(() =>{
    res.redirect("/",)
    })
})

router.post("/sign-up", async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
        return res.send("Username already taken.");
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password and Confirm Password must match");
    }
    if (req.body.password === "") {
        return res.send("You need to provide a password")
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;


    const user = await User.create(req.body);
    req.session.user = {
        username:user.username
    }
    req.session.save(()=>{
        res.redirect("/")
    })

})


router.post("/sign-in", async (req,res) =>{
    const userInDatabase = await User.findOne({ username: req.body.username });
    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password)
    
    if (!userInDatabase || !validPassword) {
        return res.send("Login failed. Please try again");
    }
    req.session.user = {
        username:userInDatabase.username,
    }
    req.session.save(() =>{
        res.redirect("/")
    })
})

module.exports = router