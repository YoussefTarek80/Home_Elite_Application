require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer =require("multer")
const session = require("express-session");
const passport = require("./config/googleOauthConfig");
const router = express.Router();
const upload=multer()
// Import routes
const user = require("./routes/user/auth");
const ads=require("./routes/user/ads/ads");
const BuyAds=require("./routes/user/ads/buy");
const RentAds=require("./routes/user/ads/rent");
const product = require("./routes/admin/product");
const admin = require("./routes/admin/admin");
const cart = require("./routes/user/cart");
const { error } = require("console");
// const upload = require("./middleware/upload");

// Configure EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database...");
  })
  .catch((err) => {
    console.log("Error connecting to Database:", err);
  });

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT"]
}));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// Routes
app.use("/auth", user);
app.use("/user/ads",ads);
app.use("/user/ads/buy",BuyAds);
app.use("/user/ads/rent",RentAds);
app.use("/api", product);
app.use("/admin", admin);
app.use("/cart",cart);
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'cats',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
        },
    })
);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something broke!',
    error: err.message, 
    stack: err.stack    
  });
});

app.get('/',(req,res)=>{
    res.send('Home Elite Mobile application')
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
