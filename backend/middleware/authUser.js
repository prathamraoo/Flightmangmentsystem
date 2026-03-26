import jwt from 'jsonwebtoken'
const SECRETKEY= 'MysecretKey'

const authUser = async(req, res, next) =>{
    try {
        // Get token from Authorization header (Bearer token) or auth-token header
        let token = req.header("auth-token")
        
        // If no auth-token, check Authorization header
        if (!token) {
            const authHeader = req.header("Authorization")
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7) // Remove "Bearer " prefix
            }
        }
        
        if(!token){
            return res.status(401).json({
                success: false,
                message:"Access denied. No token provided."
            })
        }

        const decoded = jwt.verify(token, SECRETKEY)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message:"Invalid token"
        })
    }
}

export default authUser