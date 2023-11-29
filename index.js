
// Import Module--------------------------------------------------------------------------------------------------------------------------------------------------------------------
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
let bodyParser = require('body-parser');
const { nanoid } = require('nanoid');
const mongoose = require('mongoose');
const mongoUri = require('./Info');

// Mongoose Connect-----------------------------------------------------------------------------------------------------------------------------------------------------------------
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

// Page Display, Access, Tools and Server-------------------------------------------------------------------------------------------------------------------------------------------
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(bodyParser.urlencoded({extended: false}))
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

//Schema and Model Creation---------------------------------------------------------------------------------------------------------------------------------------------------------------------

//SCHEMA Creation
const Schema = mongoose.Schema;

//User Schema
const userSchema = new Schema({
  username: {type: String, required: true},
  // count: {type: Number, default : 0},
  _id: {type: String, required: true},
  log: [
    {
      description: {type: String},
      duration: {type: Number},
      date: {type: String},
    }
  ],
})

//Model Creation
let User = mongoose.model("User", userSchema);


//Reset DB Collection----------------------------------------------------------------------------------------------------------------------------------------------------------------
User.deleteMany({})
  .then(result => {
    console.log(`${result.deletedCount} document(s) deleted`);
  })
  .catch(error => {
    console.error('Error clearing documents:', error);
  });

//END POINT--------------------------------------------------------------------------------------------------------------------------------------------------------------------------


//POST - To Create User
app.post('/api/users', function (req, res) {
  try {
    let username = req.body['username'];
    const id = nanoid(24);
    
    User.create({
      username: username,
      _id: id,
    })
    
    res.json({
        username: username,
        _id: id,
      })
    
    } catch (err) {
      console.log(err);
      res.json({ error: 'Failed add new user' });
    }
});


//GET - Get All List of Users
app.get('/api/users', async function (req, res) {
  try {
    let getAllUser = await User.find({});
    let allUser= getAllUser.map(data => ({
      username: data['username'],
      _id: data['_id'],
    }));
    res.json(allUser);
  } catch (err) {
    console.log(err);
    res.json({ error: 'Failed to get list of users' });
  }
})


//POST - Input Exercise
app.post('/api/users/:_id/exercises', async function (req, res) {
  try {
    let desc = req.body['description'];
    let dur = req.body['duration'];
    let datePosted = req.body['date'];
    let listOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    let listOfMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let date;

    let options = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',      
    };

    let formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = formatter.format(date);
    const formattedDateWithoutCommas = formattedDate.replace(/,/g, '');

    let dates = new Date();

    if (!datePosted) {
      let requestDate = new Date();
      let rawdate = formatter.format(requestDate);
      let dateFormat = rawdate.replace(/,/g, '');
      const [weekday, month, day, year] = dateFormat.split(' ');
      date =`${weekday} ${month.padStart(2, '0')} ${day.padStart(2, '0')} ${year}`;
    } else {
      let requestDate = new Date(datePosted);
      let rawdate = formatter.format(requestDate);
      dateFormat = rawdate.replace(/,/g, '');
      const [weekday, month, day, year] = dateFormat.split(' ');
      date =`${weekday} ${month.padStart(2, '0')} ${day.padStart(2, '0')} ${year}`;
    }

    // if (!datePosted) {
    //   let requestDate = new Date();
    //   let getDay = requestDate.getDay();
    //   let getMonth = requestDate.getMonth();  
    //   date = `${listOfDays[getDay]} ${listOfMonth[getMonth]} ${requestDate.getDate()} ${requestDate.getFullYear()}`
    // } else {
    //   let requestDate = new Date(datePosted);
    //   let getDay = requestDate.getDay();
    //   let getMonth = requestDate.getMonth();  
    //   date = `${listOfDays[getDay]} ${listOfMonth[getMonth]} ${requestDate.getDate()} ${requestDate.getFullYear()}`
    // }  

    let id = req.params._id;

    //Updated Fields with $push method
    let exercises = {
          date: date,
          duration: parseInt(dur),
          description: desc
        };

      let selectedUser = await User.findById(id);

      selectedUser.update({$push : { log : exercises }}, function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
          })

      res.json({
        username: selectedUser['username'],
        description: desc,
        duration: parseInt(dur),
        date: date,
        _id: id,
      })
    } catch (err) {
      console.log(err)
      return res.json({error: "Fail The Try Code"})
  }
})

// GET - User's Log
app.get('/api/users/:_id/logs', async function (req, res) {
  try {
    let from = req.query.from;
    let to = req.query.to;
    let limit = req.query.limit;
    let id = req.params._id;

    let selectedUser = await User.findById(id);
    let listOfLogs = selectedUser['log'];

    let filteredLog = listOfLogs;

      // Log Filter - From, To, Limit
      if (from) {
        filteredLog = listOfLogs.filter(data => new Date(data.date) > new Date(from));
      }

      if (to) {
        filteredLog = listOfLogs.filter(data => new Date(data.date) < new Date(to));
      }

      if (limit) {
        filteredLog = listOfLogs.slice(0,parseInt(limit,10));
      }

      res.json({
        username: selectedUser['username'],
        count: selectedUser['log'].length,
        _id: id,
        log: filteredLog,
      });


    } catch {
      console.error()
      return res.json({error: "Fail The Try Code"})
    }
})
