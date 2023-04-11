const User = require("../model/user");
const commonFunctions = require("../commonFunctions");

exports.setup2fa = async function (req, res) {
  try {
    const { flag } = req.body;
    const { userId } = req.user;
    let isFlagHasValue = flag && (flag == 'true' || flag == 'false') ? true : false;
    if (!isFlagHasValue) {
      return res.status(400).send({
        success: false,
        message: "Flag value should be boolean value",
      });
    }

    const userDetail = await User.findOne({ userId });
    if (!userDetail) {
      return res.status(400).send({
        success: false,
        message: "no user found with such userId!!!",
      });
    }
    let flagMessage = flag == 'true' ? "enable" : "disable";
    flagMessage =
      String(userDetail.is2FAenabled) == flag
        ? `2FA already ${flagMessage + "d"}`
        : `2FA is ${flagMessage} sucessfully`;
    if (userDetail.is2FAenabled == flag) {
      return res.status(200).send({
        success: false,
        message: flagMessage,
      });
    }
    await User.updateOne(
      { userId: userId },
      {
        is2FAenabled: flag,
      }
    );
    return res.status(200).send({
      success: true,
      message: flagMessage,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};
exports.getUserDetail = async (req, res) => {
  try {
    const { userId } = req.user;
    if (commonFunctions.checkBlank([userId])) {
      return res.status(400).send({
        success: false,
        message: "Bad Request",
      });
    }
    const user = await User.find({userId});
    if (!user) {
      return res.status(200).send({ success: true, message: "No User Found" });
    }
    return res.status(200).send({ success: true, message: "User detail found successfully",user });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};
