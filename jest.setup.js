const { crypto } = require("node:crypto");

if (!global.crypto) {
  global.crypto = crypto;
}
