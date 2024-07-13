const fs = require('fs');
const path = require('path');

// 读取并解析 JSON 文件
const getUserData = () => {
  const dataPath = path.join(__dirname, 'data/user_info.json');
  const jsonData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(jsonData).RECORDS;
};

// 写入 JSON 文件
const writeUserData = (data) => {
    const dataPath = path.join(__dirname, 'data/user_info.json');
    fs.writeFileSync(dataPath, JSON.stringify({ RECORDS: data }, null, 2), 'utf8');
  };
  

// 验证用户凭据
const validateUser = (userName, userPassword) => {
  const users = getUserData();
  return users.find(u => u.user_name === userName && u.user_password === userPassword);
};

// 注册新用户
const registerUser = (newUser) => {
  const users = getUserData();
  const existingUser = users.find(u => u.user_name === newUser.user_name);

  if (existingUser) {
    return false;
  }
  // 获取users 最后一个元素的user_id。自增
  const lastId = users[users.length - 1].user_id;
  newUser.user_id = (parseInt(lastId) + 1) + "";

  // 添加新用户
  users.push(newUser);
  writeUserData(users);
  return true;
};

// 根据用户ID获取用户
const getUserById = (userId) => {
  const users = getUserData();
  return users.find(user => user.user_id == userId);
};

// 获取所有用户
const getAllUsers = () => {
  return getUserData();
};

// 更新用户信息
const updateUserById = (userId, newUserInfo) => {
  const users = getUserData();
  const userIndex = users.findIndex(user => user.user_id == userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...newUserInfo };
    writeUserData(users);
    return true;
  }
  return false;
};

// 删除用户
const deleteUserById = (userId) => {
  const users = getUserData();
  console.log(userId);
  const userIndex = users.findIndex(user => user.user_id == userId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    writeUserData(users);
    return true;
  }
  return false;
};

module.exports = {
  validateUser,
  registerUser,
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUserById
};
