import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subsciber: {
        type: Schema.Types.ObjectId,
        ref: "User" // one who is subscribing
    },
    channel: {
        type: Schema.Types.ObjectId, // one to whom 'subsciber' is subscribing
        ref: "User"
    }
}, {timestamps: true})


export const Subscription = mongoose.model("Subscription", subscriptionSchema)