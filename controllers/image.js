// Separating our image endpoints
const Clarifai = require("clarifai");

// Our API key to allow us to communicate with Clarifai's face detection 
const app = new Clarifai.App({
  apiKey: process.env.API_CLARIFAI,
}); 

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input) // Built in Clarifai method to check our input for a face
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("unable to work with API"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall,
};
