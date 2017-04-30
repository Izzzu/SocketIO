class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }
    removeUser(id) {
        var user = this.getUser(id);
        if (user) {
            this.users = this.users.filter(u => u.id !== user.id);
        } return user;
    }

    getUser(id) {
        var user = this.users.filter(u => u.id === id)[0];
        return user;
    }

    getUserList(room) {
        var users = this.users.filter((u) => u.room === room);
        var namesArray = users.map(u => u.name);
        return namesArray;
    }

}

module.exports = {Users};
