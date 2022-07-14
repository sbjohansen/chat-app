//references

const loginForm = document.querySelector('#welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');

var userName = '';
var messages = [];
const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));

//functions

const login = (e) => {
    e.preventDefault();
    if (userNameInput.value.length > 0) {
        userName = userNameInput.value;
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
        addMessageForm.classList.add('show');
        socket.emit('join', userName);
    } else {
        alert('Please enter a username');
    }
};

function sendMessage(e) {
    e.preventDefault();

    let messageContent = messageContentInput.value;

    if (!messageContent.length) {
        alert('You have to type something!');
    } else {
        addMessage(userName, messageContent);
        socket.emit('message', { author: userName, content: messageContent });
        messageContentInput.value = '';
    }
}

function addMessage(author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if (author === userName) {
        message.classList.add('message--self');
    }
    message.innerHTML = `
        <h3 class="message__author">${userName === author ? 'You' : author}</h3>
        <div class="message__content">
        ${content}
        </div>
    `;
    messagesList.appendChild(message);
}

//event listeners

loginForm.addEventListener('submit', (e) => login(e));
addMessageForm.addEventListener('submit', (e) => sendMessage(e));
