const request = require("request");
const moment = require('moment');
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.checkBlank = function (arr) {
  if (!Array.isArray(arr)) {
    return 1;
  }
  var arrlength = arr.length;
  for (var i = 0; i < arrlength; i++) {
    if (arr[i] === undefined || arr[i] == null) {
      arr[i] = "";
    } else {
      arr[i] = arr[i];
    }
    arr[i] = arr[i].toString().trim();
    if (arr[i] === "" || arr[i] === "" || arr[i] === undefined) {
      return 1;
    }
  }
  return 0;
};

exports.generateRandomStringAndNumbers = function (len) {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

exports.generateOtp = function (len) {
  var text = "";
  var possible = "0123456789";
  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

exports.addDays = function (days) {
  var newDate = new Date();
  newDate.setTime(newDate.getTime() + 86400000 * days); // add a date
  newDate.setHours(23, 59, 59, 999);
  return new Date(newDate);
};

exports.handleValidation = function (err) {
  const messages = [];
  for (let field in err.errors) {
    return err.errors[field].message;
  }
  return messages;
};

exports.sendHttpRequest = function (opts) {
  var options = opts.options;
  return new Promise((resolve, reject) => {
    console.log("HTTP_REQUEST:", options);
    request(options, (error, response, body) => {
      if (error) {
        console.log("Error from external server", error);
        return reject(error);
      }
      if (response == undefined) {
        error = new Error("No response from external server");
        return reject(error);
      }
      if (response.statusCode < "200" || response.statusCode > "299") {
        console.log("http-----", body);
        error = new Error("Couldn't request with external server ");
        error.code = response.statusCode;
        return reject(error);
      }
      console.log("Response from external server", response, body);
      return resolve(body);
    });
  });
};
exports.sendEmail = function (options) {
  return new Promise((resolve, reject) => {
    const msg = {
      to: options.sendTo, // Change to your recipient
      from: "vikas.gupta@grazitti.com", // Change to your verified sender
      subject: options.subject,
      text: "Welcome page",
      html: options.html,
    };
    sgMail
      .send(msg)
      .then(() => {
        resolve("Email Send");
      })
      .catch((error) => {
        console.log("something went wrong", error);
        reject(error);
      });
  });
};
exports.get_time_diff = function (startdate, endDate, returnType) {
  endDate = moment(endDate);//now
  startdate = moment(startdate);
  // Return type should be 'minutes','days','weeks','hours'
  return startdate.diff(endDate, returnType)
};
