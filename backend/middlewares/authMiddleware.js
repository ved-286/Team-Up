import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

 export const protect = (req, res, next) => {

    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token){
        return res.status(401).json({message: "Not authorized, no token"});
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }catch (error) {
        console.error("JWT verification error:", error);
        return res.status(401).json({message: "Not authorized, token failed"});

    }
}

