const dotenv = require("dotenv").config()
const next = require("next")
const express = require("express")
import multer from "multer"
import cloudinary from "cloudinary"

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

const {
  hostname: cloud_name,
  username: api_key,
  password: api_secret
} = new URL(process.env.CLOUDINARY_URL)

cloudinary.config({
  cloud_name,
  api_key,
  api_secret
})

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads")
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now())
  }
})

var upload = multer({ storage: storage })

app.prepare().then(() => {
  const server = express()

  server.use(express.json())

  server.use("/", express.static("../public"))

  app.post("/uploadfiles", upload.array("files", 10), (req, res, next) => {
    const files = req.files
    if (!files) {
      const error = new Error("Please choose files")
      error.httpStatusCode = 400
      return next(error)
    }

    res.send(files)
  })

  server.all("*", (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
