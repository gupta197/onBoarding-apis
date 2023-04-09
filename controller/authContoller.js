const User = require("../model/user");
const VerificationLinks = require("../model/verificationLinks");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const commonFunctions = require("../commonFunctions");
module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const mainValues = [email, password];
      if (commonFunctions.checkBlank(mainValues)) {
        return res.status(400).send({
          success: false,
          message: "All input is required",
        });
      }
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        if (!user.isVerified || user.isBlocked) {
          return res.status(400).send({
            success: false,
            message: "User not verified",
          });
        }
        if(user.is2FAenabled){
          return res.status(200).send({
            success: true,
            message: "OTP shared to registered email, please check!!!",
          });
        }
        const token = await jwt.sign({ id: user._id,userId:user.userId }, process.env.SECRET_KEY, {
          expiresIn: process.env.JWT_EXPIRE,
        });
        return res.status(200).send({
          success: true,
          message: "LoggedIn Successfully",
          token,
          user,
        });
      }
      return res.status(400).send({
        success: true,
        message: "Invalid Credentials",
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const mainValues = [firstName, email, password];
      if (commonFunctions.checkBlank(mainValues)) {
        return res.status(400).send({
          success: true,
          message: "Bad Request",
        });
      }
      const oldUser = await User.findOne({ email });

      if (oldUser) {
        return res.status(409).send({
          success: true,
          message: "User Already Exist. Please Login",
        });
      }

      //Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      const user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
        userId: Math.floor((1 + Math.random()) * 0x10000),
      });

      res.status(201).send({
        success: true,
        message: "User registered successfully, Please verify your email!!",
      });
      let verificationToken =
        commonFunctions.generateRandomStringAndNumbers(15);
      let template = {
        link: verificationToken,
        userId: user.userId,
        subject: "Verify your email",
        text:"Verify your email",
        sendTo: email,
        html: `Hi ${firstName},
        <br/>
        <br/>
        Thanks for getting started with our ${process.env.APPNAME}!
        <br/>
        We need a little more information to complete your registration, including a confirmation of your email address.
        <br/>
        Click below to confirm your email address:<br/>
        <a href="http://localhost:8080/verifyEmail?q=${user.userId}" target="_blank"> click here</a>
        <br/>
        If you have problems, please paste the above URL into your web browser.`,
      };
      await VerificationLinks.create(template);
      commonFunctions.sendEmail(template);
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },
  verifyEmail: async (req, res) => {
    try {
      const userId = req.query.q;
      const mainValues = [userId];
      if (commonFunctions.checkBlank(mainValues)) {
        return res.status(400).send({
          success: true,
          message: "Bad Request",
        });
      }
      const userData = await User.findOne({ userId: userId });
      if (!userData) {
        return res.status(400).send({
          success: false,
          message: "no user found with such email!!!",
        });
      } else if (userData && userData.isVerified) {
        return res.status(400).send({
          success: false,
          message: "User Already verified. please login",
        });
      } else {
        await User.updateOne(
          { userId: userId },
          {
            isVerified: true,
            isActive: true,
          }
        );
        await VerificationLinks.deleteOne({ userId: userId });
        return res.status(201).send({
          success: true,
          message: "User verified successfully, Please login!!",
        });
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  },
  forgetPassword: async (req, res) => {
    try {
      const { email } = req.body;
      if (commonFunctions.checkBlank([email])) {
        return res.status(400).send({
          success: true,
          message: "Bad Request",
        });
      }
      const userdetail = await User.findOne({ email });
      if (userdetail) {
        let verificationToken =
          commonFunctions.generateRandomStringAndNumbers(15);
        let template = {
          link: verificationToken,
          userId: userdetail.userId,
          subject: "Reset your password",
          text:"Reset your password",
          sendTo: email,
          html: `Hello ${userdetail.firstName},<br/><br/>

      Somebody requested a new password for the [customer portal] account associated with [email].
      <br/>
      <br/>
      No changes have been made to your account yet.
      <br/>
      <br/>
      You can reset your password by clicking the link below:
      <br/>
      <a href="http://localhost:8080/resetPassword/${userdetail.userId}/${verificationToken}" target="_blank"> click here </a>
      <br/>

      If you did not request a new password, please ignore this email.
      <br/>
      <br/>
      This password reset link is only valid for the next 30 minutes.
      <br/>
      <br/>
      Yours,
      The ${process.env.APPNAME} team.`,
        };
        let hasLink = await VerificationLinks.findOne({ userId: userdetail.userId });
        if (hasLink) {
          await VerificationLinks.updateOne(
            { userId: userdetail.userId },
            {
              link: verificationToken,
              updateAt: Date.now()
            }
          );
        } else {
          await VerificationLinks.create(template);
        }
        commonFunctions.sendEmail(template);
      }
      return res.status(200).send({
        success: true,
        message:
          "Reset Password email send to register email. Please check email",
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  },
  resetPassword: async (req, res) => {
    const { password } = req.body;
    const { id ,token} = req.params;
    if (commonFunctions.checkBlank([id, password,token])) {
      return res.status(400).send({
        success: false,
        message: "Bad Request",
      });
    }
    const checkLinks = await VerificationLinks.findOne({ userId: id });
    if (!checkLinks) {
      return res.status(400).send({
        success: false,
        message: "Link expired or User Not Found!",
      });
    }
    if(checkLinks.link != token){
      return res.status(400).send({
        success: false,
        message: "Link expired",
      });
    }
    let getTimeDiff = commonFunctions.get_time_diff(checkLinks.updateAt, new Date(),'minutes');
    let isLinkExpire = getTimeDiff > 5; // Currently set as 5 mint
    if (isLinkExpire) {
      return res.status(400).send({
        success: false,
        message: "Link expired or User Not Found!",
      });
    }
    const userDetail = await User.findOne({ userId: id });
    if (!userDetail) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      { userId: id },
      {
        password: encryptedPassword,
      }
    );
    await VerificationLinks.deleteOne({ userId: id });
    let template = {
      subject: "Password successfully changed",
      sendTo: userDetail.email,
      text:"Password change",
      html: `Hello ${userDetail.firstName}
        <br/>
        <br/>
        Password Changed
        <br/>
        <br/>
        We are notifying you your password was changed successfully.<br/>
        If you did not authorise this, please notify an administrator immediately.<br/>
        Feel free to reach out to the ${process.env.APPNAME} team for any further support.
        <br/>
        <br/>
        Email: ${process.env.SUPPORTEMAIL}`,
    };
    commonFunctions.sendEmail(template);

    return res.status(200).send({
      success: true,
      message: "Reset you password successfully",
    });
  },
};
