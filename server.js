const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
app.use(cors());
app.use(express.static("public"));
const multer = require("multer");
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

mongoose
  .connect("mongodb+srv://portiaportia:7BSNOo1S5mEDylYP@data.ng58qmq.mongodb.net/")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });

const houseSchema = new mongoose.Schema({
  name:String,
  size:Number,
  bedrooms:Number,
  bathrooms:Number,
  main_images:String
});

const House = mongoose.model("House", houseSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/house_plans", async(req, res) => {
  const houses = await House.find();
  res.send(houses);
});

app.post("/api/house_plans", upload.single("img"), async(req, res) => {
  const result = validateHouse(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    console.log("I have an error");
    return;
  }

  const house = new House({
    name:req.body.name,
    size:req.body.size,
    bedrooms:req.body.bedrooms,
    bathrooms:req.body.bathrooms
  });

  if (req.file) {
    house.main_image = req.file.filename;
  }

 const newHouse = await house.save();

  res.status(200).send(newHouse);
});

app.put("/api/house_plans/:id", upload.single("img"), async(req, res) => {
  const result = validateHouse(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const fieldsToUpdate = {
    name:req.body.name,
    size:req.body.size,
    bedrooms:req.body.bedrooms,
    bathrooms:req.body.bathrooms
  };

  if (req.file) {
    fieldsToUpdate.main_image = req.file.filename;
  }

  const wentThrough = await House.updateOne({_id:req.params.id}, fieldsToUpdate);

  const house = await House.findOne({_id:req.params.id});

  res.status(200).send(house);
});

app.delete("/api/house_plans/:id", async(req, res) => {
  const house = await House.findByIdAndDelete(req.params.id);

  res.status(200).send(house);
});

const validateHouse = (house) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    size: Joi.number().required(),
    bedrooms: Joi.number().required(),
    bathrooms: Joi.number().required(),
  });

  return schema.validate(house);
};

app.listen(3001, () => {
  console.log("Listening....");
});
