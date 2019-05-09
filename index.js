var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

let vip = [
    {
        name: "Floyd Mayweather", 
        photo: "https://specials-images.forbesimg.com/imageserve/5b149bb84bbe6f74868b761f/416x416.jpg?background=000000&cropX1=268&cropX2=2355&cropY1=234&cropY2=2323"
    },
    {
        name: "George Clooney", 
        photo: "https://specials-images.forbesimg.com/imageserve/5b43ae4b31358e2c990e9203/416x416.jpg?background=000000&cropX1=403&cropX2=2584&cropY1=60&cropY2=2242"
    },
    {
        name: "Kylie Jenner",
        photo: "https://specials-images.forbesimg.com/imageserve/5b3bc12d4bbe6f604389def2/416x416.jpg?background=000000&cropX1=71&cropX2=3541&cropY1=1071&cropY2=4540"
    }
]

let numUsers = 0 //num user connected

io.on('connection', function (socket) {

    let player = {
        id: "",
        nickName: "",
        character: { nameCharacter: "", photoCharacter: "" },
    }

    console.log('an user connected'); // user connected

    socket.on('disconnect', function () { // user disconnected 
        if(numUsers > 0){socket.id = numUsers--} // user cannot go under 0
        console.log('user disconnected numUser: ' + numUsers);
    });

    socket.on('login', function (inputName) { // on login
        numUsers++;
        console.log('user connected numUser: ' + numUsers);
        player.nickName = inputName
        player.character = vip[Math.floor(Math.random() * (+vip.length - +0)) + +0].name
        player.id = socket.id;
        socket.broadcast.emit('login', player)
        console.log(player.id)
        console.log(player.character)
    });

    socket.on('chat message', function (msg) { // on message
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});