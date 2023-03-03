(function () {
    const server = 'http://127.0.0.1:3000'
    const socket = io(server);

    socket.on('notification', (data) => {
        console.log('Message depuis le seveur:', data);
    })

    fetch(`${server}/history`).then((res) => {
        return res.json()
    }).then((data) => {
            data.map(function (messages) {
            var list = document.createElement('li');
            if(messages.userid == localStorage.getItem('userid'))
            {
                list.className = "me";
            }
            else
            {
                list.className = "";
            }
    
            var nom = document.createElement('span');
            var nomDiv = document.createElement('div');
            nomDiv.className = "name";
            nomDiv.appendChild(nom);
    
            var time = document.createElement('span');
            time.className = "msg-time";
            var msg = document.createElement('p');
            var msgDiv = document.createElement('div');
            msgDiv.className = "message";
            msgDiv.appendChild(msg);
            msgDiv.appendChild(time);
            
            list.appendChild(nomDiv);
            list.appendChild(msgDiv);
            nom.innerText = messages.userid;
            msg.innerText = messages.text;
            time.innerText = messages.timestamp;
            
            messageArea.value = "";
            chatHistorique.insertBefore(list, chatHistorique.childNodes[0]);
            })
    });
})()

let userid;
const socket = io('http://localhost:3000');
        
if(localStorage.getItem('userid')){
    userid = localStorage.getItem('userid');
} else {
    const id = 666;
    localStorage.setItem('userid', id)
    userid = id;
}

let messageArea = document.getElementById('messageArea');
let sendButton = document.getElementById('sendButton');

sendButton.addEventListener('click', sendButtonClick)

function sendButtonClick(){
    let message = messageArea.value;
    socket.emit('sendMessage', ({userid, message}));
}

socket.on('sendMessage', (messages) => {
        var list = document.createElement('li');
        if(messages.userid == localStorage.getItem('userid'))
        {
            list.className = "me";
        }
        else
        {
            list.className = "";
        }

        var nom = document.createElement('span');
        var nomDiv = document.createElement('div');
        nomDiv.className = "name";
        nomDiv.appendChild(nom);

        var time = document.createElement('span');
        time.className = "msg-time";
        var msg = document.createElement('p');
        var msgDiv = document.createElement('div');
        msgDiv.className = "message";
        msgDiv.appendChild(msg);
        msgDiv.appendChild(time);
        
        list.appendChild(nomDiv);
        list.appendChild(msgDiv);
        nom.innerText = messages.userid;
        msg.innerText = messages.text;
        time.innerText = messages.timestamp;
        
        messageArea.value = "";
        chatHistorique.insertBefore(list, chatHistorique.childNodes[0]);
});

socket.on('messageNb', (value) => {
    messageCount.innerHTML = value;
});

socket.on('users', (users) => {

    userList.innerHTML = '';
    
    users.map((user => {
        var list = document.createElement('li');
        // if(messages.userid == localStorage.getItem('userid'))
        // {
            var statut = document.createElement('span');
            statut.className = "status online";
            list.appendChild(statut);

            var i = document.createElement('i');
            i.className = "fa fa-circle-o";
            statut.appendChild(i);

            var username = document.createElement('span');
            list.appendChild(username);
            
            username.innerHTML = `${user._id} : Nombre messages : ${user.count}`;
            userList.insertBefore(list, userList.childNodes[0]);
        // }
        // else
        // {
        // }
    }))
});