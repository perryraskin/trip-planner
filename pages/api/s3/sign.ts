import { NextApiRequest, NextApiResponse } from "next"
import aws from "aws-sdk"
const bucket = "tripnotize"
const { region, accessKeyId, secretAccessKey } = process.env

aws.config.update({ region, accessKeyId, secretAccessKey })

export default async function(req, res) {
  try {
    let query = req.query
    console.log(query)
    const s3 = new aws.S3()
    const objectName = query.objectName
    const contentType = query.contentType

    const s3Param = {
      Bucket: bucket,
      Key: objectName,
      Expires: 500,
      ContentType: contentType,
      ACL: "public-read"
    }

    s3.getSignedUrl("putObject", s3Param, (err, data) => {
      if (err) {
        console.log("Error:", err)
        //res.json({ success: false, error: err })
      }
      res.send({
        success: true,
        signedUrl: data,
        uploadUrl: `https://${bucket}.s3.amazonaws.com/${objectName}`
      })
    })
  } catch (err) {
    //res.status(500)
    console.log({ error: err.message })
  } finally {
  }
}
