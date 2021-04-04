const users = [];

const addUsers = ({ id, username, room }) => {
  if (!username || !room) {
    return {
      error: "Please enter values for username and room.",
    };
  }

  //Clean data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  const existingUser = users.find((user) => {
    return user.username === username && user.room === room;
  });

  if (existingUser) {
    return {
      error: "The user already exists!!!",
    };
  }

  const user = { id, username, room };

  users.push(user);

  return {
    user,
  };
};

const deleteUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index != -1) {
    return users.splice(index, 1)[0];
  } else {
    return {
      error: "User not found!!",
    };
  }
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
  const usersList = users.filter((user) => user.room === room);
  return usersList;
};

module.exports = {
  addUsers,
  deleteUser,
  getUser,
  getUsersInRoom,
};
