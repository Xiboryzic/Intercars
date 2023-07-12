const mongoose = require('mongoose');

mongoose.connect(process.env.mongo_url)

const db = mongoose.connection;

db.on('connected',()=>{
    console.log('MongoDB Успешно подключён')
})

db.on('error',()=>{
    console.log('MongoDB Не подключён')
})