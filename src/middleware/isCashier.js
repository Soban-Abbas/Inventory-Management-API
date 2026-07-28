exports.isCashier = (req, res, next) => {
    
    if (req.details.role === "cashier") {
    
        next()
    } else {
        return res.status(401).json({
            error: "Unauthorized to Access these Routes"
        })
    }
}