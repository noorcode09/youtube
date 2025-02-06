import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.models.js";
import {  Like } from "../models/like.model.js";
import  ApiError  from "../utils/apiError.js";
import { ApiResponse} from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStates = asyncHandler(async(req, res) => {
    // TODO: Get the channel state like total video views, total subscribers, total videos, total likes etc.

})

const getChannelVideos = asyncHandler(async(req, res) => {
    // TODO: Get all the videos uploaded by the channel
})

export {
    getChannelStates,
    getChannelVideos,
}