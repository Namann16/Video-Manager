import mongoose, {Schema, model, models, Document} from "mongoose";
import bcrypt from "bcryptjs";

export interface Iuser {
    email: string;
    password: string;
    _id? : mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<Iuser> (
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function(next) { // done before the data is saved into the database
    const user = this as Iuser & Document;
    if(user.isModified("password")){
       user.password =  await bcrypt.hash(user.password, 10)
    }
    next();
})

const User = models?.User || model<Iuser>("User", userSchema);
export default User;