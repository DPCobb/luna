const express = require('express');
const app = express();
const bodyParser = require("body-parser");
require('dotenv').config()
var childProc = require('child_process');
let currentLocation
const WeatherAPI = require('./classes/weather.js')
const {Wit, log} = require('node-wit');
const fetch = require('node-fetch');
const client = new Wit({
  accessToken: process.env.WIT_API,
  logger: new log.Logger(log.DEBUG) // optional
});


app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images
app.use(bodyParser())

const server = app.listen(5000);
app.get('/', (req, res) => {
  res.sendFile('index.html');
});
const io = require('socket.io')(server);
const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

function getApp(data){
    return data.open[0].value
}

const handleMessage = ({entities}) => {
  const weather = firstEntityValue(entities, 'weather');
  const greetings = firstEntityValue(entities, 'greetings');
  const thanks = firstEntityValue(entities, 'thanks');
  const open = firstEntityValue(entities, 'open');
  const state = firstEntityValue(entities, 'state');
  const sayhello = firstEntityValue(entities, 'sayhello');
  const search = firstEntityValue(entities, 'search');

  if (weather) {
     const Weather = require('./classes/weather')
     let weather = new Weather(currentLocation)
     weather.getWeather(io)
} else if (greetings && !entities.sayhello) {
    let message_options = [
    	"What do you want human?",
    	"Hello.",
        "Yes, I'm listening...",
        "Hi! How can I help?",
        "Hey, what's up!",
        "Yes, tell me! What are you looking for?",
    	"What's up?"
	]
	var random_index = Math.floor(Math.random() * message_options.length)
	var chosen_message = message_options[random_index]

io.emit('bot reply', chosen_message)
  }
  else if (thanks){
      io.emit('bot reply', 'You\'re Welcome.')
  }
  else if(open){
      io.emit('bot reply', 'Ok, I\'ll open that for you.')
      let app = getApp(entities)
      if(app == 'G edit'){
          app = 'gedit'
      }
      else{
         app = app.replace(/\s+/g, '-').toLowerCase()
      }
      console.log(app)
      childProc.exec(app)
  }
  else if(state){
      let Wemo = require('./classes/wemo')
      let wemo = new Wemo(entities.wemo[0].entities.light[0].value, entities.state[0].value)
      wemo.light()
  }
  else if (sayhello){
      if(entities.person[0].value == 'michele'){
          io.emit('bot reply', 'Hello Michelle, can I come visit you?')
      }
  }
  else if (search){
      let term = entities.term[0].value
      let url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch='
      url = url + term
      url = url.replace(/\s+/g,'%20')
      console.log(url)
      fetch(url).then((resp)=>resp.json())
      .then(function(data){
          let out = JSON.stringify(data)
          let answer = data.query.search[0].snippet
          answer = answer.replace(/<\/?span[^>]*>/g,"")
          console.log(answer)
         io.emit('bot reply', answer )
           }).catch(function(error) {
          console.log(error);
        })

  }
};

io.on('connection', function(socket){
  console.log('a user connected');
});
io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    client.message(text, {})
      .then((data) => {
          let answer = handleMessage(data)
          answer = JSON.stringify(answer)
          //socket.emit('bot reply', answer)
      })
      .catch(console.error);

  });
  socket.on('location', (data)=>{
      currentLocation = data
  })
});
