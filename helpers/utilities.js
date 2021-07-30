/** @format */

// create random string Number
exports.createRandomNumber = (strlength) => {
  let len;
  len = typeof strlength === 'number' && strlength > 0 ? strlength : false;
  if (len) {
    let output = '';
    const possibleChar = '123456789';
    for (let i = 0; i < len; i++) {
      let currentRandomString = possibleChar.charAt(
        Math.floor(Math.random() * possibleChar.length)
      );
      output += currentRandomString;
    }
    return output;
  }
  return len;
};

//  steram and buffer to convert inot the base64

// function to encode file data to base64 encoded string
exports.toaBase64 = (file) => {
  //convert binary data to base64 encoded string
  return Buffer.from(file).toString('base64');
};
