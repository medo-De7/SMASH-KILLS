const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public')); // ليتمكن المتصفح من قراءة ملفات اللعبة

let players = {}; // هنا سنخزن أماكن اللاعبين

io.on('connection', (socket) => {
    console.log('لاعب جديد اتصل: ' + socket.id);
    
    // إنشاء لاعب جديد عند الاتصال
    players[socket.id] = { x: 0, y: 0, z: 0, rotation: 0 };

    // إرسال قائمة اللاعبين الحاليين للاعب الجديد
    socket.emit('currentPlayers', players);

    // إخبار الآخرين بوجود لاعب جديد
    socket.broadcast.emit('newPlayer', { id: socket.id, info: players[socket.id] });

    // عندما يتحرك اللاعب
    socket.on('playerMovement', (movementData) => {
        players[socket.id] = movementData;
        socket.broadcast.emit('playerMoved', { id: socket.id, info: movementData });
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

http.listen(3000, () => console.log('اللعبة تعمل على http://localhost:3000'));