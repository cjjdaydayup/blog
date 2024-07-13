<template>
  <div class="welcome-container">
    <div class="hero-section">
      <h1>欢迎来到小型博客系统</h1>
      <p>当前日期和时间：{{ currentDateTime }}</p>
      
    </div>
    <div class="features-section">
      <h2>我们的功能</h2>
      <div class="feature-cards">
        <div class="card" v-for="feature in features" :key="feature.title">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BackHome",
  data() {
    return {
      currentDateTime: new Date().toLocaleString(),
      features: [
        { title: "创建新博客", description: "轻松发布新文章。" },
        { title: "查看博客列表", description: "浏览所有发布的文章。" },
        { title: "编辑博客文章", description: "随时更新您的内容。" },
        { title: "删除博客文章", description: "管理您的文章内容。" }
      ]
    };
  },
  mounted() {
    // 每秒更新当前日期和时间
    setInterval(() => {
      this.currentDateTime = new Date().toLocaleString();
    }, 1000);
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to right, #6dd5ed, #2193b0);
  color: #ffffff;
  font-family: 'Roboto', sans-serif;
  text-align: center;
  padding: 20px;
  
}

.hero-section {
  margin-bottom: 50px;
}

.hero-section h1 {
  font-size: 3em;
  margin-bottom: 10px;
}

.hero-section p {
  font-size: 1.5em;
}

.primary-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1.2em;
  color: #ffffff;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.primary-button:hover {
  background-color: #45a049;
}

.features-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  width: 80%;
  max-width: 800px;
}

.features-section h2 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #ffffff;
}

.feature-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.card {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 20px;
  width: 45%;
  margin: 10px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: scale(1.05);
}

.card h3 {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #ffffff;
}

.card p {
  font-size: 1em;
  color: #ffffff;
}
</style>
