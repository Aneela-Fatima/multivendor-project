// create token and save that in cookies
const sendShopToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  //options for cookies
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.status(statusCode).cookie("seller-token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendShopToken;