import express from "express";
import { JWT_SECRET_KEY } from "@repo/backend-common/config";
import { middleware } from "./auth/middleware";
import {
  CreateUserSchema,
  SignInSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    console.log(parsedData.error);
    return res.json({
      message: "Incorrect Input",
    });
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: parsedData.data?.email,
        password: parsedData.data?.password,
        name: parsedData.data?.name,
      },
    });
    console.log("User created:", user.id);
    res.json({
      userId: user.id,
    });
  } catch (error: any) {
    console.error("Signup error:", error);

    // Check if it's a unique constraint violation (duplicate email)
    if (error.code === 'P2002') {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    // Database connection or other errors
    res.status(500).json({
      message: "Error creating user. Please check database connection.",
      error: error.message,
    });
  }
});

app.post("/signin", (req, res) => {
  const data = SignInSchema.safeParse(req.body);

  if (!data.success) {
    return res.json({
      message: "Incorrect Input",
    });
  }
  const userId = 1;
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET_KEY
  );

  res.json({
    token,
  });
});

app.post("/room/:id", middleware, (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);

  if (!data.success) {
    return res.json({
      message: "Incorrect Input",
    });
  }
  res.json({
    roomId: 123,
  });
});

app.listen(3001);
