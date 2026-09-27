import express from "express";
import multer from "multer";
import OpenAI from "openai";
import fs from "fs";

const app=express();
const upload=multer({dest:"./uploads/",limits:{fileSize:500*1024*1024}});
app.use(express.json({limit:"20mb"}));
app.use(express.static("public"));
fs.mkdirSync("./uploads",{recursive:true});

function client(){
  if(!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY nincs beállítva.");
  return new OpenAI({apiKey:process.env.OPENAI_API_KEY});
}

app.get("/health",(req,res)=>res.json({ok:true,app:"ElőadásMester AI"}));

app.post("/api/transcribe",upload.single("audio"),async(req,res)=>{
 try{
  const c=client();
  const result=await c.audio.transcriptions.create({
    file:fs.createReadStream(req.file.path),
    model:"gpt-transcribe",
    language:"hu",
    response_format:"text"
  });
  fs.unlinkSync(req.file.path);
  res.json({text:result.text ?? String(result)});
 }catch(e){
  if(req.file?.path) try{fs.unlinkSync(req.file.path)}catch{}
  res.status(500).json({error:e.message});
 }
});

app.post("/api/study",async(req,res)=>{
 try{
  const c=client(), transcript=String(req.body.transcript||"").trim();
  if(!transcript) return res.status(400).json({error:"Nincs leirat."});
  const r=await c.responses.create({
    model:"gpt-5",
    input:`Te egy magyar egyetemi jegyzetelő és vizsgafelkészítő asszisztens vagy.
Az alábbi előadásleiratból készíts tanulható, tényszerű anyagot. Ne találj ki olyan információt, amely nem következik a leiratból.
ADJ VISSZA KIZÁRÓLAG ÉRVÉNYES JSON-T ezzel a szerkezettel:
{"title":"","summary":"","notes":[],"outline":[],"key_terms":[{"term":"","meaning":""}],"exam_points":[],"questions":[{"question":"","answer":""}]}
LEIRAT:
${transcript}`
  });
  const text=r.output_text;
  res.json(JSON.parse(text));
 }catch(e){res.status(500).json({error:e.message});}
});

app.get("/{*splat}",(req,res)=>res.sendFile(process.cwd()+"/public/index.html"));
app.listen(process.env.PORT||3000,()=>console.log("ElőadásMester fut: http://localhost:"+(process.env.PORT||3000)));
