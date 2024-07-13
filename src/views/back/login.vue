<template>
    <div class="wrapper">
      <div class="background"></div>
      <ul class="bg-bubbles">
        <li v-for="n in 10" :key="n + 'n'"></li>
      </ul>
      <form class="login-main">
        <h3>{{ isLoginMode ? '博客管理登陆' : '博客管理注册' }}</h3>
        <input type="text" placeholder="用户名" v-model="username" />
        <input type="password" placeholder="密码" v-model="password" @keyup.enter="handleSubmit" />
        <p v-if="!isLoginMode">
          <input type="password" placeholder="确认密码" v-model="confirmPassword" />
        </p>
        <p>{{ loginMsg + `&nbsp;` }}</p>
        <button @click.prevent="handleSubmit">{{ isLoginMode ? '登陆' : '注册' }}</button>
        <p>
          <a href="#" @click.prevent="toggleMode">{{ isLoginMode ? '没有账户？注册' : '已有账户？登陆' }}</a>
        </p>
      </form>
    </div>
  </template>
  

<script>
import { requestLogin, requestRegister } from '@/api/api';

export default {
    data() {
        return {
            username: '',
            password: '',
            confirmPassword: '',
            loginMsg: '',
            isLoginMode: true,
        };
    },
    watch: {
        // 当用户名和密码变动时, 清空提示信息
        username() {
            this.loginMsg = '';
        },
        password() {
            this.loginMsg = '';
        },
        confirmPassword() {
            this.loginMsg = '';
        },
    },
    methods: {
        // Login.vue



        toggleMode() {
            this.isLoginMode = !this.isLoginMode;
            this.loginMsg = '';
        },
        handleSubmit() {
            if (this.isLoginMode) {
                this.login();
            } else {
                this.register();
            }
        },
        login() {
            if (this.username === '') {
                this.loginMsg = '用户名不得为空';
            } else if (this.password === '') {
                this.loginMsg = '密码不得为空';
            } else {
                if (this.username === 'admin') {
                    this.$store.commit('saveRole', 'admin');
                } else {
                    this.$store.commit('saveRole', 'user');
                }
                let params = { username: this.username, password: this.password };
                requestLogin(params)
                    .then((res) => {
                        if (!res.state) {
                            this.loginMsg = res.message;
                        } else {
                            let token = res.data;
                            this.$store.commit('saveToken', token);
                            this.loginMsg = '获取token成功，等待服务器初始化系统';
                            this.$router.replace({ name: this.$route.query.redirect ? this.$route.query.redirect : 'back_home' });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        register() {
            if (this.username === '') {
                this.loginMsg = '用户名不得为空';
            } else if (this.password === '') {
                this.loginMsg = '密码不得为空';
            } else if (this.password !== this.confirmPassword) {
                this.loginMsg = '两次输入的密码不一致';
            } else {
                let params = { user_name: this.username, user_password: this.password };
                requestRegister(params)
                    .then((res) => {
                        if (!res.state) {
                            this.loginMsg = res.message;
                        } else {
                            this.loginMsg = '注册成功，请登录';
                            this.isLoginMode = true;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
    },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: url('../../assets/images/login2.jpg') no-repeat center center;
  background-size: cover;
  font-family: 'Roboto', sans-serif;
  position: relative;
  overflow: hidden;
}

.bg-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.bg-bubbles li {
  position: absolute;
  list-style: none;
  display: block;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.3);
  bottom: -160px;
  animation: square 25s infinite;
  transition-timing-function: linear;
}

.bg-bubbles li:nth-child(2) {
  left: 20%;
  width: 80px;
  height: 80px;
  animation-delay: 2s;
  animation-duration: 17s;
}

.bg-bubbles li:nth-child(3) {
  left: 35%;
  width: 60px;
  height: 60px;
  animation-delay: 4s;
}

.bg-bubbles li:nth-child(4) {
  left: 50%;
  width: 100px;
  height: 100px;
  animation-delay: 1s;
  animation-duration: 20s;
  background-color: rgba(255, 255, 255, 0.4);
}

.bg-bubbles li:nth-child(5) {
  left: 65%;
  width: 120px;
  height: 120px;
  animation-delay: 3s;
  animation-duration: 22s;
}

.bg-bubbles li:nth-child(6) {
  left: 80%;
  width: 40px;
  height: 40px;
  animation-delay: 6s;
  animation-duration: 18s;
}

.bg-bubbles li:nth-child(7) {
  left: 90%;
  width: 90px;
  height: 90px;
  animation-delay: 5s;
  animation-duration: 25s;
}

.bg-bubbles li:nth-child(8) {
  left: 25%;
  width: 70px;
  height: 70px;
  animation-delay: 8s;
  animation-duration: 30s;
}

.bg-bubbles li:nth-child(9) {
  left: 55%;
  width: 50px;
  height: 50px;
  animation-delay: 10s;
  animation-duration: 27s;
}

.bg-bubbles li:nth-child(10) {
  left: 75%;
  width: 110px;
  height: 110px;
  animation-delay: 7s;
  animation-duration: 21s;
}

@keyframes square {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(-1000px) rotate(720deg);
  }
}

.login-main {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.login-main h3 {
  margin-bottom: 20px;
  font-weight: 700;
  color: #7a869a;
}

.login-main input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #d4e5f9;
  font-size: 16px;
}

.login-main p {
  margin: 10px 0;
}

.login-main button {
  width: 100%;
  padding: 10px;
  background: #a4b3d6;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-main button:hover {
  background: #7a869a;
}

.login-main a {
  color: #a4b3d6;
  text-decoration: none;
  transition: color 0.3s;
}

.login-main a:hover {
  color: #7a869a;
}
</style>
