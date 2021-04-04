const generateMessage = (username, text) => {
  return {
    username: username,
    message: text,
    createdAt: new Date(),
  };
};

const generateLocationMessage = (username, url) => {
  return {
    username,
    url: url,
    createdAt: new Date(),
  };
};

module.exports = {
  generateMessage: generateMessage,
  generateLocationMessage: generateLocationMessage,
};
