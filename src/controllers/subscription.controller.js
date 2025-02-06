import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.models.js";
import ApiError from '../utils/apiError.js';
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    //TODO: toggle subscription
    // check existing subscribed or not

   try {
    const exsitingSubscribed = await Subscription.findByIdAndDelete({channelId},{channel: channelId}) 
    return res 
        .status(200)
        .json(new ApiResponse(200, {subscribe: false}, "channel unsubscribe success"))
 
    if (!exsitingSubscribed) {
     await Subscription.findByIdAndDelete(channelId)
    }

    return res 
        .status(200)
        .json(new ApiResponse(200, {subscribe: true}, "channel subscribe success"))
   } catch (error) {
    return res
        .status(500)
        .json(new ApiError(500, "unable to subscribe internal server error"))
   }
       

})

// controller to return subscriber list of a channel
const getUserChannelSubscriber = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel id')
    }

    try {
        const subscribers = await Subscription.find({ channel: channelId }).populate('subscriber', 'name email').select('email')
    
        return res.status(200).json(new ApiResponse(200, 'Subscriber list fetched successfully', subscribers))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, 'Error while fetching subscriber list', null))
    }
    
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    try {
        
    } catch (error) {
        
    }
})

export {
    toggleSubscription,
    getUserChannelSubscriber,
    getSubscribedChannels,
}