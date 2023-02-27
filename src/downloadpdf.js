//引入相关资源包
import fs from "fs";
import path from "path";
import  request from "request";
import PDFParser from'pdf2json';

export async function  getfileByUrl(url,fileName,dir){
    try{
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
      try{
        arr = ptest.split("摘要：")[1].split("参考文献");}
      catch{
        arr = ptest.split("参考文献");
      }
      for(let i=0;i<arr.length-1;i++)
            lunwenContent+=arr[i];
            
      let sentence = lunwenContent.split("\r\n").join("").split("。") 

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

      res.body =   paragraph.join("\n\n")
    })
  console.log("结束处理pdf")
  res.send(res.body)
        });
        return 1;
    }
    catch{
        return 0;

    }
}


export  function deletePDF(filepath){
    fs.unlink(filepath, (err) => {
        if(err) throw err;
        console.log('删除成功');
    });
}

//getfileByUrl("https://mftdgmvaffmboupnnmbs.supabase.co/storage/v1/object/public/pdf-files/user_files/mao_lululu@aliyun.com/TFnlp-20(3).pdf","TFnlp-20(3).pdf","E:\\vscodeWebAPP\\MyServer\\pdffile\\")
//deletePDF("E:\\vscodeWebAPP\\MyServer\\pdffile\\TFnlp (2).pdf")
export default {};

