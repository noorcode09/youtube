import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user?._id;
    const videoId = req.body.videoId;

    //TODO: create playlist

    try {
        const playlist = await Playlist.create({
            name,
            description,
            owner: userId,
            videos: [videoId]
        })

        return res
            .status(201)
            .json(new ApiResponse(201, "Playlist created successfully", playlist))
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, "Failed to create playlist", error.message))
    }

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists

    try {
        const playlists = await Playlist.find({ owner: userId })
        return res
            .status(200)
            .json(new ApiResponse(200, { data: playlists },  "User playlists retrieved successfully",))
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, "Failed to retrieve user playlists", error.message))
    }
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id

    try {
        const playlist = await Playlist.findById(playlistId)

        return res
            .status(200)
            .json(new ApiResponse(200,  playlist,"Playlist retrieved byPlaylistId successfully",))
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, "Failed to retrieve playlist by PlaylistId", error.message))
    }
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistsId, videoId } = req.params;

    try {
        const updatePlaylist = await Playlist.findByIdAndUpdate(playlistsId, {
            $push: {videos: videoId}
            
        }, {new: true, runValidators: true})

        return res 
            .status(201)
            .json(new ApiResponse(201, {data: updatePlaylist}, "video added successfully"))
    } catch (error) {
        return res 
            .status(500)
            .json(new ApiError(500, "failed to add video to playlist "))
    }

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist


    try {
        const videoRemove = await Playlist.findByIdAndUpdate(playlistId, {
            $pull: { videos: videoId }
        }, { new: true, useFindAndModify: false })

        return res 
            .status(200)
            .json(new ApiResponse(200, {data: videoRemove}, "video remove from playlist"))
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, "Failed to remove video from playlist", error.message))

    }
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: delete playlist

    try {
        await Playlist.findByIdAndDelete(playlistId)
        return res
            .status(200)
            .json(new ApiResponse(200, "Playlist deleted successfully"))

    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, "Failed to delete playlist", error.message))
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist

    try {
        const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, 
            { name, description }, { new: true, useFindAndModify: false })
        return res
            .status(200)
            .json(new ApiResponse(200, {data: updatedPlaylist},"Playlist updated successfully"))
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, "Failed to update playlist", error.message))    
    }
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}