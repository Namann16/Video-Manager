import mongoose, {Schema, model, models, Document} from "mongoose";



export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920
} as const;

export interface IVideo {
    id?: mongoose.Types.ObjectId,
    title: String,
    description: String,
    videoUrl: String,
    thumbnailUrl: String,
    controls?: boolean,
    transformation?: {
        height: Number,
        width: Number,
        quality?: number
    }
}

const vdeoSchema = new Schema<IVideo> (
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        videoUrl: {type: String, required: true},
        thumbnailUrl: {type: String, required: true},
        controls: {type: Boolean, default: true},
        transformation: {
            height: {type: Number, default: VIDEO_DIMENSIONS.height},
            width: {type: Number, default: VIDEO_DIMENSIONS.width},
            quality: {type: Number, default: 80}
        }
    },
    {
        timestamps: true
    }
)

const Video = models.Video || model<IVideo>("Video", vdeoSchema);
export default Video;
