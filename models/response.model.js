/**
 *
 * @param {String} type
 * @param {String} message
 * @param {Object} data
 * @param {Object} displayMessage
 * @param {Number} code
 * @returns {Object} Response Object {code: number, message: string, data: any, displayMessage: any}
 */


exports.Response = (type, message, data, displayMessage, code) => {
    let defaultCode = type == "success" ? 200 : 500;
    return {
      code: code || defaultCode,
      message,
      data,
      displayMessage,
    };
  };