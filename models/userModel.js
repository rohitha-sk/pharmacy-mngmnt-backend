import mongoose from "mongoose";


const userSchema = mongoose.Schema(
    {
    name: {
        type:String,
    
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password :{
        type:String,
        required: true
    },
    role: {
        type: String,
        default: "customer", // Default value for the role field
    },

    }
)


const User = mongoose.model("Users",userSchema);
export default User;