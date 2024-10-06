require("dotenv").config();
const user = require("../../models/user/auth");
const Verification = require('../../models/user/verficationEmails');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const fs = require("fs");
const ejs = require("ejs");
const twilio = require('twilio');
const client = new twilio(process.env.accountSid, process.env.authToken);
const transporter=require('../../config/emailResetPassword')
const Register = async (req, res) => {
  try {
    const { email, password, confpassword, phone, address, username } = req.body;

    if (password !== confpassword) {
      return res.status(400).send({ message: 'Passwords do not match' });
    }
    const phoneExists = await user.findOne({ phone }).exec() || await Verification.findOne({ phone }).exec();
    if (phoneExists) {
      return res.status(400).send({ message: 'Phone number already registered' });
    }
    const emailExists = await user.findOne({ email }).exec() || await Verification.findOne({ email }).exec();
    if (emailExists) {
      return res.status(400).send({ message: 'Email already registered' });
    }
    const usernameExists = await user.findOne({ username }).exec() || await Verification.findOne({ username }).exec();
    if (usernameExists) {
      return res.status(400).send({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newVerification = new Verification({
      email,
      password: hashedPassword,
      phone,
      address,
      username,
      verificationCode
    });
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Verify your account',
      text: `Your verification code is: ${verificationCode}`,
      headers: { 'X-Custom-Header': 'Custom Email Header' }
    };
    await transporter.sendMail(mailOptions);
    await newVerification.save();
    res.send({ message: 'Registration successful. Verification code sent to email.'});
  } catch (err) {
    res.status(500).send(err);
  }
};
const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const foundUser = await Verification.findOne({ email }).exec();
    if (!foundUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    if (foundUser.verificationCode !== code) {
      return res.status(400).send({ message: 'Invalid verification code' });
    }
    const newUser = new user({
      email: foundUser.email,
      password: foundUser.password,
      phone: foundUser.phone,
      address: foundUser.address,
      username: foundUser.username,
      cart: [],
      messages: []
    });
    await newUser.save();
    await Verification.deleteOne({ email }).exec();
    res.send({ message: 'Email verified successfully. User registered.', user: newUser });
  } catch (err) {
    res.status(500).send('Internal server error');
  }
};
const verifyPhone = async (req, res) => {
  try {
    const { phone, code } = req.body;
    const foundUser = await user.findOne({ phone }).exec();
    if (!foundUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    if (foundUser.verificationCode !== code) {
      return res.status(400).send({ message: 'Invalid verification code' });
    }
    foundUser.isPhoneVerified = true;
    foundUser.verificationCode = undefined;
    await foundUser.save();
    res.send({ message: 'Phone number verified successfully', user: foundUser });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal server error');
  }
};
const Login = async (req, res) => {
  try {
    let existEmail = await user.findOne({ email: req.body.email }).exec();
    if (!existEmail) {
      return res.status(400).send('Email or password does not match');
    }
    const validPassword = await bcrypt.compare(req.body.password, existEmail.password);
    if (!validPassword) {
      return res.status(400).send('Email or password does not match');
    }
    const adminrole = await existEmail.adminrole;

    const token = jwt.sign({ userid: existEmail._id }, 'keysecret');
    res.header('x-token', token);

    const UserIdLogin = existEmail._id;
    res.send({ message: 'Login Successfully', adminrole, token, UserIdLogin });
  } catch (err) {
    res.status(500).send('Error in login');
  }
};
const getUser = async (req, res) => {
  try {
    const userId = req.user.userid;
    const foundUser = await user.findById(userId).exec();
    if (!foundUser) {
      return res.status(404).send('User not found');
    }
    res.send(foundUser);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal server error');
  }
};
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const foundUser = await user.findOne({ email }).exec();
    if (!foundUser) {
      return res.status(404).send({ message: "User not found" });
    }
    const resetToken = jwt.sign({ userid: foundUser._id }, 'keysecret', { expiresIn: '1h' });
    const resetLink = `${process.env.CLIENT_URL}/${resetToken}`;
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Click the link to reset your password: ${resetLink}`,
      headers: { 'X-Custom-Header': 'Custom Email Header' }
    };
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error("Error sending password reset email:", err);
    res.status(500).send("Internal server error");
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token,'keysecret');
    const foundUser = await user.findById(decoded.userid).exec();
    if (!foundUser) {
      return res.status(404).send({ message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    foundUser.password = hashedPassword;
    await foundUser.save();
    res.status(200).send({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error resetting password:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(400).send({ message: "Reset token has expired" });
    }
    res.status(500).send("Internal server error");
  }
};
const updateProfile = async(req,res)=>{
  try{
    const {name,phone}=req.body;
    const userId=req.user.userid;
    const foundUser=await user.findById(userId).exec();
    if (!foundUser) {
      return res.status(404).send('User not found');
    }
    foundUser.username = name || foundUser.username;    
    foundUser.phone = phone || foundUser.phone;
    await foundUser.save();
    return res.status(200).send({
      message: 'Profile updated successfully',
      user: foundUser
    });
  }catch(err){
    console.error('Error:', err);
    res.status(500).send('Internal server error');
  }
}
module.exports = {
  Register,
  Login,
  getUser,
  verifyPhone,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  updateProfile
};