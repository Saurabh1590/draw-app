import express from "express";
import { JWT_SECRET_KEY } from "./config";
import { middleware } from "./auth/middleware";
const jwt = require("jsonwebtoken");



const app = express();

app.post("/signup", (req, res) => {
    const {firstName, lastName, password, emailId} = req.body;

    res.json({
        userId: "123"
    })

})

app.post("/signin", (req, res) => {
    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET_KEY)

    res.json({
        token
    })
})

app.post("/room/:id", middleware, (req, res) => {
    res.json({
        roomId: 123
    })
})

app.listen(3001);