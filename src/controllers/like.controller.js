import mongoose,{isValidObjectId} from "mongoose";
import {Like} from "../models/like.model.js";
import ApiError from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async(req, res) => {
    // TODO: toggle like on video
    const {videoId} = req.params;
    const userId = req.user._id;

   // check like is already exsiting or not 
   const exsitingLike = await Like.findOne({video: videoId, likedBy: userId})

   try {
    if(exsitingLike){
     // if it liked then remove and unlike
      await Like.findByIdAndDelete(exsitingLike._id)
      return res 
         .status(200)
         .json(new ApiResponse(200 , {liked: false}, "video unlike success"))
    } else {
     // if dosen't exist add new 
     await Like.create({ video: videoId, likedBy: userId})
     return res 
         .status(200)
         .json(new ApiResponse(200, {liked: true}, "video like success"))
    }
   } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, "failed to like "))
   }
})

const toggleCommentLike = asyncHandler( async(req, res) => {
    const {commentId} = req.params;
    const userId = req.user._id;
    //TODO: toggle like on comment

    const exsitingLike = await  Like.findOne({likedBy: userId, comment: commentId})

    // chack if already like or not 

    try {
        if(exsitingLike) {
            await Like.findByIdAndDelete(exsitingLike._id)
    
            return res 
                .status(200)
                .json(new ApiResponse(200, {liked: false}, "comment unlike success"))
        } else {
            await Like.create({comment: commentId, likedBy: userId});
    
            return res 
                .status(200)
                .json(new ApiResponse(200, { liked: true}, "comment like success"))
        }
    } catch (error) {
        return res 
            .status(500)
            .json(new ApiError(500, "unable to like comment"))
    }
})

const toggleTweetLike = asyncHandler( async( req, res) => {
    const {tweetId} = req.params;
    const userId = req.user._id;
    //TODO: toggle like on tweet

    // check if like is exsiting or not 
    const exsitingLike = await Like.findOne({tweet: tweetId, likedBy: userId})

    if(exsitingLike) {
        await Like.findByIdAndDelete(exsitingLike._id)

        return res 
            .status(200)
            .json(new ApiResponse(200, {liked: false}, "unlike success "))
    } else {
        await Like.create({ tweet: tweetId, likedBy: userId})

        return res 
            .status(200)
            .json(new ApiResponse(200, {liked: true}, "like success"))
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const userId = req.user._id;
   try {
     const likedVideos = await Like.find({ likedBy: userId, video: { $exists: true } }).populate('video');
 
     return res
         .status(200)
         .json(new ApiResponse(200, likedVideos, "liked videos retrieved successfully"));
   } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, "failed to retrieve liked videos"));
   }

    
})

export {
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getLikedVideos,
}
