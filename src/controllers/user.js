const getIndex = (req, res) => {
  return res.status(200).json({
    message: "Users GET root",
  });
};
const postIndex = (req, res) => {
  return res.status(200).json({
    message: "POST request to user root",
  });
};
module.exports = {
  getIndex: getIndex,
  postIndex: postIndex,
};
