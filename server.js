const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const url = process.env.DB_URL
const urlName = process.env.DB_NAME
const PORT = process.env.PORT || 3030


var db, collection;

// const url = "mongodb+srv://tamika:three@cluster0.x4j46.mongodb.net/todo?retryWrites=true&w=majority"
// const dbName = "todo";

app.listen(PORT, () => {
  MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(urlName);
    console.log("Connected to `" + urlName + "`!");
  });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
      db.collection('tasks').find().toArray((err, result) => {
        if (err) return console.log(err)
        db.collection('tasks').count({}, function(error, totalcount) {
          res.render('index.ejs', {
            tasks: result,
            total: totalcount
          })
        })
      })
    })



    app.post('/tasks', (req, res) => {
      db.collection('tasks').insertOne({
        task: req.body.task,
        completed: false
      }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database', req.body, result)
        res.redirect('/')
      })
    })

    app.put('/tasks', (req, res) => {
      db.collection('tasks')
        .findOneAndUpdate({
          task: req.body.task,
          completed: req.body.completed
        }, {
          $set: {
            completed: !req.body.completed
          }
        }, {
          sort: {
            _id: -1
          },
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })
    })

    //erase one
    app.delete('/singleTasks', (req, res) => {
      db.collection('tasks').findOneAndDelete({
        task: req.body.task,
        completed: req.body.completed
      }, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

    //erase all
    app.delete('/tasks', (req, res) => {
      db.collection('tasks').deleteMany({})
      res.send('tasks cleared')
    })

    //erase completed
    app.delete('/tasksCompleted', (req, res) => {
      db.collection('tasks').findOneAndDelete({
        completed: true
      }, (err, result) => {
        console.log(result);
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })
