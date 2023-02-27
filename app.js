import express from 'express'
import fs from "fs";
import path from "path";
import  request from "request";
import {getfileByUrl}  from "../src/downloadpdf.js"
//import {getParseText} from "../src/readpdf.js"
import PDFParser from'pdf2json';
const app = express()
const port = 80

import cors  from "cors";
app.use(cors()); //使用cors中间件

import bodyparser from 'body-parser';
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json())




app.get('/', (req, res) => {
  
  console.log(req.query)
  res.send("<h1> Hello world!<h1>")
})

// app.use('/api/parseText', async(req, res, next) => {


// });

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
    let data = pdfParser.getRawTextContent(); resolve(data)}); 
  }).then((data)=>{
      let ptest  =  data
      let lunwenContent =""
      let arr = []
      // try{
      //   arr = ptest.split("摘要：")[1].split("参考文献");}
      // catch{
      //   arr = ptest.split("摘 要：")[1].split("参考文献");
      // }
      //arr = ptest.split("参考文献")
      // for(let i=0;i<arr.length-1;i++)
      //       lunwenContent+=arr[i];
            
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
      console.log(res.body.split("\n\n"))

      res.send({"data":res.body})
      })
    });
  })

  app.post("/api/findMetaData",(req,res)=>{
    console.log("POST come from :",req.url)
    // console.log("POST params :",req.body.firstPage)
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
    console.log(arr)
    res.send({"abstract":abstract})
})



app.post("/api/explain",(req,res)=>{
    console.log("POST come from :",req.url)
    console.log("test :",req.body.text )
    console.log("paragraph :",req.body.paragraph )

    res.send({"data":"explain..."})
})


app.post("/api/answer",(req,res)=>{
  console.log("POST come from :",req.url)
  console.log("prompt :",req.body.prompt )

  res.send({"data":"answer...."})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})