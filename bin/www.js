import express from 'express'
import fs from "fs";
import path from "path";
import  request from "request";
import PDFParser from'pdf2json';
const app = express()
const port = 80

import cors  from "cors";
app.use(cors()); //使用cors中间件

import bodyparser from 'body-parser';
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json())


import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);


app.get('/', (req, res) => {
  
  console.log(req.query)
  res.send("<h1> Hello world!<h1>")
})

app.post("/api/parseText",async (req,res)=>{
  let url = req.body["pdfFilePath"]
  let dir = "E:\\vscodeWebAPP\\MyServer\\pdffile\\"
  let fileName = "paper.pdf"
  console.log('------------------------------------------------')
  console.log(url)
  console.log(fileName)
  console.log(dir)
  let stream = fs.createWriteStream(path.join(dir, fileName));
  await request(url).pipe(stream).on("close", function (err) {
    console.log("文件" + fileName + "下载完毕");
    console.log("开始处理pdf文件")
    new Promise((resolve,reject)=>{
    var pdfParser = new PDFParser(this, 1);
    pdfParser.loadPDF("E:\\vscodeWebAPP\\MyServer\\pdffile\\paper.pdf");
    //pdfParser.on('pdfParser_dataError', errData =>reject( new Error(errData.parserError)));
    pdfParser.on('pdfParser_dataReady', () => {
      try{
        let data = pdfParser.getRawTextContent(); 
        resolve(data)}
      catch{
        reject("error")
      }
      
  }); 
  }).then(data =>{
      let ptest  =  data
            
      let sentence = ptest.split("\r\n").join("").split("。") 
      //let sentence = lunwenContent.split("\r\n").join("\r").split("。")
      //sentence[0] = "\n\n"+sentence[0]
      let paragraph = []
      let paragraphIndex = 0
      paragraph[0] =sentence[0]
      for(let i=1;i<sentence.length-1;i++){
          if(/^\d/.test(sentence[i])){
            paragraphIndex++
            paragraph[paragraphIndex] = ""
          }
          paragraph[paragraphIndex] = paragraph[paragraphIndex]+sentence[i]
      }
      paragraph[0] = "\n\n"+paragraph[0]
      res.body =   paragraph.join("\n\n")
      //console.log(res.body.split("\n\n"))

      res.send({"data":res.body})
      },reason=>{
        res.send({"data":reason})
      })
    });
  })

  app.post("/api/findMetaData",(req,res)=>{
    console.log("POST come from :",req.url)
    // console.log("POST params :",req.body.firstPage)
    try{
        let first_Page = req.body.firstPage
        // console.log(first_Page)
        let arr = []
        try{
          arr = first_Page.split("摘 要：")
        }
        catch{
          arr =first_Page.split("摘  要：");
        }
        let abstract = ""
        if(arr.length===1){
          abstract = arr[0].split("关键词：")[0];
        }else{
          abstract = arr[1].split("关键词：")[0];
        }
        //console.log(arr)
        res.send({"abstract":abstract})
      }
    catch{
      res.send({"abstract":req.body.firstPage})
    }
})



app.post("/api/explain",async(req,res)=>{
    console.log("POST come from :",req.url)
    console.log("test :",req.body.text )
    console.log("paragraph :",req.body.paragraph )

    await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `假如有一个科研小白，在读科研论文的时候遇到了一个难懂的专业术语，请你给他一个与文章有关的详细解释，关键字所在段落如下:\n\n${req.body.paragraph}\n关键字：${req.body.text}\n解释：`,
      temperature: 0.7,
      max_tokens: 1212,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }).then((response)=>{
      console.log("response :",response.data.choices[0].text)
      res.send({"data":response.data.choices[0].text})
    },
    (reason)=>{
      res.send({"data":"explain error please contact me 1758091620@qq.com"})
    });
})


app.post("/api/answer",async(req,res)=>{
  console.log("POST come from :",req.url)
  console.log("prompt :",req.body.prompt )
  await openai.createCompletion({
    model: "text-davinci-003",
    prompt: req.body.prompt,
    temperature: 0.7,
    max_tokens: 1212,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  }).then((response)=>{
    console.log("response :",response.data.choices[0].text)
    res.send({"data":response.data.choices[0].text})
  }, reason=>{
    res.send({"data": "explain error\n please contact me 1758091620@qq.com"})
  } );
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})