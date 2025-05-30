import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt"

export const getUsers = async (req, res)=>{
    console.log('it works')
    try{
        const users = await prisma.user.findMany();
        res.status(200).json(users)
    }
    catch(err){
        console.log(err)
        req.status(500).json({message:"Failed to Get Users"})
    }
}

export const getUser = async (req, res)=>{
    const id = req.params.id;
    try{
        const user = await prisma.user.findUnique({
            where:{ id },
    });
        res.status(200).json(user)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to Get Users"})
    }
}

export const updateUser = async (req, res)=>{
    const id = req.params.id;
    const TokenUserId = req.userId;
    const {password, avatar , ...inputs} = req.body
    if(id !== TokenUserId){
        res.status(403).json({mesage:"Not Authorized"})
    }
    let updatedPassword = null
    try{
        if(password){
            updatedPassword = await bcrypt.hash(password,10)
        }

        const updatedUser = await prisma.user.update({
            where:{ id },
            data: {
                ...inputs,
                ...(updatedPassword && {password: updatedPassword}),
                ...(avatar && {avatar})
            },
        })

        const {password: userPassword,...rest} = updatedUser
        res.status(200).json(rest)

    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to Get Users"})
    }
}

export const deleteUser = async (req, res)=>{
    const id = req.params.id;
    const TokenUserId = req.userId;

    if(id !== TokenUserId){
        res.status(403).json({mesage:"Not Authorized"})
    }
    try{

        await prisma.user.delete({
            where:{ id }
        })
        res.status(200).json({message:"User Deleted"})
    }
    catch(err){
        console.log(err)
        req.status(500).json({message:"Failed to Get Users"})
    }
}

export const savePost = async (req, res)=>{
    const postId = req.body.postId;
    const tokenUserId = req.userId;
    console.log(tokenUserId)
    console.log(postId)

    try{

        const savedPost = await prisma.savedPost.findUnique({
            where:{ 
              userId_postId: {
                userId: tokenUserId,
                postId,
              },
             }
        })

        if(savedPost){
            console.log("saved")
            await prisma.savedPost.delete({
                where:{
                    id:savedPost.id,
                }
            })
            res.status(200).json({message:"Post saved"})
        }
        
        else{
            console.log("notSave")
            await prisma.savedPost.create({
                data:{
                    userId:tokenUserId,
                    postId, 
                }
            })
            res.status(200).json({ message: "Post saved" });
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to Get Users"})
    }
}

export const profilePosts = async (req, res)=>{
    const tokenUserId = req.params.id;
    console.log(req.body)
    console.log(tokenUserId)
    try{
        const userPosts = await prisma.post.findMany({
            where:{ userId: tokenUserId },
            include:{
                savedPosts: {
                    select:{
                        userId: true
                    }
                }
            }
    });
        const saved = await prisma.savedPost.findMany({
            where:{ userId: tokenUserId },
            include:{
                post: true,
            }
    });
    const savedPosts = saved.map(item => ({
      ...item.post,
      savedPosts: [{userId:item.userId}]
  }));

        res.status(200).json({userPosts, savedPosts})
    }
    catch(err){
        console.log(err)
        req.status(500).json({message:"Failed to Get Profile Posts"})
    }
}


export const getNotificationNumber = async (req, res)=>{
    const tokenUserId = req.userId;
    console.log(req)
    try{
        const number = await prisma.chat.count({
            where:{
                userIDs:{
                    hasSome:[tokenUserId],
                },
                NOT:{
                    seenBy:{
                        hasSome: [tokenUserId]
                    }
                }
            }
        })
        res.status(200).json(number)
    }
    catch(err){
        console.log(err)
        req.status(500).json({message:"Failed to Get Profile Posts"})
    }
}