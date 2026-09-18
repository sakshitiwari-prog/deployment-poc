const Redis=require("ioredis")

const { Queue } = require("bullmq");
const bullConnection=new Redis({
    host:"127.0.0.1",
    port:6379,
     maxRetriesPerRequest: null
})
const pdfQueue=new Queue("pdf-process",{
  connection  :bullConnection
})
module.exports={pdfQueue,bullConnection}