<template>
  <div class="user-management view">
    <div class="user-title clearfix">
      <h3>用户管理</h3>
      <button class="add-btn" @click="handleAdd">新增</button>
    </div>
    <table id="user-table">
      <thead>
        <tr>
          <th>用户ID</th>
          <th>用户名</th>
          <th>邮箱</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in userList" :key="user.user_id">
          <td>{{ user.user_id }}</td>
          <td>{{ user.user_name }}</td>
          <td>{{ user.user_email }}</td>
          <td>
            <span @click="handleShowDialog(user)">编辑</span>
            <span @click="confirmDelete(user.user_id)">删除</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="showDialog" class="modal">
      <div class="modal-content">
        <span class="close" @click="showDialog = false">&times;</span>
        <h3>{{ isEditMode ? '编辑用户' : '新增用户' }}</h3>
        <label for="user_name">用户名:</label>
        <input type="text" v-model="selectedUser.user_name" id="user_name">
        <label for="user_email">邮箱:</label>
        <input type="email" v-model="selectedUser.user_email" id="user_email">
        <label for="user_password">密码:</label>
        <input type="password" v-model="selectedUser.user_password" id="user_password">
        <label for="user_sign">签名:</label>
        <input type="text" v-model="selectedUser.user_sign" id="user_sign">
        <label for="user_description">描述:</label>
        <input type="text" v-model="selectedUser.user_description" id="user_description">
        <button @click="saveUser">{{ isEditMode ? '保存' : '新增' }}</button>
      </div>
    </div>
    <div v-if="showDeleteConfirm" class="modal">
      <div class="modal-content">
        <span class="close" @click="showDeleteConfirm = false">&times;</span>
        <h3>确认删除</h3>
        <p>您确定要删除此用户吗？</p>
        <button @click="deleteUser">确认</button>
        <button @click="showDeleteConfirm = false">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllUsers, updateUser, deleteUser, addUser } from '@/api/api';

export default {
  data() {
    return {
      userList: [],
      showDialog: false,
      showDeleteConfirm: false,
      selectedUser: {
        user_id: '',
        user_name: '',
        user_email: '',
        user_password: '',
        user_sign: '',
        user_description: ''
      },
      userIdToDelete: null,
      isEditMode: false
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      getAllUsers().then(res => {
        this.userList = res.data.data;
      });
    },
    handleShowDialog(user) {
      if (user) {
        this.selectedUser = { ...user };
        this.isEditMode = true;
      } else {
        this.selectedUser = {
          user_id: '',
          user_name: '',
          user_email: '',
          user_password: '',
          user_sign: '',
          user_description: ''
        };
        this.isEditMode = false;
      }
      this.showDialog = true;
    },
    saveUser() {
      if (this.isEditMode) {
        updateUser(this.selectedUser);
      } else {
        addUser(this.selectedUser);
      }
      this.showDialog = false;
      this.getUsers();
    },
    confirmDelete(userId) {
      this.userIdToDelete = userId;
      this.showDeleteConfirm = true;
    },
    deleteUser() {
      deleteUser(this.userIdToDelete).then(res => {
        this.getUsers();
      });
      this.showDeleteConfirm = false;
    },
    handleAdd() {
      this.handleShowDialog(null);
    }
  }
};
</script>

<style scoped>
.user-title h3 {
  display: inline-block;
}

.add-btn {
  float: right;
  width: 80px;
  border-radius: 5px;
  background: #33b7ff;
  font-size: 14px;
  color: #fff;
  border: 1px solid transparent;
  cursor: pointer;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table tr th,
td {
  padding: 20px;
  line-height: 1.6;
  border-bottom: 1px solid #ddd;
}

table tr th {
  text-align: left;
  border-bottom: 2px solid #ddd;
}

table tr:first-child th {
  border-top: 0;
}

table tr td:not(:first-child),
th:not(:first-child) {
  text-align: center;
}

.user-management table tr td span,
a {
  font-size: 12px;
  color: #1296db;
  padding: 8px;
  cursor: pointer;
}

table tr td span:not(:first-child) {
  border-left: 1px solid #ddd;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: modalOpen 0.4s;
}

@keyframes modalOpen {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

label {
  display: block;
  margin-top: 10px;
}

input[type='text'],
input[type='email'],
input[type='password'] {
  width: calc(100% - 20px);
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #33b7ff;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #1e90ff;
}

button + button {
  margin-left: 10px;
}
</style>
