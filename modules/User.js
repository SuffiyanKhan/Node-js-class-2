import mongoose from "mongoose";

const {Schema} = mongoose

const  UserSchema = new Schema({
    email : {
        type : Schema.Types.String,
        required : true
    },
    password : {
        type : Schema.Types.String,
        required : true
    }
},{
    timestamps : true
}
)

const Auth = mongoose.model("Auth" , UserSchema)


export default Auth




