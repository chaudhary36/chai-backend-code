import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { response } from "express";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;
  // console.log("Email: ", email);

  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "This user is already existed ");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is needed!");
  } 

  // let upload the avatar and the coverImage on the cloudinary by the method which we had alreay created !! first import then use ..

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImageUploaded = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required hai!" );
  } 

  const user = await User.create({
    username: username.toLowerCase(),
    avatar: avatar.url,
    fullName,
    email,
    password,
    coverImage: coverImageUploaded?.url || "",
  });

  if(user){
    console.log("Done User is created !");
  }

  const createdUser = await User.findOne(user._id)
    .select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something Went Wrong! While Registring the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, "User is Registered Successfully!", createdUser)
    );
});

export { registerUser };
