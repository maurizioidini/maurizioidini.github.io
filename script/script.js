window.onload = function() {
    const outputDiv = document.getElementById("output");

    // Ottieni la stringa di last login
    const lastLogin = getLastLogin();

    // Aggiungi la stringa al div output come prima riga
    outputDiv.innerHTML = `<div class="output">${lastLogin}</div>`;
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        const input = document.getElementById("commandInput");
        const command = input.value.trim();
        const outputDiv = document.getElementById("output");

        const outputLine = `<div class="output">
                                <span class="prompt">user@maurizio_idini:~$</span>
                                <span class="command">${command}</span>
                            </div>`;
        outputDiv.innerHTML += outputLine;

        if (fakeCommands[command] !== undefined) {
            if (command === "clear") {
                outputDiv.innerHTML = "";
            } else {
                outputDiv.innerHTML += `<div class="output">${fakeCommands[command]}</div>`;
            }
        } else {
            outputDiv.innerHTML += `<div class="output">Command not found: ${command}</div>`;
        }

        input.value = "";
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }
}

function getLastLogin() {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const now = new Date();

    const dayOfWeek = daysOfWeek[now.getDay()];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `Last login: ${dayOfWeek} ${month} ${day} ${hours}:${minutes}:${seconds} on ttys000`;
}



const fakeCommands = {
    "help": "Available commands: help, clear, whoami, locate, linkedin",
    "clear": "",
    "whoami": "Maurizio Idini",
    "locate": "Currently in Zürich, CH",
    "linkedin": "maurizioidini",

};