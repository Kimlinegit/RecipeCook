import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();


const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if(!token) {
            res.status(401).json({message: `Invalid authentication!`});
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
            if(err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: "Unauthorized. Token has expired." });
                } else {
                    return res.status(401).json({ message: "Unauthorized. Invalid token." });
                }
            }
            req.user = user;
            return next();
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export default auth;