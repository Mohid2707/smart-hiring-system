const AWS = require('aws-sdk');

const Emotion_Detection_Function = (req, res, next) => {
  const { Res_Image_Link } = req.body;
  const encodedData = Res_Image_Link.split(",")[1];
  const byteCharacters = atob(encodedData);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/jpeg" });
  const imageUrl = URL.createObjectURL(blob);
  try {
    // Set up AWS credentials
    const accessKeyId = process.env.accessKeyId;
    const secretAccessKey = process.env.secretAccessKey;
    const region = process.env.region;
    // Configure the AWS SDK
    AWS.config.update({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region,
    });

    // Create a new Rekognition instance
    const rekognition = new AWS.Rekognition();

    // Set up the parameters for the emotion detection request
    const params = {
      Image: {
        Bytes: Buffer.from(imageUrl, "base64"),
      },
      Attributes: ["ALL"],
    };

    // Call the detectFaces method to perform the emotion detection
    rekognition.detectFaces(params, (err, data) => {
      if (err) {
        res.status(500).json({
          status: "Error",
          message: err,
        });
      } else {
        res.status(200).json({
          status: "Success",
          message: "Result found successfully !",
          ImageResult: JSON.stringify(data, null, 2),
        });
        //   console.log(JSON.stringify(data, null, 2));
      }
    });
  } catch (Error) {
    console.log(Error);
  }
};
module.exports = {
  Emotion_Detection_Function,
};
