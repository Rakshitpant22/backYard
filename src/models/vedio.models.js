import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const vedioSchema = new mongoose.Schema({
vedioFile:{
    type: String, //cloudinary url
    required:true,
},
thumbnail:{
    type: String, //cloudinary url
    required:true,
},
title: {
    type: String, 
    required: true
},
description: {
    type: String, 
    required: true
},
duration: {
    type: Number, 
    required: true
},
views: {
    type: Number,
    default: 0
},
isPublished: {
    type: Boolean,
    default: true
},
owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
}
},{timestamps:true})

vedioSchema.plugin(mongooseAggregatePaginate) 
//! This plugin is used to facilitate pagination of MongoDB aggregation queries. Aggregation pipelines are more flexible than standard queries and allow for more complex data processing
//! By calling vedioSchema.plugin(mongooseAggregatePaginate), you are extending the Mongoose schema (vedioSchema in this case) to include a method for pagination with aggregation pipelines.

export const Vedio= mongoose.model("Vedio",vedioSchema)
