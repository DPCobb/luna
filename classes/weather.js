require('dotenv').config()
const request = require('request');
const fetch = require('node-fetch');
const io = require('socket.io')
class Weather
{
    constructor(location)
    {
        this.currentLocation = location
        require('dotenv').config()
        const request = require('request');
        const fetch = require('node-fetch');
    }

    getWeather(ioOut)
    {
        const io = ioOut
        let url = 'http://api.openweathermap.org/data/2.5/weather?'+this.currentLocation+'&units=imperial&APPID='+process.env.WEATHER_API
        let ans =''
       fetch(url)
        .then((resp)=>resp.json())
        .then(function(data){
            console.log(data)
           let ans = 'It is '+data.main.temp+' degrees and the current conditions are '+data.weather[0].description
           io.emit('bot reply', ans)
             })
       .catch(function(error) {
      console.log(error);
  })
}
    weather()
    {
        this.getWeather()
        console.log(this.answer)
        return this.answer
    }
}

module.exports = Weather;
