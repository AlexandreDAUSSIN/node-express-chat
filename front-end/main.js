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

const ID = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
};

let messageArea = document.getElementById('messageArea');
let sendButton = document.getElementById('sendButton');

sendButton.addEventListener('click', sendButtonClick);

function sendButtonClick(){
    if(document.getElementById('username').value != '') {
        const id = document.getElementById('username');
        localStorage.setItem('userid', id.value);
        userid = id.value;
    }
    else if(localStorage.getItem('userid') != ''){
        userid = localStorage.getItem('userid');
    } 
    else {
        const id = ID();
        localStorage.setItem('userid', id)
        userid = id;
    }
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
    }))
});

let resizeButton = document.getElementById('resize');
let globalwindow = document.getElementById('globalwindow');

resizeButton.addEventListener('click', resizeButtonClick);

function resizeButtonClick(){
    if(globalwindow.className == 'small-window-wrapper')
        globalwindow.className = 'big-window-wrapper';
    else if(globalwindow.className == 'big-window-wrapper')
        globalwindow.className = 'small-window-wrapper';    
}
