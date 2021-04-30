const fs = require("fs");
const csv = require("csv-parser");

exports.getErrorMessage = (
  emailValid,
  mobileValid,
  ticketDateValid,
  pnrValid,
  cabinValid
) => {
  var error = "";
  if (!emailValid) {
    error += "Email Invalid";
  }

  if (!mobileValid) {
    error += "Mobile Number Invalid";
  }

  if (!ticketDateValid) {
    error += "Ticketing Date is smaller than traval date.";
  }

  if (!pnrValid) {
    error += "PNR Invalid";
  }

  if (!cabinValid) {
    error += "Booked Cabin Invalid";
  }
  return error;
};

exports.validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

exports.validateMobile = (mobile) => {
  const re = /^\d{10}$/;
  return re.test(mobile);
};

exports.isTicketDateSmaller = (ticketingData, travelDate) => {
  var ticketDate = Date.parse(ticketingData);
  var travelDate = Date.parse(travelDate);
  return ticketDate < travelDate;
};

exports.validatePNR = (pnr) => {
  const regex = /^[a-zA-Z0-9]{6,}$/;
  return regex.test(pnr);
};

exports.validateBookedCabin = (cabin) => {
  var cabinList = ["economy", "premium economy", "business", "first"];
  return cabinList.includes(cabin.toLowerCase());
};

exports.getDiscountCode = (fareClass) => {
  if (/^[a-eA-E]+$/.test(fareClass)) {
    return "OFFER_20";
  }

  if (/^[f-kF-K]+$/.test(fareClass)) {
    return "OFFER_30";
  }

  if (/^[l-rL-R]+$/.test(fareClass)) {
    return "OFFER_25";
  }
};

exports.createFile = (file, path) => {
  var fileStream = fs.createWriteStream(path);
  return new Promise((resolve, reject) => {
    file.pipe(fileStream);

    file.on("end", (err) => {
      if (err) {
        reject();
        return;
      }
      resolve();
    });
  });
};

exports.readCsvData = (path) => {
  return new Promise((resolve, reject) => {
    var rows = [];
    var fileStream = fs.createReadStream(path).pipe(csv());

    fileStream.on("error", (err) => reject(err));

    fileStream.on("data", (row) => rows.push(row));

    fileStream.on("end", () => resolve(rows));
  });
};
