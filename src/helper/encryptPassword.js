const bcrypt=require("bcrypt");
exports.encryptPassword=async(password,saltRounds)=>{
    try {

    const hash=await bcrypt.hash(password,saltRounds)
    return hash
    } catch (error) {
        throw error
    }
}
exports.verifyPassword=async(password,encryptedPassword)=>{
try {
    const comparePassword=await bcrypt.compare(password,encryptedPassword);
    if(comparePassword){
        return true
    }
    else{
        return false
    }
} catch (error) {
    throw error
}
}