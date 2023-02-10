const express = require("express");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json())

//#region import enum
const FILE_NAME = {
    TEMPLATE_1: 'resources/template_1.docx',
    OUTPUT_TEMPLATE_1: 'resources/output_template_1.docx',
    TEMPLATE_2: 'resources/template_2.docx',
    OUTPUT_TEMPLATE_2: 'resources/output_template_2.docx',
    TEMPLATE_3: 'resources/template_3.docx',
    OUTPUT_TEMPLATE_3: 'resources/output_template_3.docx'
}
//#endregion

const port = 3001;

app.post("/export/template1", (req, res) => {
  console.log(req.body)
  // Load the docx file as binary content
  try {
    const content = fs.readFileSync(
      path.resolve(__dirname, FILE_NAME.TEMPLATE_1),
      "binary"
    );
    
  
    const zip = new PizZip(content);
  
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
  
  
    doc.render(req.body);
  
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });
  
    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.
    fs.writeFileSync(path.resolve(__dirname, FILE_NAME.OUTPUT_TEMPLATE_1), buf);
  
  
    //res.download(path.resolve(__dirname, FILE_NAME.OUTPUT_TEMPLATE_1), 'report.docx')
    res.send('success')
  } catch (err) {
    console.log('error: ', err)
    res.send(null)
  }
});

app.post("/export/template2", (req, res) => {
  console.log(req.body)
  // Load the docx file as binary content
  try {
    const content = fs.readFileSync(
      path.resolve(__dirname, FILE_NAME.TEMPLATE_2),
      "binary"
    );
    
  
    const zip = new PizZip(content);
  
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
  
  
    doc.render(req.body);
  
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });
  
    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.
    fs.writeFileSync(path.resolve(__dirname, FILE_NAME.OUTPUT_TEMPLATE_2), buf);
  
  
    //res.download(path.resolve(__dirname, FILE_NAME.OUTPUT_TEMPLATE_1), 'report.docx')
    res.send('success')
  } catch (err) {
    console.log('error: ', err)
    res.send(null)
  }
  
});

app.post("/export/template3", (req, res) => {
  console.log(req.body)
  // Load the docx file as binary content
  try {
    const content = fs.readFileSync(
      path.resolve(__dirname, FILE_NAME.TEMPLATE_3),
      "binary"
    );
    
  
    const zip = new PizZip(content);
  
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
  
  
    doc.render(req.body);
  
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });
  
    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.
    fs.writeFileSync(path.resolve(__dirname, FILE_NAME.OUTPUT_TEMPLATE_3), buf);
  
  
    //res.download(path.resolve(__dirname, FILE_NAME.OUTPUT_TEMPLATE_1), 'report.docx')
    res.send('success')
  } catch (err) {
    console.log('error: ', err)
    res.send(null)
  }
  
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
