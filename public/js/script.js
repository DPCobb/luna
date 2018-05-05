const socket = io();
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
navigator.geolocation.getCurrentPosition(position)
let currentPos
function position(loc){
    let current = 'lat='+loc.coords.latitude + '&lon=' + loc.coords.longitude
    currentPos = current
    socket.emit('location', currentPos)
}

document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('result', (e) => {
  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  console.log('Confidence: ' + e.results[0][0].confidence);
  console.log(e.results[last][0].transcript);


  // We will use the Socket.IO here later…
  socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});
function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {
  synthVoice(replyText);

  if(replyText == '') replyText = '(No answer...)';
  //outputBot.textContent = replyText;
});
