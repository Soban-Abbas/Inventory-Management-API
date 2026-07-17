const bcrypt=require("bcrypt");
exports.encryptPassword=async(password,saltRounds)=>{
    try {

    const hash=await bcrypt.hash(password,saltRounds)
    return hash
    } catch (error) {
        throw error
    }
}