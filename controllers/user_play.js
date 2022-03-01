const { Enter } = require('../models/user_entry');
const { Totals } = require('../models/totals');
const { UserProfile } = require("../models/User_Profile");

const playOne = async (req, res) => {
  const newEntry = req.body;
  const new_entry = new Enter(newEntry);
  await new_entry.save();
  const totals = await Totals.findOne({ totals: "all" });
  totals.thisWeek += 1;
  await totals.save();
  return res.json({ success: true });
}

const playTen = async (req, res) => { 
  const username = [
    req.body,
    req.body,
    req.body,
    req.body,
    req.body,
    req.body,
    req.body,
    req.body,
    req.body,
    req.body
];
  Enter.insertMany(username);
  const totals = await Totals.findOne({ totals: "all" });
  totals.thisWeek += 8;
  await totals.save();
  return res.json({ success: true });
}

const getValues = async (req, res) => {
  try {
    const totals = await Totals.findOne({ totals: "all" });
    return res.json({ success: true, totals });
  } catch (error) {
    const errorMessage = `Getting totals error ${error}`;
    errorStatus(res, errorMessage);
  }
};

const drawWinner = async (req, res) => {
  //secure route with passKey
  const { drawPasskey } = require("../config/keys");
  const passKey = req.body.key;
  console.log(passKey);
  if (passKey == drawPasskey) {
    console.log('passKey correct');
    const totals = await Totals.findOne({ totals: "all" });

    //draw winner
    const winner = await Enter.aggregate([{ $sample: { size: 1 } }]);
    const winnerObject = await winner.shift();
    let updated_user = await UserProfile.findOneAndUpdate({ handle: winnerObject.user }, { won: true, $inc: {winnings: totals.thisWeek} },{ new: true });
  
    //reset db
    totals.all += totals.thisWeek;
    totals.charity += 0.1*totals.thisWeek;
    totals.thisWeek -= totals.thisWeek;
    await Totals.findOneAndUpdate({ totals: "all"}, { lastWinner: winnerObject.user },{ new: true });
    await totals.save();
    await Enter.deleteMany({  }).then(function(){
      console.log("Data deleted");
    }).catch(function(error){
      console.log(error);
    });
    return res.json({ success: true });

  } else {
    console.log('invalid passKey');
    return res.json({ success: false });
  }
};

module.exports = {
  playOne,
  playTen,
  getValues,
  drawWinner
}; 