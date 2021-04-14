
class Users {
  static users = {};

  static add(userName, count) {
    if (!this.users.hasOwnProperty(userName)) {
      this.users[userName] = count;
    } else {
      throw Error(`${userName} already exists`);
    }
  }

  static  remove(userName) {
    if (this.users.hasOwnProperty(userName)) {
      delete this.users[userName];
    } else {
      throw Error(`${userName} does not exist`);
    }
  }

  static get(userName) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.users.hasOwnProperty(userName)) {
          resolve(this.users[userName]);
        } else {
          reject(`${userName} already exists`);
        }
      }, 100);
    });
  }
}

module.exports=Users;