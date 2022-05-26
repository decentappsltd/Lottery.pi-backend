const axios = require("axios");
const axiosPi = axios.create({
  baseURL: "https://api.minepi.com",
  timeout: 20000,
});
const { piAuthToken } = require("../config/keys");
const { playOne, playTen } = require("./user_play.js"); 

const config = {
  headers: {
    'Authorization': `Key ${piAuthToken}`,
  },
};

const paymentApprove = async (req, res) => {
  const paymentId = req.body.paymentId;
  const responseFromPi = await axiosPi.post(`/v2/payments/${paymentId}/approve`, {}, config);
  res.status(200);
};

const paymentComplete = async (req, res) => {
  const paymentId = req.body.paymentId;
  const txid = req.body.txid;
  const responseFromPi = await axiosPi.post(`/v2/payments/${paymentId}/complete`, {txid}, config);
  const entry = req.body.entry;
  if (req.body.amount === "1") {
    await playOne(entry);
  } else if (req.body.amount === "8") {
    await playTen(entry);
  } else {
    return res.json({ success: false });
  }
  return res.json({ success: true });
};


const paymentIncomplete = async (req, res) => {
  const paymentId = req.body.paymentId;
  const txid = req.body.txid;
  const responseFromPi = await axiosPi.post(`/v2/payments/${paymentId}/complete`, {txid}, config);
  res.status(200);
};

module.exports = {
  paymentApprove,
  paymentComplete,
  paymentIncomplete
};