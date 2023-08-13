const currentCtrl = async (req, res, next) => {
  const { username, email, subscription } = req.user;
  res.json({
    status: "success",
    code: 200,
    data: {
      message: `Authorization was successful: ${username}`,
      email: email,
      subscription: subscription
    },
  });
};

module.exports = currentCtrl;
