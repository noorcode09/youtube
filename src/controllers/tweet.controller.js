import mongoose,{isValidObjectId, ObjectId} from "mongoose";
import {Tweet} from "../models/tweet.model.js";
import {User} from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";



const createTweet = asyncHandler(async (req, res) => {
    // TODO: create tweet
    const {tweetText} = req.body;
    const {_id} = req.user;


    try {
        const addTweet = await Tweet.create({
            content: tweetText,
            owner: new mongoose.Types.ObjectId(_id)
        })

        return res 
            .status(201)
            .json(new ApiResponse(201, addTweet, "tweet added success."))
    } catch (error) {
        throw new ApiError(500, "Failed to create tweet.")
    }
})

const getUserTweets = asyncHandler(async( req, res) => {
    //TODO: get user tweets
    const{userId} = req.params;
    // console.log(userId)
   
    // if(!isValidObjectId(userId)){
    //     console.log(`please provide a valid id`)
    // }
    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new Error("please provide a valid id ")
    }
    
    try {
        // const getTweets = await Tweet.aggregate([
        //     {$match: { owner: new mongoose.Types.ObjectId(userId)}}
        // ])
        const getTweets = await Tweet.find({owner: userId})

        return res 
            .status(200)
            .json(new ApiResponse(200, getTweets, "tweet fetch success."))
        
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, "user tweet not found"))
    }
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params;
    const {updateText} = req.body;

    if(!mongoose.Types.ObjectId.isValid(tweetId)){
        throw new Error("please provide a valid tweet id")
    }

    try {
        const updateTweets = await Tweet.findByIdAndUpdate(
            tweetId,
            {$set: {
                content: updateText,
            }},
            {new: true}
        )

        return res 
            .status(201)
            .json(new ApiResponse(201, updateTweets, "tweet update success"))
    } catch (error) {
        
    }
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const {tweetId} = req.params;

    try {
        const deleteTweet = await Tweet.findByIdAndDelete(tweetId)

        return res 
            .status(200)
            .json(new ApiResponse(200,  "tweet delete success"))
    } catch (error) {
        return res 
            .status(400)
            .json(new ApiError(400, "failed to delete tweet"))
    }
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
}