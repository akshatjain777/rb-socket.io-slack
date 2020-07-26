class Room {
  constructor(id, title, namespace, privateRoom = false) {
    this.id = id;
    this.title = title;
    this.namespace = namespace;
    this.privateRoom = privateRoom = false;
    this.history = [];
  }
  addMessage = (msg) => {
    this.history.push(msg);
  };
  clearHistory = () => {
    this.history = [];
  };
}

module.exports = Room;
