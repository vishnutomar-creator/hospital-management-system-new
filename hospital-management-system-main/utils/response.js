const sendResponse = (res, statusCode, message, data = null, meta = null) => {
  const responsePayload = {
    success: statusCode >= 200 && statusCode < 300,
    message,
  };

  if (data !== null) {
    responsePayload.data = data;
  }

  if (meta !== null) {
    responsePayload.meta = meta;
  }

  return res.status(statusCode).json(responsePayload);
};

module.exports = {
  sendResponse,
};
