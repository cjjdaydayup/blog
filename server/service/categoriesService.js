const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data/categories.json');

// 读取并解析 JSON 文件
const getCategoriesData = () => {
    const jsonData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(jsonData).RECORDS;
};

// 写入 JSON 文件
const writeCategoriesData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify({ RECORDS: data }, null, 2), 'utf8');
};

// 更新目录名称
const updateCategory = (id, name) => {
    let categories = getCategoriesData();
    let category = categories.find(cat => cat.categories_id === id);
    if (category) {
        category.categories_name = name;
        writeCategoriesData(categories);
        return { success: true };
    }
    return { success: false, message: '目录不存在' };
};

// 删除目录并将对应文章的归属目录置为空
const deleteCategory = (id) => {
    let categories = getCategoriesData();
    const updatedCategories = categories.filter(cat => cat.categories_id !== id);
    if (updatedCategories.length === categories.length) {
        return { success: false, message: '目录不存在' };
    }
    writeCategoriesData(updatedCategories);
    return { success: true };
};

// 增加目录
const addCategory = (name) => {
    console.log(name);
    let categories = getCategoriesData();
    const newId = (Math.max(...categories.map(cat => parseInt(cat.categories_id))) + 1).toString();
    const newCategory = {
        categories_id: newId,
        categories_name: name
    };
    categories.push(newCategory);
    writeCategoriesData(categories);
    return { success: true, newCategory };
};

module.exports = {
    getCategoriesData,
    updateCategory,
    deleteCategory,
    addCategory
};
