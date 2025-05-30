import prisma from "../lib/prisma.js"


export const getChats= async (req, res)=>{
    const tokenUserId = req.userId
    try{
        const chats = await prisma.chat.findMany({
            where:{
                userIDs:{
                    hasSome:[tokenUserId],
                }
            }
        })

        for (const chat of chats){
            const receiverId = chat.userIDs.find(id=> id!==tokenUserId)
            const receiver = await prisma.user.findUnique({
                where:{
                    id:receiverId,
                },
                select:{
                    id:true,
                    username:true,
                    avatar:true,
                }
            })
            chat.receiver = receiver
        }

        res.status(200).json(chats)
    }
    catch(err){
        console.log(err)
        req.status(500).json({message:"Failed to Get Chats"})
    }
}

export const getChat= async (req, res)=>{
    const tokenUserId = req.userId
    try{
        const chat = await prisma.chat.findUnique({
            where:{
                id:req.params.id,
                userIDs:{
                    hasSome:[tokenUserId],
                }
            },
            include:{
                messages:{
                    orderBy:{
                        createdAt:"asc",
                    }
                }
            }
        })

        await prisma.chat.update({
            where:{
                id:req.params.id
            },
            data:{
                seenBy:{
                    push:[tokenUserId]
                }
            }
        })
        res.status(200).json(chat)
    }
    catch(err){
        console.log(err)
        req.status(500).json({message:"Failed to Get Chats"})
    }
}

export const addChat= async (req, res)=>{
    const tokenUserId = req.userId
    try{
        const present = await prisma.chat.findMany({
            where:{
                userIDs:{
                    hasSome:[req.body.receiverId],
                }
            }
        })
    if(present.length == 0 || present.userIDs[0] !== tokenUserId){
        const newChat = await prisma.chat.create({
            data:{
                userIDs: [tokenUserId, req.body.receiverId]
            }
        })
        res.status(200).json(newChat)
    }
    }
    catch(err){
        console.log(err)
        req.status(500).json({message:"Failed to Get Chats"})
    }
}

export const readChat= async (req, res)=>{
    const tokenUserId = req.userId
    try{
        const chat = await prisma.chat.update({
            where:{
                id:req.params.id,
                userIDs:{
                    hasSome:[tokenUserId]
                }
            },
            data:{
                seenBy:{
                    push:[tokenUserId]
                }
            }
        })
        res.status(200).json(users)
    }
    catch(err){
        console.log(err)
        req.status(500).json({message:"Failed to Get Chats"})
    }
}