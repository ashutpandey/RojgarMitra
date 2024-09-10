import jwt from "jsonwebtoken";

// Middleware to extract user information from the cookie
export const extractUserFromToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.user = null; // No token, no user information
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            req.user = null; // Invalid token, no user information
        } else {
            req.user = decoded; // Set user information from the decoded token
        }

        next();
    });
};


