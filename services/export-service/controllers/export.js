const router = require("express").Router();
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");


const FILE_NAME = {
    TEMPLATE_1: '../resources/template_1.docx',
    OUTPUT_TEMPLATE_1: '../resources/output_template_1.docx',
    TEMPLATE_2: '../resources/template_2.docx',
    OUTPUT_TEMPLATE_2: '../resources/output_template_2.docx',
    TEMPLATE_3: '../resources/template_3.docx',
    OUTPUT_TEMPLATE_3: '../resources/output_template_3.docx'
}

// This route handles a POST request to export a template1 docx file
router.post("/template1", (req, res) => {
  // Log the request body for debugging purposes
  console.log("-------------------------------------------");
  console.log("POST - /export/template1");
  console.log("time: " + new Date());
  console.log("params: ", req.body);

  // Read the docx file as binary content
  try {
    const content = fs.readFileSync(
      path.resolve(__dirname, FILE_NAME.TEMPLATE_1),
      "binary"
    );

    // Load the binary content into a zip object using PizZip library
    const zip = new PizZip(content);

    // Use Docxtemplater library to generate a new docx document from the zip object
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document with the data in the request body
    doc.render(req.body);

    // Generate a node buffer of the rendered docx file
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });

    // Write the buffer to a file in the server
    fs.writeFileSync(path.resolve(__dirname, FILE_NAME.OUTPUT_TEMPLATE_1), buf);

    // Send a success response to the client
    res.send("success");
  } catch (err) {
    // Handle any errors and send a null response to the client
    console.log("error: ", err);
    res.send(null);
  }
});

// This route handles a POST request to export a template2 docx file
router.post("/template2", (req, res) => {
  // Log the request body for debugging purposes
  console.log("-------------------------------------------");
  console.log("POST - /export/template1");
  console.log("time: " + new Date());
  console.log("params: ", req.body);

  // Read the docx file as binary content
  try {
    const content = fs.readFileSync(
      path.resolve(__dirname, FILE_NAME.TEMPLATE_2),
      "binary"
    );

    // Load the binary content into a zip object using PizZip library
    const zip = new PizZip(content);

    // Use Docxtemplater library to generate a new docx document from the zip object
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document with the data in the request body
    doc.render(req.body);

    // Generate a node buffer of the rendered docx file
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });

    // Write the buffer to a file in the server
    fs.writeFileSync(path.resolve(__dirname, FILE_NAME.OUTPUT_TEMPLATE_2), buf);

    // Send a success response to the client
    res.send("success");
  } catch (err) {
    // Handle any errors and send a null response to the client
    console.log("error: ", err);
    res.send(null);
  }
});

// This route handles a POST request to export a template3 docx file
router.post("/template3", (req, res) => {
  // Log the request body for debugging purposes
  console.log("-------------------------------------------");
  console.log("POST - /export/template1");
  console.log("time: " + new Date());
  console.log("params: ", req.body);

  // Read the docx file as binary content
  try {
    const content = fs.readFileSync(
      path.resolve(__dirname, FILE_NAME.TEMPLATE_3),
      "binary"
    );

    // Load the binary content into a zip object using PizZip library
    const zip = new PizZip(content);

    // Use Docxtemplater library to generate a new docx document from the zip object
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document with the data in the request body
    doc.render(req.body);

    // Generate a node buffer of the rendered docx file
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });

    // Write the buffer to a file in the server
    fs.writeFileSync(path.resolve(__dirname, FILE_NAME.OUTPUT_TEMPLATE_3), buf);
    // Send a success response to the client
    res.send("success");
  } catch (err) {
    // Handle any errors and send a null response to the client
    console.log("error: ", err);
    res.send(null);
  }
});

module.exports = router;
