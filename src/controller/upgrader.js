const converter = require("json-2-csv");
const fs = require("fs");
const Path = require("path");
const {
  getErrorMessage,
  getDiscountCode,
  isTicketDateSmaller,
  validateBookedCabin,
  validateEmail,
  validateMobile,
  validatePNR,
  createFile,
  readCsvData,
} = require("./upgrader_impl");

upgrader = async (request, h) => {
  const data = request.payload;
  console.log(data);
  if (!data.file) {
    return { status: "File is missing." };
  }

  const name = data.file.hapi.filename;
  const path = Path.join(__dirname, "../../public/files/", name);
  await createFile(data.file, path);

  var rows = await readCsvData(path);

  var hasError = false;

  var updatedRows = rows.map((row) => {
    var newRow = row;
    var isEmailValid = validateEmail(row.Email);
    var isMobileValid = validateMobile(row.Mobile_phone);

    var isTicketDateSmallerValid = isTicketDateSmaller(
      row.Ticketig_date,
      row.Travel_date
    );
    var isPNRValid = validatePNR(row.PNR);

    var isBookedCabinValid = validateBookedCabin(row.Booked_cabin);

    if (
      isEmailValid &&
      isMobileValid &&
      isTicketDateSmallerValid &&
      isPNRValid &&
      isBookedCabinValid
    ) {
      hasError = false;
      newRow.Discount_code = getDiscountCode(row.Fare_class);
    } else {
      hasError = true;
      newRow.Error = getErrorMessage(
        isEmailValid,
        isMobileValid,
        isTicketDateSmallerValid,
        isPNRValid,
        isBookedCabinValid
      );
    }
    return newRow;
  });

  updatedRows = updatedRows.map((urow) => {
    if (hasError) {
      urow.Error = urow.Error ?? "";
      delete urow.Discount_code;
    } else {
      delete urow.Error;
    }
    return urow;
  });

  var csvData = await converter.json2csvAsync(updatedRows);
  var rootDir = Path.join(__dirname, "../../public/files/", "outCsv.csv");
  fs.writeFileSync(rootDir, csvData);

  return {
    status: hasError ? "Failed" : "Success",
    message: "Find More Details on the file.",
    fileLink: "http://localhost:3000/files/outCsv.csv",
  };
};

exports.upgrader = upgrader;
