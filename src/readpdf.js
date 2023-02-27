import PDFParser from'pdf2json';
let pdfPath ="E:\\vscodeWebAPP\\MyServer\\pdffile\\TFnlp-20(3).pdf";


async function getPDF(pdfPath){
    return  new Promise((resolve,reject)=>{
    var pdfParser = new PDFParser(this, 1);
    pdfParser.loadPDF(pdfPath);
    pdfParser.on('pdfParser_dataError', errData =>reject( new Error(errData.parserError)));
    pdfParser.on('pdfParser_dataReady', () => {
    let data = pdfParser.getRawTextContent(); resolve(data)}); 
  })
}


let ptest  =  await getPDF(pdfPath)
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

const pdfdata =  paragraph.join("\n\n")
