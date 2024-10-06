const admin = require("../models/admin/admins");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const ejs = require("ejs");
const Register = async (req, res) => {
    try {
      const { email, password, confpassword, phone, address } = req.body;
      console.log(email)
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new admin({
        email: req.body.email,
        password: hashedPassword,
        username: req.body.username
      });
      await newAdmin.save();
      // const transporter = nodemailer.createTransport({
      //   service: "Gmail",
      //   auth: {
      //     user: "ecommercewebsite29@gmail.com",
      //     pass: "ytnundhsrakhkdfx",
      //   },
      // });
      // const mailOptions = {
      //   from: "ecommercewebsite29@gmail.com",
      //   to: email,
      //   subject: "Registration Successful",
      //   html: await generateRegistrationEmailHtml({ email, phone, address }),
      // };
      // async function generateRegistrationEmailHtml(userData) {
      //   try {
      //     const templatePath = "./views/Register-template.ejs";
      //     const template = fs.readFileSync(templatePath, "utf-8");
      //     const renderedTemplate = await ejs.render(template, userData);
      //     return renderedTemplate;
      //   } catch (templateError) {
      //     console.error("Error rendering template:", templateError);
      //     throw templateError;
      //   }
      // }
      // transporter.sendMail(mailOptions, (error, info) => {
      //   if (error) {
      //     console.log("Error sending email:", error);
      //   } else {
      //     console.log("Email sent:", info.response);
      //   }
      // });
      res.send({ message: 'Registration successful', admin: newAdmin });
    } catch (err) {
      res.send(err);
    }
  };
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingAdmin = await admin.findOne({ email }).exec();
        if (!existingAdmin) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, existingAdmin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign(
            { adminId: existingAdmin._id, adminRole: existingAdmin.adminRole },
            'keysecret',
            { expiresIn: '1h' } 
        );
        res.header('Authorization', `Bearer ${token}`);
        res.json({
            message: 'Login successful',
            adminRole: existingAdmin.adminRole,
            token,
            adminId: existingAdmin._id
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    Login,
    Register
};