const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    createdAt: {
        type: Date,
        default:Date.now(),
        expires:5*60,
    },
    otp:{
        type:String,
        required:true
    }
});

async function sendVerificationEmail(email,otp){
    try{

        const mailResponse = await mailSender(email,"Verification Email from Eduverse", otp);
        console.log("Email sent successfully: ", mailResponse);

    } catch(err){
        console.log("error occured while sending mail" , err);
        throw error;
    }
}

OTPSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})


module.exports = mongoose.model("OTP", OTPSchema);