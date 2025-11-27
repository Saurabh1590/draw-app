import express from "express";
import { JWT_SECRET_KEY } from "@repo/backend-common/config";
import { middleware } from "./auth/middleware";
import {CreateUserSchema, SignInSchema, CreateRoomSchema} from "@repo/common/types";

const jwt = require("jsonwebtoken");



const app = express();

app.post("/signup", (req, res) => {
    const data = CreateUserSchema.safeParse(req.body);

    if(!data.success) {
        return res.json({
            message: "Incorrect Input"
        })
    }

    res.json({
        userId: "123"
    })

})

app.post("/signin", (req, res) => {

    const data = SignInSchema.safeParse(req.body);

    if(!data.success) {
        return res.json({
            message: "Incorrect Input"
        })
    }
    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET_KEY)

    res.json({
        token
    })
})

app.post("/room/:id", middleware, (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);

    if(!data.success) {
        return res.json({
            message: "Incorrect Input"
        })
    }
    res.json({
        roomId: 123
    })
})

app.listen(3001);