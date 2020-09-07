const editor = require("../middleware/editor");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { topic } = require("../models/topic");
const { modules } = require("../models/module");
var express = require("express");
var multer = require("multer");
const router = express.Router();
const GridFsStorage = require("multer-gridfs-storage");
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

const upload = multer({ storage }).single("file");

router.post("/upload", upload, [auth, editor], function (req, res) {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return res.status(400);
  }
  return res.send(file.originalname).status(200);
});

router.get("/load/:filename", (req, res) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No files available",
      });
    }

    gfs.openDownloadStreamByName(req.params.filename).pipe(res);
  });
});

router.delete("/:id", [auth, editor], async (req, res) => {
  const topics = await topic.findByIdAndDelete(req.params.id);
  if (!topics) return res.status(404).send("Page not found");

  const delModules = await modules.find({ topic: topics });
  modules.deleteMany({ topic: topics });

  try {
    let files = [];
    for (let i = 0; i < delModules.length; i++) {
      files.push(delModule[i].filename);
    }

    for (let i = 0; i < files.length; i++) {
      gfs.find({ filename: files[i] }).toArray((err, files) => {
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
        });
      });
    }

    res.status(200);
  } catch (error) {
    res.send(error);
  }
});

router.get("/delete/:filename", [auth, editor], (req, res) => {
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

module.exports = router;
