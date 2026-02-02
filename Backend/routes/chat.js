import express from "express";
import Thread from "../models/Thread.js";
import getAPIresponse from "../utils/openai.js";
const router = express.Router();

// router.post("/thread", async (req, res) => {
//   try{
//        const thread=new Thread({
//         threadId:"xyz123",
//         title:"My first Chat"
//        })
//        const response=await thread.save();
//        res.send(response);
//   }catch(err){
//     console.log(err);
//     res.status(500).json({ error: "Server Error: cannot save thread" });
//   }
// });
router.get("/thread",async(req,res)=>{
  try{
     const threads=await Thread.find({}).sort({updatedAt:-1});
      res.json(threads);
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Server Error: cannot fetch threads" });
  }
})
router.get("/thread/:threadId",async(req,res)=>{
  const {threadId}=req.params;
  try{
    const thread=await Thread.findOne({threadId});
    if(!thread){
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread);
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Server Error: cannot fetch chat" });
  }
})
router.delete("/thread/:threadId",async(req,res)=>{
  const {threadId}=req.params;
  try{
    const thread=await Thread.findOneAndDelete({threadId});
    if(!thread){
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ message: "Thread deleted successfully" });
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Server Error: cannot delete thread" });
  }
})
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "threadId and message are required" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message.substring(0, 20),
        messages: [{ role: "user", content: message }]
      });
    } else {
      thread.messages.push({ role: "user", content: message });
      thread.updatedAt = Date.now();
    }

    const assistantreply = await getAPIresponse(message);

    thread.messages.push({
      role: "assistant",
      content: assistantreply
    });

    await thread.save();

    res.json({ reply: assistantreply });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error: cannot process chat" });
  }
});

export default router;