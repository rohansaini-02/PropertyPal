import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

// Fetch all users from the database
export const getUsers = async (req, res) => {
    console.log("it works");
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get users" });
    }
};

// Fetch a single user by ID
export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get user" });
    }
};

// Update user profile info (only if the user is updating their own account)
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { password, avatar, ...inputs } = req.body;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "Not authorized" });
    }

    let updatedPassword = null;

    try {
        if (password) {
            updatedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...inputs,
                ...(updatedPassword && { password: updatedPassword }),
                ...(avatar && { avatar }),
            },
        });

        // Don't expose the password in the response
        const { password: _, ...rest } = updatedUser;
        res.status(200).json(rest);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to update user" });
    }
};

// Delete user account (only by the owner)
export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "Not authorized" });
    }

    try {
        await prisma.user.delete({ where: { id } });
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete user" });
    }
};

// Toggle post saved/unsaved by the current user
export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;

    try {
        const savedPost = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId: tokenUserId,
                    postId,
                },
            },
        });

        if (savedPost) {
            // If already saved, unsave it
            await prisma.savedPost.delete({ where: { id: savedPost.id } });
            return res.status(200).json({ message: "Post unsaved" });
        } else {
            // Otherwise, save it
            await prisma.savedPost.create({
                data: {
                    userId: tokenUserId,
                    postId,
                },
            });
            return res.status(200).json({ message: "Post saved" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to toggle saved post" });
    }
};

// Get all posts by user + all posts they have saved
export const profilePosts = async (req, res) => {
    const tokenUserId = req.params.id;

    try {
        // Fetch user's own posts (also checking who saved them)
        const userPosts = await prisma.post.findMany({
            where: { userId: tokenUserId },
            include: {
                savedPosts: {
                    select: { userId: true },
                },
            },
        });

        // Fetch posts saved by this user
        const saved = await prisma.savedPost.findMany({
            where: { userId: tokenUserId },
            include: {
                post: true,
            },
        });

        // Format saved posts to match structure
        const savedPosts = saved.map(item => ({
            ...item.post,
            savedPosts: [{ userId: item.userId }],
        }));

        res.status(200).json({ userPosts, savedPosts });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get profile posts" });
    }
};

// Count unread chats for the current user
export const getNotificationNumber = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const number = await prisma.chat.count({
            where: {
                userIDs: {
                    hasSome: [tokenUserId],
                },
                NOT: {
                    seenBy: {
                        hasSome: [tokenUserId],
                    },
                },
            },
        });

        res.status(200).json(number);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get notifications" });
    }
};
