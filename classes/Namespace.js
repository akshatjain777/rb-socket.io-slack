class Namespace {
  constructor(id, title, imageUrl, endpoint) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.endpoint = endpoint;
    this.rooms = [];
  }

  addRoom(room) {
    this.rooms.push(room);
  }
}

module.exports = Namespace;
