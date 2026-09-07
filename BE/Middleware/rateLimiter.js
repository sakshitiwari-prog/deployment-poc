const rateLimiter=require("express-rate-limit")
const limiter=rateLimiter({
    limit:100,
    windowMs:5 *1000,
    message:{msg:"Too many requests"}
})
module.exports=limiter