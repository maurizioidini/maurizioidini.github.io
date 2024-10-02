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

// ICONA SHARE E BUTTON

// Funzione per rilevare il sistema operativo
function getOS() {
    let userAgent = window.navigator.userAgent;
    if (userAgent.includes('Mac')) {
        return 'MacOS';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        return 'iOS';
    } else if (userAgent.includes('Android')) {
        return 'Android';
    } else if (userAgent.includes('Win')) {
        return 'Windows';
    } else {
        return 'Unknown';
    }
}

// Imposta l'icona di condivisione in base al sistema operativo
function setShareIcon() {
    const os = getOS();
    const shareIcon = document.getElementById('shareIcon');

    if (os === 'MacOS') {
        shareIcon.className = 'fas fa-share-alt'; // Icona generica per macOS
    } else if (os === 'iOS') {
        shareIcon.className = 'fas fa-share-square'; // Icona iOS (simile a quella del sistema)
    } else if (os === 'Android') {
        shareIcon.className = 'fab fa-android'; // Icona Android
    } else if (os === 'Windows') {
        shareIcon.className = 'fab fa-windows'; // Icona Windows
    } else {
        shareIcon.className = 'fas fa-share-alt'; // Icona generica se non riconosciuto
    }
}

// Imposta l'icona al caricamento della pagina
window.onload = setShareIcon;

const shareButton = document.getElementById('shareButton');
shareButton.addEventListener('click', async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Visita il mio sito',
                text: 'Ecco il mio sito, dai un\'occhiata!',
                url: window.location.href, // Condivide l'URL corrente
            });
            console.log('Condivisione avvenuta con successo!');
        } catch (error) {
            console.log('Errore nella condivisione:', error);
        }
    } else {
        console.log('Web Share API non supportata nel browser.');
    }
});

const fakeCommands = {
    "help": "Available commands: help, clear, whoami, locate, linkedin",
    "clear": "",
    "whoami": "Maurizio Idini",
    "locate": "Currently in Zürich, CH",
    "linkedin": "<a href='https://www.linkedin.com/in/maurizioidini/'>https://www.linkedin.com/in/maurizioidini/ </a>",

};

/*
todo:
add signature
add shareTo button
spotify best song
youtube best video
easter eggs
best movie
best receipt

*/



