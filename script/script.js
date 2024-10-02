window.onload = function() {
    const outputDiv = document.getElementById("output");

    // Ottieni la stringa di last login
    const lastLogin = getLastLogin();

    // Aggiungi la stringa al div output come prima riga
    outputDiv.innerHTML = `<div class="output">${lastLogin}</div>`;

    // Simula la scrittura del comando "help" con una transizione
    autoExecuteHelp();
};

// Funzione per simulare la scrittura del comando
function simulateTyping(command, callback) {
    const input = document.getElementById("commandInput");
    input.value = ""; // Assicura che l'input sia vuoto all'inizio
    let index = 0;

    const interval = setInterval(() => {
        input.value += command[index];
        index++;

        if (index === command.length) {
            clearInterval(interval);
            setTimeout(() => {
                callback(); // Esegui il comando dopo la simulazione di scrittura
            }, 500); // Piccola pausa dopo la scrittura
        }
    }, 200); // Simula la digitazione con un intervallo di 200ms per carattere (2 secondi totali)
}

// Funzione per eseguire automaticamente "help"
function autoExecuteHelp() {
    simulateTyping("hello", () => {
        executeCommand("hello");
        document.getElementById("commandInput").value = ""; // Resetta il campo di input
    });
}

// Funzione per eseguire il comando
function executeCommand(command) {
    const outputDiv = document.getElementById("output");

    const outputLine = `<div class="output">
                            <span class="prompt">user@maurizio_idini:~$</span>
                            <span class="command">${command}</span>
                        </div>`;
    outputDiv.innerHTML += outputLine;

    if (command_list[command] !== undefined) {
        if (command === "clear") {
            outputDiv.innerHTML = "";
        } else {
            const output = command_list[command].split('\n').map(line => `<div class="output">${line}</div>`).join('');
            outputDiv.innerHTML += output;
        }
    } else {
        outputDiv.innerHTML += `<div class="output">Command not found: ${command}</div>`;
    }

    outputDiv.scrollTop = outputDiv.scrollHeight; // Scorri automaticamente verso il basso
    scrollToBottom();
}

// Funzione per eseguire il comando
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

        if (command_list[command] !== undefined) {
            if (command === "clear") {
                outputDiv.innerHTML = "";
            }
            else {
                const output = command_list[command].split('\n').map(line => `<div class="output">${line}</div>`).join('');
                outputDiv.innerHTML += output;
            }
        } else if (command === "") {
            outputDiv.innerHTML += "";
        } else {
            outputDiv.innerHTML += `<div class="output">Command not found: ${command}</div>`;
        }

        input.value = "";
        outputDiv.scrollTop = outputDiv.scrollHeight;
        scrollToBottom();
    }
}
function scrollToBottom() {
    const outputDiv = document.getElementById("shell");
    outputDiv.scrollTop = outputDiv.scrollHeight; // Scorri automaticamente alla fine
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
document.addEventListener('DOMContentLoaded', function () {
    // Imposta l'icona di condivisione in base al sistema operativo
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
    setShareIcon();

    // Funzionalità di condivisione nativa
    const shareButton = document.getElementById('shareButton');

    shareButton.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Share to',
                    text: 'Share to',
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
});


const command_list = {
    "hello": `Welcome to the Unix terminal-style homepage of Maurizio Idini.\n
        Please type a command, for example 'help', 'locate' or 'spotify'`,
    "help": `
    Available commands: \n
        hello    help    clear    locate    linkedin    whoami\n
        ... and many more...!`,
    "clear": "",
    "whoami": "Maurizio Idini",
    "locate": "Currently in Zürich, Switzerland",
    "linkedin": "<a href='https://www.linkedin.com/in/maurizioidini/'>Go to https://www.linkedin.com/in/maurizioidini/ </a>",
    "dir": "OMG, this is a unix shell, please use ls",
    "ls": "css		images		index.html	script",
    "ls -la": `total 7\n
        drwxr-xr-x   9 root  staff   288  2 Ott 12:38 .\n
        drwxr-xr-x@ 42 root  staff  1344  2 Ott 12:36 ..\n
        drwxr-xr-x   3 root  staff    96 28 Set 15:09 css\n
        drwxr-xr-x   6 root  staff   192  2 Ott 12:48 images\n
        -rw-r--r--   1 root  staff   861  2 Ott 12:58 index.html\n
        drwxr-xr-x   3 root  staff    96 28 Set 15:09 script`,
    "ajo": "eja!",
    "spotify": "<a href='https://open.spotify.com/intl-it/track/0cBPuDA3xUjR4Vh9o7CKy8?si=38e897be21974686'>Home - Edward Sharpe & The Magnetic Zeros</a>"


};

/*
todo:
youtube best video
easter eggs
best movie
best receipt

*/