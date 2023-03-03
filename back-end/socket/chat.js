const sMessage = require('../models/message');

module.exports = function (io) {

  io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    io.emit('notification', { type: 'new_user', data: socket.id });

    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', { type: 'removed_user', data: socket.id });
    });

    socket.on('sendMessage', (value) => { 
      // Création de l'objet "click" de Mongoose (schéma)
      const message = new sMessage({
          text: value.message,
          sessionid: socket.id,
          userid: value.userid,
          timestamp: new Date()
      });
  
      // Sauvegarde dans la base de données
      message.save().then(() => {
              io.emit('sendMessage', message)
      }).catch((error) => {
          console.log(error)
      })
      
  });
  })
}