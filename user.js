const users = [];

const addUser = ({id, name, room}) =>{
    //JavaScript Mastery = JavaScriptMastery 

    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()

    const userExists = users.find(user => user.name === name && user.room === room)

    if(userExists) return {error: 'User has been taken'}

    const user = {id, name, room}

    users.push(user)

    return {user}
}

const removeUser = (id) =>{

    const index = users.findIndex(user => user.id === id)

    if(index !== -1) {
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => users.find(user => user.id === id)

const getUsersInRoom = (room) => users.filter(user=> user.room === room)

export {addUser, removeUser,getUser, getUsersInRoom}