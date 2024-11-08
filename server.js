const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
app.use(cors());
app.use(express.static("public"));
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const housePlans = [
  {
    name: "Farmhouse",
    size: 2000,
    bedrooms: 3,
    bathrooms: 2.5,
    features: ["wrap around porch", "attached garage"],
    main_image: "farm.webp",
    floor_plans: [
      {
        name: "Main Level",
        image: "farm-floor1.webp",
      },
      {
        name: "Basement",
        image: "farm-floor2.webp",
      },
    ],
  },
  {
    name: "Mountain House",
    size: 1700,
    bedrooms: 3,
    bathrooms: 2,
    features: ["grand porch", "covered deck"],
    main_image: "mountain-house.webp",
    floor_plans: [
      {
        name: "Main Level",
        image: "mountain-house1.webp",
      },
      {
        name: "Optional Lower Level",
        image: "mountain-house2.webp",
      },
      {
        name: "Main Level Slab Option",
        image: "mountain-house3.jpg",
      },
    ],
  },
  {
    name: "Lake House",
    size: 3000,
    bedrooms: 4,
    bathrooms: 3,
    features: ["covered deck", "outdoor kitchen", "pool house"],
    main_image: "farm.webp",
    floor_plans: [
      {
        name: "Main Level",
        image: "lake-house1.webp",
      },
      {
        name: "Lower Level",
        image: "lake-house2.webp",
      },
    ],
  },
];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/house_plans", (req, res) => {
  res.json(housePlans);
});

app.listen(3001, () => {
  console.log("Listening....");
});
