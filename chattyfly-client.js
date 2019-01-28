//****************************************************************************************** */
//*********************************Socket*************************************************** */
//****************************************************************************************** */
var socket = io();

socket.on('connect', () => {
    console.log('Client is connected to server.');
    
    // Parse the QueryString
    const loginUser = parseQueryString(window.location.search);
    const loginUserWithId = {...loginUser, id: socket.id}; // store socket id so that when the disconnection happens we know who it was.

    console.log(socket.id);
    
    // Set the welcome message in the chat room.
    if (loginUser.name && loginUser.emotion) {
        document.getElementById("username").innerText = `${loginUser.emotion} ${loginUser.name}`;
    
        // need to communicate to server
        socket.emit('logIn', loginUserWithId, (err) => {
            if (err) {
                console.log(err);
                window.location.href = "/";
            } else {
                console.log("No error")
            }
        });
    }
});

socket.on('disconnect', () => {
    console.log('Client is disconnected from server.');

    logOut();
});

// Receive chat message
socket.on('broadcast message', (msg) => {
    const spokenMsgByUser = ` (${msg.sender})` + "&ensp;" + msg.message;
    displayMsg(spokenMsgByUser);
});

socket.on('broadcast login', (msg) => {
    displayMsg(msg);
});

socket.on('broadcast logout', (msg) => {
    displayMsg(msg);
});

socket.on('loginCount', (count) => {
    // Update the connection count.
    document.getElementById("log").innerHTML = `${count} people online.`;
});


//****************************************************************************************** */
//****************************************************************************************** */
//****************************************************************************************** */
//****************************************************************************************** */
//****************************************************************************************** */
displayMsg = (msg) => {
    if (msg) {
        const now = new Date();
        document.getElementById("sentMsg").innerHTML += now.toLocaleTimeString() + " " + msg + "<br />";

        scrollLastMessageIntoView();
    }
}

notiflyAll = () => {
    var user = document.getElementById("username").innerText;
    var msgTxt = document.getElementById("enteredMsg").value;

    if (msgTxt != "") {
        const chatData = {
            sender: user,
            message: msgTxt
        };

        // display in the chat box.
        const myMsg = ` (${user}):` + "&ensp;" + msgTxt;
        displayMsg(myMsg);
        
        // Send to everyone!
        socket.emit('newchatfly', chatData)
    }

    // Clear the text box.
    document.getElementById("enteredMsg").value = "";
}

scrollLastMessageIntoView = () => {
    document.getElementById('sentMsgBox').scrollTop =  document.getElementById('sentMsgBox').scrollHeight
}

// Handling User Logout.
logOut = () => {
    const logOutUser = parseQueryString(window.location.search);
    socket.emit('logOut', {
        user: logOutUser.name
    });

    // Redirect
    location.replace("http://localhost:5000/login");
}