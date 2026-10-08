const emailService = require("../services/email.service");

const sendBatchEmails = async (emailList) => {
  try {
    if (!Array.isArray(emailList) || emailList.length === 0) {
      return { sent: 0 };
    }

    let count = 0;
    for (const item of emailList) {
      if (item.to && item.subject && item.text) {
        await emailService.sendEmail(item.to, item.subject, item.text, item.html);
        count++;
      }
    }

    return { sent: count };
  } catch (error) {
    console.error("Error processing email job:", error);
    throw error;
  }
};

module.exports = {
  sendBatchEmails,
};
