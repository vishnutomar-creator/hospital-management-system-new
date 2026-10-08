const EventEmitter = require("events");
class HMSEventEmitter extends EventEmitter {}
const eventEmitter = new HMSEventEmitter();
module.exports = eventEmitter;
