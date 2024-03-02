import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generatorAccessAndRefreshToken = async(userId)=>{
  try {
    const user = await User.findById(userId)
  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

   User.refreshToken = refreshToken
   await user.save({validateBeforeSave: false})

   return {accessToken, refreshToken}
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh token")
  }

}


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

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is needed!");
  }

  // let upload the avatar and the coverImage on the cloudinary by the method which we had alreay created !! first import then use ..

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImageUploaded = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required hai!");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    avatar: avatar.url,
    fullName,
    email,
    password,
    coverImage: coverImageUploaded?.url || "",
  });

  if (user) {
    console.log("Done User is created !");
  }

  const createdUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something Went Wrong! While Registring the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, "User is Registered Successfully!", createdUser)
    );
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { email , username, password} = req.body;
  

  if((!username && !email)){
    throw new ApiError("401", "Enter email and password!")
  }

  const user = await User.findOne({
    $or: [{username} , {email}]
  })


  if(!user){
    throw new ApiError("404" , "The user is already exists in db")
  } else {
    // new ApiResponse(201, "User is founded Successfully!")
    console.log("User is founded Successfully! " , user);
  }

  const passwordValidation = await user.isPasswordCorrect(password)
  if(!passwordValidation){
    throw new ApiError(401 , "Error with password")
  }
  const {accessToken, refreshToken} = await generatorAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken , options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(201, 
      {
      user: loggedInUser, accessToken, refreshToken
  },
  )
  )

});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
      {
        $set: {
        refreshToken: undefined
        },
     },
     {
      new: true
    }

    
  )
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  
  if(!incomingRefreshToken){
    throw new ApiError("404" , "Unauthorized Refresh Token")
  }

  // let verify the token first 

  try {
    const decodedTokenInfo = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
  
      const user = await User.findById(decodedTokenInfo._id)
  
      if(!user){
        throw new ApiError(404, "User is not found while refreshing the access Token!")
      }
    
      if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401 , "Refresh token is expired or used!")
      }
  
      const options = {
        httpOnly: true,
        secure: true
      }
  
      const {accessToken , newRefreshToken} = await generatorAccessAndRefreshToken(user._id)
  
      return res
      .status(200)
      .cookie("accessToken" , accessToken , options)
      .cookie("refreshToken" , newRefreshToken , options)
      .json(
        200,
        {accessToken, newRefreshToken},
        "AccessToken is refreshed Successfully!"
      )
  } catch (error) {
    throw new ApiError(401 , error?.message || "Invalid access Token")
  }
    




})


export { registerUser, loginUser, logoutUser, refreshAccessToken };
