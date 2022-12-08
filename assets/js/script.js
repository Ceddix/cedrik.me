let textLength = 0;
let text = 'Hi, I\'m Cedrik! I\'m a 17 y/o student from Belgium!';

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
};

document.addEventListener("DOMContentLoaded", setTimeout(function() {
	type();
}, 1000));