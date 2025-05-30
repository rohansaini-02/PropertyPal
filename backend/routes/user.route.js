import express from "express";
import { getUser, getUsers, updateUser, deleteUser, savePost, profilePosts, getNotificationNumber } from "../controllers/user.controllers.js";
import {verifyToken} from '../middleware/verifyToken.js'

const router=express.Router();

router.get('/',getUsers);
// router.get('/:id',verifyToken,getUser);
router.put('/:id',verifyToken,updateUser);
router.delete('/:id',verifyToken,deleteUser);
router.post('/save',verifyToken,savePost);
router.get('/profilePosts/:id',verifyToken,profilePosts);
router.get('/notification',verifyToken,getNotificationNumber);


export default router;