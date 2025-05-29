import prisma from "../lib/prisma.js";

// Fetch all chats that include the currently logged-in user
export const getChats = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        // Find all chat records where this user's ID is one of the participants
        const chats = await prisma.chat.findMany({
            where: {
                userIDs: {
                    hasSome: [tokenUserId],
                },
            },
        });

        // For each chat, find and attach the other user's basic info
        for (const chat of chats) {
            const receiverId = chat.userIDs.find(id => id !== tokenUserId);

            const receiver = await prisma.user.findUnique({
                where: { id: receiverId },
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            });

            // Add receiver info directly to the chat object
            chat.receiver = receiver;
        }

        res.status(200).json(chats);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get chats" });
    }
};

// Fetch a single chat and its messages for the current user
export const getChat = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        // Find the specific chat if the user is one of the participants
        const chat = await prisma.chat.findUnique({
            where: {
                id: req.params.id,
                userIDs: {
                    hasSome: [tokenUserId],
                },
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc", // sort messages from oldest to newest
                    },
                },
            },
        });

        // Mark this chat as seen by the current user
        await prisma.chat.update({
            where: { id: req.params.id },
            data: {
                seenBy: {
                    push: [tokenUserId],
                },
            },
        });

        res.status(200).json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get chat" });
    }
};

// Create a new chat if one doesn't already exist between the two users
export const addChat = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        // Check if a chat already exists with the receiver
        const present = await prisma.chat.findMany({
            where: {
                userIDs: {
                    hasSome: [req.body.receiverId],
                },
            },
        });

        // If no chat exists, or the current user isn't part of it, create a new one
        if (present.length === 0 || !present[0].userIDs.includes(tokenUserId)) {
            const newChat = await prisma.chat.create({
                data: {
                    userIDs: [tokenUserId, req.body.receiverId],
                },
            });

            return res.status(200).json(newChat);
        }

        // If chat already exists, return that info
        res.status(200).json({ message: "Chat already exists" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create chat" });
    }
};

// Mark a specific chat as read by the current user
export const readChat = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const chat = await prisma.chat.update({
            where: {
                id: req.params.id,
                userIDs: {
                    hasSome: [tokenUserId],
                },
            },
            data: {
                seenBy: {
                    push: [tokenUserId],
                },
            },
        });

        res.status(200).json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to mark chat as read" });
    }
};
