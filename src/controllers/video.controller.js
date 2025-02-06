import mongoose from "mongoose";
import {Video} from "../models/video.model.js";
import {User} from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";


const GetAllVideos = asyncHandler(async(req, res) => {
    const {page = 1, limit = 10, query, sort = "createdAt", sortType = "desc", userId} = req.query
    //TODO: get all videos based on query , sort , pagination
    // Build the query object 
    let queryObject = {};
    if(query){
        queryObject.title = {};
        queryObject.title = {$regex:query, $options: "i"}; // example of search by title
    }
    if(userId) {
        queryObject.userId = userId; // Filter by userid, if provided
    }
    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Build the sort object 
    let sortObject = {};
    sortObject[sort] = sortType === "asc" ? 1: -1;

    try {
        // Fetch videos from the database
        const videos = await Video.find(queryObject)
            .sort(sortObject)
            .skip(skip)
            .limit(parseInt(limit))

        // Get total count for pagination
        const total = await Video.countDocuments(queryObject);

        // Send response
        res.status(200)
            .json(new ApiResponse(200,
                {
                data: videos,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(page),
                    totalPages: Math.ceil(total / limit)
                }
            }, "videos fetched successfully"
        ));

    } catch (error) {
        res.status(500)
            .json(
                new ApiError(500, "Server Error")
            )
    }
})

const publishVideo = asyncHandler(async(req, res) => {
    const {title, description} = req.body
    // 
    // TODO: get video, upload to cloudinary , create video 
    // console.log(req.files)
    
    // file are available or not chech 
    const videoLocalPath = req.files?.videoFile[0]?.path 
    if(!videoLocalPath){
        throw new ApiError(400, "video is required.")
    }
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    if(!thumbnailLocalPath){
        throw new ApiError(400,"thumbnail is required.")
    }
    // console.log(videoLocalPath)

    // upload on cloudinary 
    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    // check file are upload or not in cloudinary 
    if(!videoFile) {
        throw new ApiError(400, "please try again video is not upload !")
    }
    if(!thumbnail){
        throw new ApiError(400, "thumbnail is missing or not upload.")
    }
    // console.log(req.user)
    const _id = req.user._id
    console.log(_id)
    // create a object and entry in database 
    const video = await Video.create({
        videoFile: videoFile?.url,
        thumbnail: thumbnail?.url,
        title: title,
        description: description,
        duration: videoFile?.duration,
        owner: new mongoose.Types.ObjectId(_id)

    })

    const createdVideo = await Video.findById(video._id)

    if(!createdVideo){
        throw new ApiError(400, "Something went wrong then save video in db!")
    }



    return res
    .status(201)
    .json(new ApiResponse(201, createdVideo, "your video is successfully uploaded."))
})

const getVideoById = asyncHandler(async(req, res) => {
    const {videoId} = req.params
    // TODO: get video by id 
    const getVideo = await Video.findById(videoId)

    if(!getVideo){
        throw new ApiError(400, "video not found!")
    }
    
    return res 
        .status(200)
        .json(new ApiResponse(200, getVideo, "video find success"))
    
})

const updateVideo = asyncHandler(async(req, res) => {
    const {videoId} = req.params
    //TODO: update video details like title, description, thumbnail
    // extract filed which you want update 
    // find the video for update 
    // give message to user video update or not 
    const {like, title, description} = req.body;
    const video_id = req.params;
    console.log(req.params)

    if(!video_id){
        throw new ApiError(400, "provide video id must important")
    }



    try {
        const video = await Video.findByIdAndUpdate(videoId, {
            $set: {
                like,
                title,
                description
            },
        },
        {new: true} );
        return res 
            .status(200)
            .json(new ApiResponse(200, video, "update video details is success"))
    } catch (error) {
        return res 
            .status(400)
            .json(new ApiError(400, "please provide a valid id ."))
    }


})

const deleteVideo = asyncHandler(async(req, res) => {
    const {videoId} = req.params
    //TODO: delete video 
    try {
        const videoDelete = await Video.findByIdAndDelete({videoId})
        return res 
            .status(200)
            .json(new ApiResponse(200, videoDelete, "video delete successfully"))
    } catch (error) {
        return res 
            .status(400)
            .json(new ApiError(400, "faild to delete video ."))
    }
})

const togglePublishStatus = asyncHandler(async(req, res) => {
    const {videoId} = req.params;
    try {
        const toggle = await Video.findById(videoId)
        if(!toggle === true && false){
            throw new Error("Error while finding status .")
        }

        return res 
            .status(200)
            .json(new ApiResponse(200, toggle, "toggle status find success."))
    } catch (error) {
        
    }
})

export {
    GetAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
}

