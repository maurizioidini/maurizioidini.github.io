window.onload = function() {
    const outputDiv = document.getElementById("output");

    // Ottieni la stringa di last login
    const lastLogin = getLastLogin();

    // Aggiungi la stringa al div output come prima riga
    outputDiv.innerHTML = `<div class="output">${lastLogin}</div>`;
}

// Funzione per eseguire il comando
function handleKeyPress(event) {
    if (event.key === "Enter") {
        const input = document.getElementById("commandInput");
        const command = input.value.trim();
        const outputDiv = document.getElementById("output");

        // Aggiungi il comando inserito all'output
        outputDiv.innerHTML += `<div class="output">user@fake-shell:~$ ${command}</div>`;

        // Verifica se il comando esiste
        if (command_list[command] !== undefined) {
            // Se il comando contiene più linee, suddividi l'output per linea
            const output = command_list[command].split('\n').map(line => `<div class="output">${line}</div>`).join('');
            outputDiv.innerHTML += output;
        } else {
            outputDiv.innerHTML += `<div class="output">Command not found: ${command}</div>`;
        }

        // Resetta il campo di input
        input.value = "";
        // Scorri verso il basso automaticamente
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
});


const command_list = {
    "help": "Available commands: help, clear, whoami, locate, linkedin",
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