const {Worker}=require("bullmq")

const {bullConnection}=require("../bullmq")
const pdfWorker=new Worker("pdf-process",async(job)=>{
     console.log("Job received:", job.id);
    console.log("Job name:", job.name);
    console.log("Job data:", job.data);

    // Dummy PDF processing
    console.log("Reading PDF...");

    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });

    console.log("PDF reading completed");

    // Whatever you return becomes the job result
    return {
      success: true,
      message: "PDF read successfully"
    };

},
{connection:bullConnection})


module.exports=pdfWorker