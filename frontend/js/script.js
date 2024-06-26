// login elements
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");
const emailInput = login.querySelector(".login__email");
const roomInput = login.querySelector(".login__room");

// chat elements
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

// Input de upload de arquivo
const fileInput = document.getElementById("fileInput");

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold",
    "blue",
    "red",
    "yellow",
    "pink",
    "purple"
];

const user = { id: "", name: "", email: "", color: "", room: "" };

let websocket;

const createMessageSelfElement = (content) => {
    const div = document.createElement("div");

    div.classList.add("message--self");
    div.innerHTML = content;

    return div;
};

const createMessageOtherElement = (content, sender, senderEmail, senderColor) => {
    const div = document.createElement("div");
    const span = document.createElement("span");

    div.classList.add("message--other");

    span.classList.add("message--sender");
    span.style.color = senderColor;

    div.appendChild(span);

    span.innerHTML = `${sender} (${senderEmail}):`;
    div.innerHTML += content;

    return div;
};

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // Envia o arquivo para o servidor
            const message = {
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                userColor: user.color,
                content: `Arquivo: ${file.name}`, // Adicione o nome do arquivo como conteúdo da mensagem
                file: e.target.result // Envie o conteúdo do arquivo
            };

            websocket.send(JSON.stringify(message));
        };

        reader.readAsDataURL(file);
    }
};

const processMessage = ({ data }) => {
    const { userId, userName, userEmail, userColor, content, file } = JSON.parse(data);

    const message =
        userId == user.id
            ? createMessageSelfElement(content)
            : createMessageOtherElement(content, userName, userEmail, userColor || "");

    if (file) {
        // Se houver um arquivo, crie um link de download para ele
        const fileLink = document.createElement("a");
        fileLink.href = file;
        fileLink.download = `File_${new Date().getTime()}`; // Nome do arquivo para download
        fileLink.textContent = "  Download"; // Texto do link
        message.appendChild(fileLink);
    }

    chatMessages.appendChild(message);

    scrollScreen();
};

const handleLogin = (event) => {
    event.preventDefault();

    if (!roomInput.value) {
        alert("Por favor, informe o nome da sala!");
        return;
    }

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.email = emailInput.value;
    user.color = getRandomColor();
    user.room = roomInput.value;

    login.style.display = "none";
    chat.style.display = "flex";

    // websocket = new WebSocket("wss://chatscript.onrender.com")
    websocket = new WebSocket("ws://localhost:8080");
    websocket.onmessage = processMessage;
};

const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userColor: user.color,
        content: chatInput.value
    };

    websocket.send(JSON.stringify(message));

    chatInput.value = "";
};

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);

// Adiciona um ouvinte de evento para o input de arquivo
fileInput.addEventListener("change", handleFileUpload);
