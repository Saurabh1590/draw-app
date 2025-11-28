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
import bcrypt from "bcrypt";

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
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(parsedData.data?.password || "", 10);

    const user = await prisma.user.create({
      data: {
        email: parsedData.data?.email,
        password: hashedPassword,
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

app.post("/signin", async (req, res) => {
  const parsedData = SignInSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.json({
      message: "Incorrect Input",
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: parsedData.data?.email,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const token = jwt.sign(
      {
        userId: existingUser.id,
      },
      JWT_SECRET_KEY
    );

    res.json({
      token,
    });
  } catch (error: any) {
    console.error("Signin error:", error);
    res.status(500).json({
      message: "Error signing in. Please try again.",
      error: error.message,
    });
  }
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
