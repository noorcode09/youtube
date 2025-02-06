import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comment for a video
    // const { videoId } = req.params
    // const { page = 1, limit = 10 } = req.query
    // let's create a queryobject
    // let queryObject = {}
    // if(query){
    //     queryObject.title = {}
    //     queryObject.title = {$regex:query, $options: "i"} // example of search by title
    // }

    // if (!videoId) {
    //     throw new Error("plaease provide valid video is"); // if provided
    // }

    // calculate pagination value
    // const skip = (page - 1) * limit;

    // let sortObject = {}
    // sortObject[sort] = sortType === "asc" ? 1 : -1;
    try {
        const getAllComment = await Comment.findById(req.params?.videoId)
            // .sort(sortObject)
            // .skip(skip)
            // .limit(parseInt(limit))
        return res
            .status(200)
            .json(new ApiResponse(200, getAllComment,"comment found successfully."))
    } catch (error) {
        return res
            .status(400)
            .json(new ApiError(400, "comment not fund!"))
    }


});

const addComment = asyncHandler(async (req, res) => {
    // Extract comment from body
    const { comment } = req.body;
    if (!comment) {
        throw new ApiError(400, "Please provide a comment.");
    }

    // Extract and debug video_id
    const {videoId} = req.params;

    // Validate video_id
    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, `Invalid video ID format: ${videoId}`);
    }

    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "User is not authenticated.");
    }

    console.log(`User ID: ${req.user._id}`);
    console.log(`user comment: ${comment}`)
    // console.log(`user params: ${JSON.stringify(req.params, null, 2)}`)
    // console.log(`Video ID: ${video_id}`);

    // Create new comment in the database
    try {
        const newComment = await Comment.create({
            content: comment,
            video: new mongoose.Types.ObjectId(videoId),
            owner: new mongoose.Types.ObjectId(req.user._id)
        });

        return res
            .status(201)
            .json(new ApiResponse(201, newComment, "Comment added successfully."));
    } catch (error) {
        console.error("Error adding comment:", error);
        throw new ApiError(500, "Internal server error.");
    }
});


const updateComment = asyncHandler(async (req, res) => {
    //TODO: update a comment
    const {newText} = req.body;
    try {
        const updateComment = await Comment.findByIdAndUpdate(req.params?._id, {$set: {
            content: newText,
        }})

        return res 
            .status(201)
            .json(new ApiResponse(201, updateComment, "comment is updated success"))
    } catch (error) {
        return res 
            .status(500)
            .json(new ApiError(500, "comment not found "))
    }
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params;

    try {
        const deleteComment = await Comment.findByIdAndDelete({commentId})

        return res 
            .status(200)
            .json(new ApiResponse(200,  "comment deleted success"))
    } catch (error) {
        
    }
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
}