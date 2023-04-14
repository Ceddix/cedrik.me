/*var socket;
if (window.location.host.indexOf('localhost') === -1) {
    socket = io('https://ceddix.de');
} else {
    socket = io('http://localhost:3000');
};

socket.on('connect', () => {
   console.log('Connected')
});

socket.on('lanyard-data', (lanyardData) => {
    console.log(lanyardData);
    lanyardData = JSON.parse(lanyardData)
    document.getElementById('listening_to_spotify').innerHTML = lanyardData.data.listening_to_spotify ? 'Ja' : 'Nein';
});*/

// Calculate Age
const getAge = (birthDateString) => {
  const today = new Date();
  const birthDate = new Date(birthDateString);

  const yearsDifference = today.getFullYear() - birthDate.getFullYear();

  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    return yearsDifference - 1;
  }

  return yearsDifference;
};

// Typing Effect
let textLength = 0;
let text = 'Hi, I\'m Cedrik! I\'m a ' + getAge('2005-10-22') + ' y/o student from Belgium!';

function type() {
    let textChar = text.charAt(textLength++);
    let paragraph = document.getElementById("typed");
    let charElement = document.createTextNode(textChar);
    paragraph.appendChild(charElement);
    if(textLength < text.length+1) {
        setTimeout('type()', 100);
    } else {
        text = '';
    }
}

document.addEventListener("DOMContentLoaded", () => setTimeout(function() {
	type();
}, 1000));