const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
class Test
{
    constructor()
    {

    }

    answer(ans)
    {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = ans;
        synth.speak(utterance);
    }

}

module.exports = Test;
