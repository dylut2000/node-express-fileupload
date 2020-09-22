const express = require("express");
// express file upload
const fileUpload = require("express-fileupload");
// build in 
const path = require("path");
const util = require("util");
// get express
const app = express();
// parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// use as first middleware
app.use(fileUpload());
// make the public folder accessable to the outside
app.use(express.static("./public"));

// async function for uploading a file
app.post("/upload", async (req, res) => {
  try {
      // get file
    const file = req.files;
    // console all about file
    console.log(file.files);
    // get file name
    const fileName = file.files.name;
    // get file size
    const size = file.files.size;
    // get extension
    const extension = path.extname(fileName);
    // create allowed format
    const allowedExtensions = /png|jpeg|jpg|gif|pdf/;
    // check if format is not supported
    if (!allowedExtensions.test(extension)) throw "Unsupported extension!";
    // check if supported file is less than 5MB
    if (size > 5000000) throw "File must be less than 5MB";
    // get md5 encoded file name + extension 
    const md5 = file.files.md5;
    // create an upload location + file md5 + extention
    const URL = "/uploads/" + md5 + extension;
    // move a file to the public folder
    await util.promisify(file.files.mv)("./public" + URL);
    console.log(URL);

    res.json({
      message: "File uploaded successfully!",
      url: URL,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err,
    });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});