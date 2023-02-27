import express from 'express'
const router  =  express.Router()

import getfileByUrl  from "../src/downloadpdf.js"
import getParseText from "../src/readpdf.js"

import bodyparser from 'body-parser';
router.use('/parseText',bodyparser.urlencoded({extende:true}));
router.use('/parseText',bodyparser.json())


router.get('/', (req, res) => {
  
    console.log(req.query)
    res.send("<h1> Hello world!<h1>")
  })
  
router.use('/parseText', function(req, res, next) {
    // console.log("POST come from :",req.url)
    // console.log("req.body",req.body)
    url = req.body["pdfFilePath"]
    console.log(url)
    filename = "paper.pdf"
    path = "E:\\vscodeWebAPP\\MyServer\\pdffile\\"
    getfileByUrl(url,filename,path)
    next();
});

router.post("/parseText",(req,res)=>{
      // console.log("POST come from :",req.url)
      // console.log("req.body",req.body)
      url = req.body["pdfFilePath"]
      filename = "paper.pdf"
      path = "E:\\vscodeWebAPP\\MyServer\\pdffile\\"
      ParseText =getParseText("E:\\vscodeWebAPP\\MyServer\\pdffile\\paper.pdf")
      console.log("ParseText sent\n",ParseText)
      res.send({data:ParseText})
  })
  
router.post("/explain",(req,res)=>{
      console.log("POST come from :",req.url)
      console.log("POST params :",req.params)
      res.send(req.query)
  })


  export default router;