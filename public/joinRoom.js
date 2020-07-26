const joinRoom = (roomName) => {
  nsSocket.emit('joinRoom', roomName, (numMembers) => {
    document.querySelector(
      '.curr-room-num-users'
    ).innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span
    >`;
  });
  nsSocket.on('roomHistory', (history) => {
    const messagesUl = document.getElementById('messages');
    messagesUl.innerHTML = '';
    history.forEach((data) => {
      const newMsg = buildHTML(data);
      const currentMessages = messagesUl.innerHTML;
      messagesUl.innerHTML = currentMessages + newMsg;
    });
    messagesUl.scrollTo(0, messagesUl.scrollHeight);
  });
  nsSocket.on('updateMembers', (numMembers) => {
    document.querySelector(
      '.curr-room-num-users'
    ).innerHTML = `${numMembers} Users <span class="glyphicon glyphicon-user"></span
    >`;
    document.querySelector('.curr-room-text').innerText = roomName;
  });

  const searchBox = document.getElementById('search-box');
  searchBox.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase();
    const messages = document.querySelectorAll('.message-text');
    messages.forEach((message) => {
      if (message.innerText.toLowerCase().indexOf(searchText) === -1) {
        message.parentElement.parentElement.style.display = 'none';
      } else {
        message.parentElement.parentElement.style.display = 'block';
      }
    });
  });
};
