const { Enter } = require('../models/user_entry');
const { Totals } = require('../models/totals');
const { UserProfile } = require("../models/User_Profile");

const playOne = async (entry) => {
  console.log(entry);
  const new_entry = new Enter(entry);
  await new_entry.save();
  const totals = await Totals.findOne({ totals: "all" });
  totals.thisWeek += 1;
  totals.balance += 1;
  await totals.save();
  await UserProfile.findOneAndUpdate({ handle: entry.user }, { $inc: {tickets: 1} });
}

const playTen = async (entry) => { 
  console.log(entry);
  const username = [
    entry,
    entry,
    entry,
    entry,
    entry,
    entry,
    entry,
    entry,
    entry,
    entry
  ];
  Enter.insertMany(username);
  const totals = await Totals.findOne({ totals: "all" });
  totals.thisWeek += 8;
  totals.balance += 8;
  await totals.save();
  await UserProfile.findOneAndUpdate({ handle: entry.user }, { $inc: {tickets: 8} });
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
    const winAmount = totals.thisWeek*0.8;
    let updated_user = await UserProfile.findOneAndUpdate({ handle: winnerObject.user }, { won: true, $inc: {winnings: winAmount} },{ new: true });
  
    //reset db
    totals.all += totals.thisWeek;
    totals.charity += 0.1*totals.thisWeek;
    totals.profit += 0.1*totals.thisWeek;
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