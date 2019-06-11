
//! Requiring modules  --  START
var LivingCreature = require("./modules/LivingCreature.js")
var Grass = require("./modules/Grass.js");
var GrassEater = require("./modules/GrassEater.js");
var Predator = require("./modules/Predator.js")
var Smuggler = require("./modules/Smuggler.js")
let random = require("./modules/random.js");
//! Requiring modules  --  END


//! Setting global arrays  --  START
grassArr = [];
grassEaterArr = [];
predArr = [];
smugArr = [];
matrix = [];
xotHashiv = 0;
xotakerHashiv = 0;
gishoHashiv = 0;

//! Setting global arrays  -- END




//! Creating MATRIX -- START
function matrixGenerator(matrixSize, grass, grassEater, pred, smug) {
    for (let i = 0; i < matrixSize; i++) {
        matrix[i] = [];
        for (let o = 0; o < matrixSize; o++) {
            matrix[i][o] = 0;
        }
    }
    for (let i = 0; i < grass; i++) {
        let customX = Math.floor(random(matrixSize)); // 0-9
        let customY = Math.floor(random(matrixSize)); // 4
        matrix[customY][customX] = 1;
    }
    for (let i = 0; i < grassEater; i++) {
        let customX = Math.floor(random(matrixSize));
        let customY = Math.floor(random(matrixSize));
        matrix[customY][customX] = 2;
    }
    for (let i = 0; i < pred; i++) {
        let customX = Math.floor(random(matrixSize));
        let customY = Math.floor(random(matrixSize));
        matrix[customY][customX] = 3;
    }
    for (let i = 0; i < smug; i++) {
        let customX = Math.floor(random(matrixSize));
        let customY = Math.floor(random(matrixSize));
        matrix[customY][customX] = 4;
    }
}
matrixGenerator(20, 1, 1);
//! Creating MATRIX -- END



//! SERVER STUFF  --  START
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static("."));
app.get('/', function (req, res) {
    res.redirect('index.html');
});
server.listen(3000);
//! SERVER STUFF END  --  END



function creatingObjects() {
    for (var y = 0; y < matrix.length; y++) {
        for (var x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 2) {
                var grassEater = new GrassEater(x, y);
                grassEaterArr.push(grassEater);
            }
            else if (matrix[y][x] == 3) {
                var pred = new Predator(x, y);
                predArr.push(pred);
            } 
            else if (matrix[y][x] == 4) {
                var smug = new Smuggler(x, y);
                smugArr.push(smug);
            } 
            else if (matrix[y][x] == 1) {
                var grass = new Grass(x, y);
                grassArr.push(grass);
                xotHashiv++;
            }

        }
    }
}
    creatingObjects();

    function game() {
        if (grassArr[0] !== undefined) {
            for (var i in grassArr) {
                grassArr[i].mul();
            }
        }
        else if (grassEaterArr[0] !== undefined) {
            for (var i in grassEaterArr) {
                grassEaterArr[i].move();
                grassEaterArr[i].eat();
                grassEaterArr[i].mul();
                grassEaterArr[i].die();
            }
        }
        else if (predArr[0] !== undefined) {
            for(var i in predArr) {
                predArr[i].move()
                predArr[i].eat()
                predArr[i].mul()
                predArr[i].die()
            }
        }

        //! Object to send
        let sendData = {
            matrix: matrix,
            grassCounter: xotHashiv
        }

        //! Send data over the socket to clients who listens "data"
        io.sockets.emit("data", sendData);
    }

    setInterval(game, 1000)