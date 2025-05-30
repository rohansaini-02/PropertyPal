import prisma from '../lib/prisma.js'
import jwt from 'jsonwebtoken'

// Fetch multiple posts based on optional filters from query parameters
export const getPosts = async (req, res) => {
    const query = req.query
    try {
        // Fetch posts with filters if provided (city, type, property, bedroom, price range)
        // If filters are missing, ignore those conditions (use undefined)
        const posts = await prisma.post.findMany({
            where: {
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                // Only parse bedroom if provided, else ignore filter
                bedroom: query.bedroom ? parseInt(query.bedroom) : undefined,
                price: {
                    // Set price filters with default min 0 and max 1,000,000 if not provided
                    gte: query.minPrice ? parseInt(query.minPrice) : 0,
                    lte: query.maxPrice ? parseInt(query.maxPrice) : 1000000,
                }
            },
            include: {
                // Include savedPosts to check which users have saved these posts
                savedPosts: {
                    select: {
                        userId: true
                    }
                }
            }
        })
        // Send the list of posts back to the client
        res.status(200).json(posts)
    } catch (err) {
        console.log(err)
        // If something goes wrong, respond with 500 status and error message
        res.status(500).json({ message: "failed to get posts" })
    }
}

// Fetch a single post by its ID, including details and user info
export const getPost = async (req, res) => {
    const id = req.params.id;
    try {
        // Find the post with the given ID, also fetch post details and user info (username, avatar)
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true
                    }
                },
                savedPosts: {
                    select: {
                        userId: true,
                    }
                }
            }
        });

        // Check if the request has a token cookie to identify logged-in user
        const token = req.cookies?.token;

        if (token) {
            // Verify the token to get user info
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
                if (!err) {
                    // Check if the logged-in user has saved this post before
                    const saved = await prisma.savedPost.findUnique({
                        where: {
                            userId_postId: {
                                postId: id,
                                userId: payload.id,
                            },
                        },
                    });
                    // Send the post data with an isSaved flag
                    return res.status(200).json({ ...post, isSaved: !!saved });
                } else {
                    // If token invalid, send post data with isSaved = false
                    return res.status(200).json({ ...post, isSaved: false });
                }
            });
        } else {
            // If no token, just send post data with isSaved = false
            return res.status(200).json({ ...post, isSaved: false });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get posts" });
    }
}

// Add a new post linked to the logged-in user
export const addPost = async (req, res) => {
    const body = req.body
    const tokenUserId = req.userId
    try {
        console.log(tokenUserId)
        // Create a new post with the data from request body
        // Connect it to the user using userId extracted from token
        // Also create postDetail as a nested record
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetail: {
                    create: body.postDetail,
                }
            }
        })
        console.log(newPost)
        // Respond with the created post data
        res.status(200).json(newPost)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "failed to get posts" })
    }
}

// Placeholder for update post - implementation needed
export const updatePost = async (req, res) => {
    try {
        // Logic to update the post will go here
        res.status(200).json()
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "failed to get posts" })
    }
}

// Delete a post if the logged-in user owns it
export const deletePost = async (req, res) => {
    const id = req.params.id
    const tokenUserId = req.userId
    try {
        // First, find the post by id
        const post = await prisma.post.findUnique({
            where: { id }
        })

        // If post doesn't exist, return 404
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        // Check if the logged-in user is the owner of the post
        if (post.userId !== tokenUserId) {
            // If not, deny access with 403 Forbidden
            return res.status(403).json({ message: "Not Authorized" })
        }

        // If authorized, delete the post
        await prisma.post.delete({
            where: { id }
        })

        // Confirm deletion
        res.status(200).json({ message: "Post Deleted" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "failed to get posts" })
    }
}
