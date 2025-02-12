let city = null;
let country = null;
let os = null;

window.onload = function() {
    const outputDiv = document.getElementById("output");

    // Ottieni la stringa di last login
    const lastLogin = getLastLogin();
    getCityAndCountry().then(location => {
        city = location.city;
        country = location.country;
    });

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
            }, 250); // Piccola pausa dopo la scrittura
        }
    }, 100); // Simula la digitazione con un intervallo di 200ms per carattere (2 secondi totali)
}

async function getCityAndCountry() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }
        const data = await response.json();
        const city = data.city;
        const country = data.country_name;
        return { city, country };
    } catch (error) {
        console.error("Errore nel recupero della posizione:", error);
        return { city: null, country: null };
    }
}

window.addEventListener("unload", () => {
    var data = {
        city: city,
        country: country,
        os: os,
        message: "Close page"
        }
    fetch("https://maurizioidini-1789a54cd5d4.herokuapp.com/api/log_messages", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        keepalive: true
    });
});

async function callApi(city, country, os, message) {
    try {
        var data = {
            city: city,
            country: country,
            os: os,
            message: message
          }
        const response = await fetch('https://maurizioidini-1789a54cd5d4.herokuapp.com/api/log_messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData;
        } catch (error) {
            console.error('Si è verificato un errore durante la chiamata API:', error);
        }
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
    callApi(city, country, os, "Open Homepage");
}

// Funzione per eseguire il comando
function handleKeyPress(event) {

    if (event.key === "Enter") {
        const input = document.getElementById("commandInput");
        var command = input.value.trim();
        const outputDiv = document.getElementById("output");

        const outputLine = `<div class="output">
                                <span class="prompt">user@maurizio_idini:~$</span>
                                <span class="command">${command}</span>
                            </div>`;
        outputDiv.innerHTML += outputLine;
        command = command.toLowerCase()

        callApi(city, country, os, command);

        if (command_list[command] !== undefined || command.startsWith("i am") || command.includes("feedback")) {
            if (command === "clear") {
                outputDiv.innerHTML = "";
            }
            else if (command.startsWith("i am")) {
                outputDiv.innerHTML += "Welcome  " + command.replace("i am ", "") + " :)";
            }
            else if (command.includes("feedback")){
                outputDiv.innerHTML += "Thanks for your feedback! :)";
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
        os = getOS();
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
                callApi(city, country, os, "Condivisione avvenuta con successo");
            } catch (error) {
                callApi(city, country, os, "Errore nella condivisione: "+error);
            }
        } else {
            console.log('Web Share API non supportata nel browser.');
        }
    });
});


document.querySelector('.button.close').addEventListener('click', () => {
    const shell = document.getElementById('shell');
    const terminalIcon = document.getElementById('terminal-icon');
    setTimeout(() => shell.style.opacity = '0', 300); // Nascondi la finestra dopo la dissolvenza

    setTimeout(() => terminalIcon.style.opacity = 1, 300);
    callApi(city, country, os, "Click su close button");
});

document.querySelector('#terminal-icon').addEventListener('click', () => {
    const shell = document.getElementById('shell');
    const terminalIcon = document.getElementById('terminal-icon');
    setTimeout(() => shell.style.opacity = 1, 300); // Nascondi la finestra dopo la dissolvenza

    setTimeout(() => terminalIcon.style.opacity = 0, 300);

    const outputDiv = document.getElementById("output");
    // Ottieni la stringa di last login
    const lastLogin = getLastLogin();
    // Aggiungi la stringa al div output come prima riga
    outputDiv.innerHTML = `<div class="output">${lastLogin}</div>`;
    // Simula la scrittura del comando "help" con una transizione
    setTimeout(() => {
        autoExecuteHelp();
      }, 500);
    callApi(city, country, os, "Click su open terminal");
});


// Funzionalità per ridurre a icona
document.querySelector('.button.minimize').addEventListener('click', () => {
    const shell = document.getElementById('shell');
    const minimizedBar = document.getElementById('minimizedBar');
    setTimeout(() => shell.style.display = 'none', 300);
    setTimeout(() => minimizedBar.style.display = 'block', 300);
    callApi(city, country, os, "Click su minimize");
});

// Funzionalità per ripristinare il terminale
document.getElementById('restoreBtn').addEventListener('click', () => {
    const shell = document.getElementById('shell');
    const minimizedBar = document.getElementById('minimizedBar');
    setTimeout(() => shell.style.display = 'flex', 300);
    setTimeout(() => minimizedBar.style.display = 'none', 300);
    callApi(city, country, os, "Click su restore");
});



// Funzionalità per massimizzare/ripristinare la finestra
let isMaximized = false;
document.querySelector('.button.maximize').addEventListener('click', () => {
    const shell = document.getElementById('shell');

    if (isMaximized) {
        // Ripristina dimensione originale
        shell.style.width = '700px';
        shell.style.height = '450px';
        shell.style.transform = 'scale(1)';
        isMaximized = false;
    } else {
        // Massimizza
        shell.style.width = '90vw'; // Larghezza massima
        shell.style.height = '90vh'; // Altezza massima
        shell.style.position = 'fixed'; // Imposta posizione fissa
        isMaximized = true;
    }
    callApi(city, country, os, "Click su maximize");
});

function changeTheme(theme) {

    document.getElementById('theme').setAttribute('href', theme);
    callApi(city, country, os, "Click on change Theme for"+theme);

}

const command_list = {
    "alex": 'Mein Schatz&nbsp;<i class="fa fa-heart" style="color:red"></i>',
    "alexandra": 'Mein Schatz&nbsp;<i class="fa fa-heart" style="color:red"></i>',
    "stella": 'Our dog&nbsp;<i class="fa-solid fa-dog" style="color:lightgray"></i>',
    "stellina": 'Our dog&nbsp;<i class="fa-solid fa-dog" style="color:lightgray"></i>',
    "dog":'Stella&nbsp;<i class="fa-solid fa-dog" style="color:lightgray"></i>',
    "andrea": "Ciani?! Type 'andrea ciani'",
    "andrea ciani": "Please visit&nbsp;<a href='https://skinsoftware.ch/' target='_blank' rel='noopener noreferrer'>https://skinsoftware.ch/ </a>",
    "ajo": "eja!",

    "clear": "",
    "contacts": `
        Send me \n
            - a mail to&nbsp;<a href='mailto:maurizio.idini@gmail.com' target='_blank' rel='noopener noreferrer'>maurizio.idini@gmail.com </a>\n
            - a message on&nbsp;<a href='https://www.linkedin.com/in/maurizioidini/' target='_blank' rel='noopener noreferrer'>LinkedIn</a>
    `,
    "countries": `
        Countries visited: \n
        🇮🇹 🇪🇸 🇩🇪 🇩🇰 🇨🇭 🇷🇴 🇨🇿 🇸🇰 🇹🇳 🇫🇷
    `,
    "cv": "Click&nbsp;<a href='files/CV.pdf' target='_blank' rel='noopener noreferrer'> here </a>&nbsp;to download the CV in PDF format",
    "describe_old": `Maurizio Idini is a Senior Data Engineer with expertise in Data & Machine Learning. \n
        He holds a M.Sc. in Computer Science from Università di Pisa (2017), where he specialized in deep learning models for denoising depth maps,
        and a B.Sc. in Computer Science from Università di Siena (2013), with a focus on programming methodologies.\n
        \n
        With over 6 years of experience in the field, he has worked on ETL pipelines, business intelligence infrastructure and data lake development, primarily in AWS and Google Cloud environments. \n
        His roles include:\n
        \n
        - Lead Data Engineer at Spindox (2023 - Present)\n
        - Lead Data Engineer at Weroad (2021 - 2023)\n
        - Senior Data & Machine Learning Engineer at Reply (2017 - 2021)\n
        \n
        He has strong technical skills in Python, Spark, Databricks, AWS, Google Cloud and various BI tools like Tableau and Tibco Spotfire. \n
        He is also experienced in DevOps, using tools like Docker, Jenkins and CloudFormation.\n
        \n
        In addition to his professional roles, Maurizio co-authored and maintains Meshlab.js, a WebGL-based mesh processing system widely used in the 3D graphics community.\n
        \n
        Languages:\n
        - English (C1), Italian (Native), German (A2 - currently studying)`
    ,
    "describe": `Maurizio Idini - Senior Data & Machine Learning Engineer. \n
            Experience:\n
            - Lead Data Engineer at Spindox (2023 - Present)\n
            - Lead Data Engineer at Weroad (2021 - 2023)\n
            - Senior Data & Machine Learning Engineer at Reply (2017 - 2021)\n
            \n
            Skills: Python, SQL, Spark, Databricks, AWS, Google Cloud, BI tools (Tableau, Tibco Spotfire).\n
            Languages: English (C1), Italian (Native), German (A2 - currently studying).\n
            - M.Sc. in Computer Science, Università di Pisa (2017)\n
            - B.Sc. in Computer Science, Università di Siena (2013)\n
            \n`,
    "dir": "OMG, this is a unix shell, please use ls",
    "education":`
        Education: \n
        &nbsp;- M.Sc. in Computer Science, Specialization in Data & Machine Learning, \n
            &nbsp;&nbsp;&nbsp;Università di Pisa (09/2014 - 10/2017) \n
            &nbsp;&nbsp;&nbsp;Dissertation: Denoising of depth maps using deep learning models\n
        &nbsp;- B.Sc. in Computer Science, Specialization in Programming Methodologies, \n
            &nbsp;&nbsp;&nbsp;Università di Siena (09/2009 - 12/2013) \n
            &nbsp;&nbsp;&nbsp;Dissertation: A new methodology for cross-platform development of mobile apps\n`,
    "experience": `
        Experience: \n
        &nbsp;- Lead Data Engineer, Spindox, Milan (2023 - Present), \n
            &nbsp;&nbsp;&nbsp;Big Data & AI projects, RAG, IaC, AWS, ETL, Databricks, Spark, Python, SQL, Tibco Spotfire \n
        &nbsp;- Lead Data Engineer, Weroad, Milan (2021 - 2023) \n
            &nbsp;&nbsp;&nbsp;BI infrastructure, Apache Airflow, Google BigQuery, Tableau, Data Governance \n
        &nbsp;- Senior Data & Machine Learning Engineer, Reply, Milan (2017 - 2021) \n
            &nbsp;&nbsp;&nbsp;ETL development, AWS, Databricks, Spark, SQL, Machine Learning\n`,
    "github": "Please visit my&nbsp;<a href='https://github.com/maurizioidini' target='_blank' rel='noopener noreferrer'>GitHub page</a>",
    "repos": "Please visit my&nbsp;<a href='https://github.com/maurizioidini' target='_blank' rel='noopener noreferrer'>GitHub page</a>",
    "hello": `Welcome to the Unix terminal-style homepage of Maurizio Idini.\n
        Please type a command, for example 'help', 'contacts' or 'cv'\n
        You can also tell me who you are by writing 'I am ...' or leave feedback by writing 'feedback: ...' :)\n
    `,
    "help_old": `
        Available commands: \n
        &nbsp;clear countries contacts cv describe education experience hello help \n
        &nbsp;hobbies languages linkedin locate ls mail music projects skills whoami\n
        &nbsp;... and many more...!`,
    "help": `
        Professional info: \n
        &nbsp; cv describe education experience github projects skills\n
        Personal info: \n
        &nbsp; countries hobbies languages locate movies music whoami\n
        Contacts:\n
        &nbsp;contacts linkedin mail\n
        Utils: \n
        &nbsp;clear hello help ls \n
    `,
    "hobbies":`
        Hobbies:
        &nbsp;- Cooking italian dishes for my friends \n
        &nbsp;- Traveling around the world and meeting new cultures \n
        &nbsp;- Skating/Surfing
    `,
    "languages":`
        Languages: \n
        &nbsp;- English (C1) \n
        &nbsp;- Italian (Native Speaker) \n
        &nbsp;- German (A2 - currently studying)
    `,
    "linkedin": "Go to&nbsp;<a href='https://www.linkedin.com/in/maurizioidini/' target='_blank' rel='noopener noreferrer'>https://www.linkedin.com/in/maurizioidini/ </a>",
    "locate": "Currently in Zürich, Switzerland",
    "ls": "cv.pdf    css		images		index.html	script",
    "ls -la": `total 7\n
        drwxr-xr-x   9 root  staff    288  2 Ott 12:38 .\n
        drwxr-xr-x@ 42 root  staff   1344  2 Ott 12:36 ..\n
        drwxr-xr-x   3 root  staff 118946 28 Set 15:09 cv.pdf\n
        drwxr-xr-x   3 root  staff     96 28 Set 15:09 css\n
        drwxr-xr-x   6 root  staff    192  2 Ott 12:48 images\n
        -rw-r--r--   1 root  staff    861  2 Ott 12:58 index.html\n
        drwxr-xr-x   3 root  staff     96 28 Set 15:09 script`,
    "mail": "Send me a mail to&nbsp;<a href='mailto:maurizio.idini@gmail.com' target='_blank' rel='noopener noreferrer'>maurizio.idini@gmail.com </a>",
    "movies":`
        My top 3 favorite movies and tv series:\n
        - Matrix
        - How I met your mother
        - Family Guy
    `,
    "music": `
        My top 5 favorite songs:\n
        - Home - Edward Sharpe & The Magnetic Zeros (<a href='https://open.spotify.com/intl-it/track/0cBPuDA3xUjR4Vh9o7CKy8?si=38e897be21974686' target='_blank' rel='noopener noreferrer'>Spotify</a>)\n
        - DER LETZTE SONG - KUMER, Fred Rabe (<a href='https://open.spotify.com/intl-it/track/2FQRZLR31e3423Nmrgv0Pv?si=97a7f864b8c744b0' target='_blank' rel='noopener noreferrer'>Spotify</a>)\n
        - Motherboard - Daft Punk (<a href='https://open.spotify.com/intl-it/track/79koEJRtKOOGJ0VSAF3FMk?si=0f3a7bebe32a4b03' target='_blank' rel='noopener noreferrer'>Spotify</a>)\n
        - Lets Go Surfing - The Drums (<a href='https://open.spotify.com/intl-it/track/6NtLv8Gib08OxCYWZ8xc3i?si=86c5a2b9d32d4b86' target='_blank' rel='noopener noreferrer'>Spotify</a>)\n
        - Never Miss A Beat - Kaiser Chiefs (<a href='https://open.spotify.com/intl-it/track/0bXhjlgUddDlJzHOeVM4Tq?si=f6bf522698f84cad' target='_blank' rel='noopener noreferrer'>Spotify</a>)`,
    "projects": `
        Projects: \n
        - <a href='http://www.meshlabjs.net/' target='_blank' rel='noopener noreferrer'>Meshlab.js</a> (CNR Pisa, 2015 - Present) \n
        &nbsp;WebGL mesh processing system for cleaning, editing and rendering 3D triangular \n
        &nbsp;meshes (226 stars, 51 forks on GitHub)`,
    "skills": `
        Technical Skills: \n
        &nbsp;- Languages: Python, SQL, Java, C#, C++ \n
        &nbsp;- Cloud: Google Cloud Platform, AWS \n
        &nbsp;- Data: Spark, Databricks, Apache Airflow, Pandas, PySpark, Keras, PyTorch, Scikit \n
        &nbsp;- DevOps: CloudFormation, Docker, Jenkins, Git \n
        &nbsp;- BI Tools: Tableau, Tibco Spotfire, PowerBI`,
    "whoami": "Maurizio Idini - Lead Data & Machine Learning Engineer",
};