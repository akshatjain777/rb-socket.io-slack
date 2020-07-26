const joinNs = (endpoint) => {
  if (nsSocket) {
    nsSocket.close();
    document
      .getElementById('user-input')
      .removeEventListener('submit', formSubmission);
  }
  nsSocket = io(`http://localhost:9000${endpoint}`);
  nsSocket.on('nsRoomLoad', (nsRooms) => {
    const roomList = document.querySelector('.room-list');
    roomList.innerHTML = '';
    nsRooms.forEach((room) => {
      let glyph = 'globe';
      if (room.privateRoom) {
        glyph = 'lock';
      }
      roomList.innerHTML += `<li class="room">
      <span class="glyphicon glyphicon-${glyph}"></span>${room.title}
    </li>`;
    });

    const roomNodes = document.querySelectorAll('.room');
    roomNodes.forEach((room) => {
      room.addEventListener('click', (e) => {
        joinRoom(e.target.innerText);
      });
    });

    const topRoomName = document.querySelector('.room').innerText;
    joinRoom(topRoomName);
  });

  nsSocket.on('newMessage', (data) => {
    document.getElementById('messages').innerHTML += buildHTML(data);
  });

  document
    .querySelector('.message-form')
    .addEventListener('submit', formSubmission);
};

const formSubmission = (event) => {
  event.preventDefault();
  const newMessage = document.getElementById('user-message').value;
  document.getElementById('user-message').value = '';
  nsSocket.emit('newMessage', { text: newMessage });
};

const buildHTML = (data) => {
  const convertedDate = new Date(data.time).toLocaleTimeString();
  const newHTML = `
      <li>
        <div class="user-image">
          <img src="${data.avatar}" />
        </div>
        <div class="user-message">
          <div class="user-name-time">${data.username} <span>${convertedDate}</span></div>
          <div class="message-text">${data.text}</div>
        </div>
      </li>
    `;
  return newHTML;
};
