import prisma from "../lib/prisma.js"

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId        // ID of the logged-in user sending the message
  const chatId = req.params.chatId      // Chat ID from the URL parameters
  const text = req.body.text             // Message text from the request body

  try {
    // First, find the chat by ID
    const chat = await prisma.chat.findUnique({
      where: { id: chatId }
    })

    // Check if chat exists and that the user is part of this chat (userIDs contains tokenUserId)
    if (!chat || !chat.userIDs.includes(tokenUserId)) {
      // If no chat found or user not in chat, return 404 error
      return res.status(404).json({ message: "Chat not found or access denied" })
    }

    // Create a new message linked to this chat and user
    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      }
    })

    // Update the chat: mark the message as seen by sender and update lastMessage text
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        seenBy: [tokenUserId],    // Mark that the sender has seen the last message
        lastMessage: text,
      }
    })

    // Respond with the created message
    res.status(200).json(message)

  } catch (err) {
    console.log(err)
    // Return 500 error on any unexpected failure
    res.status(500).json({ message: "Failed to add message" })
  }
}
