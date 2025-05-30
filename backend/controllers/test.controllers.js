import jwt from 'jsonwebtoken'

// Simple route to confirm user is logged in
export const shouldBeLoggedIn = async (req, res) => {
    console.log(req.userId)
    res.status(200).json({ message: "You are Authenticated!" })
}

// Middleware to check if user is authenticated by verifying token
export const shouldBeAuthenticated = (req, res) => {
    const token = req.cookies.token

    // If no token, user is not authenticated
    if (!token) return res.status(401).json({ message: 'Not Authenticated!' })

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err) {
            // Token invalid or expired
            return res.status(403).json({ message: 'Token is not valid' })
        }

        // Token is valid, user is authenticated
        res.status(200).json({ message: "You are Authenticated!" })
    })
}
