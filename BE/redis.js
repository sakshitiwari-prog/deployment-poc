const {createClient}=require("redis")
const redisClient=createClient({
    url:"redis://localhost:6379"
})

redisClient.on("error",(err)=>{
console.log(err,'err')
})
async function connectRedis() {
    
    await redisClient.connect()
    console.log('redis connected');
    
}
module.exports={connectRedis,redisClient}