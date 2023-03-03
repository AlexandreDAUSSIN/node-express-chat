const sMessage = require('../models/message');

module.exports = function (io) {

  io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    io.emit('notification', { type: 'new_user', data: socket.id });

    sMessage.count((err, count) => {
      if(err)
        console.log(err);
      else
        io.emit('messageNb', count);
    })

    sMessage.aggregate([
      { $group: { _id: '$userid', count: { $sum: 1 } } }
    ], (err, results) => {
      if (err) {
        console.log(err);
      } else {
        io.emit('users', results);      }
    });

    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', { type: 'removed_user', data: socket.id });
    });

    socket.on('sendMessage', (value) => { 
      // Création de l'objet "message" de Mongoose (schéma)
      const message = new sMessage({
          text: value.message,
          sessionid: socket.id,
          userid: value.userid,
          timestamp: new Date()
      });

      sMessage.count((err, count) => {
        if(err)
          console.log(err);
        else
          io.emit('messageNb', count);
      })

      sMessage.aggregate([
        { $group: { _id: '$userid', count: { $sum: 1 } } }
      ], (err, results) => {
        if (err) {
          console.log(err);
        } else {
          io.emit('users', results);      }
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