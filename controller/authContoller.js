const User = require("../model/user");
const VerificationLinks = require("../model/verificationLinks");
const otpVerification = require("../model/otpVerification");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const commonFunctions = require("../commonFunctions");
module.exports = {
  login: async (req, res) => {
    try {
      // Get user input
      const { email, password } = req.body;
      const mainValues = [email, password];
      // Validate user input
      if (commonFunctions.checkBlank(mainValues)) {
        return res.status(400).send({
          success: false,
          message: "All input is required",
        });
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        if (!user.isVerified || user.isBlocked) {
          return res.status(400).send({
            success: false,
            message: "User not verified",
          });
        }
        if (user.is2FAenabled) {
          await sendOtp(user, false);
          return res.status(200).send({
            success: true,
            message: "Otp send to register email please verify",
          });
        }
        const token = await jwt.sign(
          { id: user._id, userId: user.userId },
          process.env.SECRET_KEY,
          {
            expiresIn: process.env.JWT_EXPIRE,
          }
        );

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
        message: err,
      });
    }
    // Our register logic ends here
  },
  register: async (req, res) => {
    try {
      // Get user input
      const { firstName, lastName, email, password } = req.body;
      const mainValues = [firstName, email, password];
      if (commonFunctions.checkBlank(mainValues)) {
        return res.status(400).send({
          success: true,
          message: "Bad Request",
        });
      }

      // check if user already exist
      // Validate if user exist in our database
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
        let hasLink = await VerificationLinks.findOne({
          userId: userdetail.userId,
        });
        if (hasLink) {
          await VerificationLinks.updateOne(
            { userId: userdetail.userId },
            {
              link: verificationToken,
              updateAt: Date.now(),
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
    try {
      const { password } = req.body;
      const { id, token } = req.params;
      if (commonFunctions.checkBlank([id, password, token])) {
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
      if (checkLinks.link != token) {
        return res.status(400).send({
          success: false,
          message: "Link expired",
        });
      }
      let getTimeDiff = commonFunctions.get_time_diff(
        checkLinks.updateAt,
        new Date(),
        "minutes"
      );
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
    } catch (error) {}
  },
  resendOtp: async (req, res) => {
    try {
      const { userId } = req.body;
      if (commonFunctions.checkBlank([userId])) {
        return res.status(400).send({
          success: false,
          message: "Bad Request",
        });
      }
      const userdetail = await User.findOne({ userId });
      if (!userdetail) {
        return res.status(400).send({
          success: false,
          message: "no user found!!",
        });
      }
      let isOTPsend = await sendOtp(userdetail, true);
      return res.status(isOTPsend == "OTP send" ? 200 : 400).send({
        success: true,
        message: isOTPsend,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success: false, message: error });
    }
  },
  verifyOTP: async (req, res) => {
    try {
      const { userId, otp } = req.body;
      if (commonFunctions.checkBlank([userId, otp])) {
        return res.status(400).send({
          success: false,
          message: "Bad Request",
        });
      }
      let otpDetail = await otpVerification.findOne({ userId: userId });
      let message = !otpDetail
        ? "OTP expired!"
        : otpDetail && otpDetail.verificaionAttempt > 3
        ? "OTP verify exceeded!"
        : "Otp expired";
      if (!otpDetail || otpDetail && otpDetail.verificaionAttempt > 3) {
        return res.status(400).send({
          success: false,
          message,
        });
      }
      let isExpired =
        commonFunctions.get_time_diff(
          new Date(),
          otpDetail.updateAt,
          "minutes"
        ) > 1
          ? true
          : false;
          console.log(commonFunctions.get_time_diff(
            new Date(),
            otpDetail.updateAt,
            "minutes"
          ))
      if (isExpired || otpDetail.otp != otp) {
        await otpVerification.updateOne(
          { userId: userId },
          { verificaionAttempt: otpDetail.verificaionAttempt + 1 }
        );
        return res.status(400).send({
          success: false,
          message: isExpired
            ? "OTP expired!"
            : "OTP not valid, Please try again!!",
        });
      }
      await otpVerification.deleteOne({ userId: userId });
      if (req.user) {
        return res.status(400).send({
          success: false,
          message: "OTP Verified successfully",
        });
      }
      const user = await User.findOne({ userId });
      if (user) {
        const token = await jwt.sign(
          { id: user._id, userId: userId },
          process.env.SECRET_KEY,
          {
            expiresIn: process.env.JWT_EXPIRE,
          }
        );

        return res.status(200).send({
          success: true,
          message: "LoggedIn Successfully",
          token,
          user,
        });
      }
      return res.status(400).send({
        success: false,
        message: "User Not Found",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success: false, message: error });
    }
  },
};
const sendOtp = async (userDetail, isResent) => {
  return new Promise(async (resolve, reject) => {
    try {
      let previousOtp = await otpVerification.findOne({
        userId: userDetail.userId,
      });
      let otp = commonFunctions.generateOtp(6);
      let template = {
        userId: userDetail.userId,
        subject: `Your OTP for ${process.env.APPNAME}`,
        sendTo: userDetail.email,
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <p style="font-size:1.1em">Hi ${userDetail.firstName},</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
          <p>Verification code is valid only for 10 minutes</p>
          <p style="font-size:0.9em;">Regards,<br />${process.env.APPNAME}</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Your ${process.env.APPNAME} Inc</p>
          </div>
        </div>
      </div>`,
      };
      if (!previousOtp) {
        await otpVerification.create({
          userId: userDetail.userId,
          otp,
          verificaionAttempt: 0,
          resentAttempt: 0,
        });
        commonFunctions.sendEmail(template);
        resolve("OTP send");
      }
      let getTimeDiff = commonFunctions.get_time_diff(
        new Date(),
        previousOtp.updateAt,
        // "hours"
        'minutes'
      );
      let isExpire =
        getTimeDiff > 1 || previousOtp.resentAttempt < 3 ? true : false; // Currently set as 5 mint
        if (!isExpire) {
          resolve("limit exceeded");
        }
        let otpVerficationDetail = {
          otp: otp,
          verificaionAttempt: 0,
          resentAttempt: isResent || !(getTimeDiff > 1) ? previousOtp.resentAttempt + 1 : 0,
          updateAt: new Date(),
        };
        if (getTimeDiff > 1) otpVerficationDetail.createdAt = new Date();
        await otpVerification.updateOne(
          { userId: userDetail.userId },
          otpVerficationDetail
        );
        commonFunctions.sendEmail(template);

      resolve("OTP send");
    } catch (error) {
      reject(error.message);
    }
  });
};
