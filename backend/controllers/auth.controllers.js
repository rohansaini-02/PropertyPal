import bcrypt from "bcrypt"; // used to hash passwords securely
import jwt from "jsonwebtoken"; // used to create login tokens
import prisma from "../lib/prisma.js"; // handles DB operations (Prisma ORM)

// REGISTER A NEW USER
export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Step 1: Hash the plain password before saving it — never store raw passwords!
        const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds
        console.log("Hashed Password:", hashedPassword);

        // Step 2: Save the new user to the database with the hashed password
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        console.log("New User Created:", newUser);

        // Step 3: Send success response
        res.status(201).json({ message: "User created successfully" });

    } catch (err) {
        console.error("Error during user registration:", err);
        res.status(500).json({ messsage: "Failed to create user" }); // (typo: "messsage" can be fixed)
    }
};


// LOGIN EXISTING USER
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Step 1: Check if the user exists in the DB
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials!" });
        }

        // Step 2: Compare the entered password with the hashed password in DB
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials!" });
        }

        // Step 3: Generate a JWT token (valid for 7 days)
        const age = 1000 * 60 * 60 * 24 * 7; // 7 days in ms

        const token = jwt.sign(
            {
                id: user.id,
                isAdmin: false, // You can update this logic if you add user roles
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: age }
        );

        // Step 4: Send the token as an HTTP-only cookie (to prevent JS access)
        const { password: userPassword, ...userInfo } = user; // remove password before sending user info

        res.cookie("token", token, {
            httpOnly: true,
            // secure: true, // uncomment in production for HTTPS-only cookies
            maxAge: age,
        }).status(200).json(userInfo);

    } catch (err) {
        console.error("Login failed:", err);
        res.status(500).json({ message: "Failed to Login!" });
    }
};


// LOGOUT USER
export const logout = (req, res) => {
    // Clear the cookie from the browser
    res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
