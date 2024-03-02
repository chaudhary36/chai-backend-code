import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "")
    
        if(!token){
            throw new ApiError(400, "Unauthorized Request to get token")
        }
    
        const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedInfo._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(400 , "Invalid Token Access!")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, "Gadbad in the authoriz middlewre")
    }

})