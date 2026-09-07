const rateLimiter=require("express-rate-limit")
const limiter=rateLimiter({
    limit:100,
    windowMs:5 *1000,
    message:{msg:"Too many requests"}
})
// based on ip address with separate limiter for each user
// let request=new Map()
// const limiter=(req,res,next)=>{
//     const currentTime=Date.now()
//     let ip=req.ip
//         let record=request.get(ip)

//         if(!record){
//             request.set(ip,{count:1,startTime:currentTime})
//             return next()
//         }
//         if(currentTime - record.startTime >= 2000 ){
//         request.set(ip,{count:1,startTime:currentTime})
//              return next()
//     }
//     if(record.count>=2){
//         return res.status(429).json({msg:"Too many requests"})
//     }

//     record.count++
//     next()
// }

// for all user with single limiter
// let request={
//     count:0,
//     startTime:Date.now()
// }
// const limiter=(req,res,next)=>{
//     const currentTime=Date.now()
   
//         if(currentTime - request.startTime >= 2000 ){
//         request={count:1,startTime:currentTime}
//              return next()
//     }
//     if(request.count>=2){
//         return res.status(429).json({msg:"Too many requests"})
//     }

//     request.count++
//     next()
// }
module.exports=limiter

// 1.1 request per 2 sec 