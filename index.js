const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
let bodyParser = require('body-parser');
const { nanoid } = require('nanoid');

app.use(bodyParser.urlencoded({extended: false}))

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let logs = [];

app.post('/api/users', function (req, res) {
  let username = req.body['username'];
  const id = nanoid(24);
  logs.push({
    username: username,
    _id: id,
    log: [],
  });
  res.json({
    username: username,
    _id: id,
  });
})

app.get('/api/users', function (req, res) {
  let listOfUser = logs.map(data => ({
    username: data['username'],
    _id: data['_id'],
  }));
  res.json(listOfUser);
})

app.post('/api/users/:_id/exercises', function (req, res) {
  let desc = req.body['description'];
  let dur = req.body['duration'];
  let datePosted = req.body['date'];
  let listOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  let listOfMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let date;
  
  if (!datePosted) {
    let requestDate = new Date();
    let getDay = requestDate.getDay();
    let getMonth = requestDate.getMonth();  
    date = `${listOfDays[getDay]} ${listOfMonth[getMonth]} ${requestDate.getDate()} ${requestDate.getFullYear()}`
  } else {
    let requestDate = new Date(datePosted);
    let getDay = requestDate.getDay();
    let getMonth = requestDate.getMonth();  
    date = `${listOfDays[getDay]} ${listOfMonth[getMonth]} ${requestDate.getDate()} ${requestDate.getFullYear()}`
  }  

  let id = req.params._id;

  let selectedData = logs.filter(data => data['_id'] === id);

  let index = logs.findIndex(data => data['_id'] === id);

  logs[index]['log'].push({
    date: date,
    duration: parseInt(dur),
    description: desc,
  });

  res.json({
    username: selectedData[0]['username'],
    description: desc, 
    date: date,
    duration: parseInt(dur),  
    "_id": id,
  })
})

app.get('/api/users/:_id/logs', function (req, res) {
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;
  let id = req.params._id;
  let selectedData = logs.filter(data => data["_id"] === id);
  let listOfLogs = selectedData[0]['log'];
  
  let filteredLog = listOfLogs

  if (from) {
    filteredLog = filteredLog.filter(data => new Date(data.date) > new Date(from));
  }

  if (to) {
    filteredLog = filteredLog.filter(data => new Date(data.date) < new Date(to));
  }

  if (limit) {
    filteredLog = filteredLog.slice(0,parseInt(limit,10));
  }

  res.json({
    username: selectedData[0]['username'],
    count: selectedData[0]['log'].length,
    "_id": id,
    log: filteredLog,
  });
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
