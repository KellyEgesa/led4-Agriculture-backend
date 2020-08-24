var express = require("express");
var multer = require("multer");
const router = express.Router();
const GridFsStorage = require("multer-gridfs-storage");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const url = `mongodb+srv://KellyEgesa:led4Agriculture1007@cluster0.g8jcv.mongodb.net/<dbname>?retryWrites=true&w=majority`;

const connect = mongoose.createConnection(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;

connect.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "uploads",
  });
});

const storage = new GridFsStorage({
  url: `mongodb+srv://KellyEgesa:led4Agriculture1007@cluster0.g8jcv.mongodb.net/<dbname>?retryWrites=true&w=majority`,
  file: (req, file) => {
    return {
      bucketName: "uploads",
      filename: file.originalname,
    };
  },
});

const upload = multer({ storage: storage }).single("file");

router.post("/upload", upload, function (req, res) {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return res.status(400);
  }
  res.send(file.originalname).send(file);
});

router.get("/load/:filename", (req, res) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No files available",
      });
    }
    // render image to browser
    gfs.openDownloadStreamByName(req.params.filename).pipe(res);
  });
});

router.get("/delete/:filename", (req, res) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No files available",
      });
    }

    gfs.delete(files[0]._id, (err, data) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
      res.send("File Deleted");
    });
  });
});

router.get("/download/:filename", (req, res) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No files available",
      });
    }

    var read_stream = gfs.createReadStream({ _id: files[0]._id });
    let file = [];
    read_stream.on("data", function (chunk) {
      file.push(chunk);
    });
    read_stream.on("error", (e) => {
      console.log(e);
      reject(e);
    });
    return read_stream.on("end", function () {
      file = Buffer.concat(file);
      const pdf = `data:application/pdf;base64,${Buffer(file).toString(
        "base64"
      )}`;
      res.send(pdf);
    });
  });
});
module.exports = router;
