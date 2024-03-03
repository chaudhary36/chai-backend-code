import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId, // one who is subscribe the channel 
        ref: "User"
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId, // one whom the channel is belong a person or it can be a user { channel is also a user }
        ref: "User"
    }
}, 
{timestamps: true})

export const Subscription = mongoose.model("Subscription" , subscriptionSchema)