import express from 'express';
// import socketio  from ('socket.io');
const app = express();
import {createServer} from 'http'
const server = createServer(app)
import { Server }  from 'socket.io'; 
import cors from 'cors';
import router from './router.js';
import {addUser, removeUser,getUser, getUsersInRoom} from './user.js'

const PORT = process.env.PORT || 5000

app.use(cors())

const io = new Server(server);
// const io = socketio(server)

app.use(router)

io.on('connect', (socket) => {

    socket.on('join', ({name, room}, callback) => {
      const {user, error} = addUser({id: socket.id, name,room})
      if(error) return callback(error)
      
      socket.join(user.room);

      // This Line welcoming the current user that has joined the room
      socket.emit('message', { user: 'admin', text: `${user.name}, Welcome to the room ${user.room}`})
      
      // This Line telling everyone in the Room that a new user has joined, except the current user that has joined.
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has Joined!`})


      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})

      // callback()

    })

    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id)

      io.to(user.room).emit('message', { user: user.name, text: message})
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})

      callback()
    })

    socket.on('disconnect', () => {
        // console.log('USER has Left....');
        const user = removeUser(socket.id)

        if(user){
          io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left`})
        }
    })
  });

server.listen(PORT,  () => console.log(`Server is running on PORT ${PORT} `))
