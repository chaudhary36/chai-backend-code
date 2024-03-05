import { Router } from "express";
import {
    ChangeUserPassword, 
    UpdateUserCoverImage, 
    UserWatchHistory, 
    findUserChannel, 
    getCurrentUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateUserAvatar, 
    updateUserDetails
} from "../controller/user.controller.js"
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/authoriz.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)
// for logout 

router.route("/logout").post(verifyJWT , logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT , ChangeUserPassword)
router.route("/get-user").get(verifyJWT , getCurrentUser)
router.route("/update-details").patch(verifyJWT , updateUserDetails)

router.route("/avatar").patch(verifyJWT , upload.single("avatar") , updateUserAvatar)

router.route("/cover-image").patch(verifyJWT , upload.single("coverImage") , UpdateUserCoverImage)

router.route("/channel/:username").get(verifyJWT , findUserChannel)

router.route("/history").get(verifyJWT , UserWatchHistory)

export default router;