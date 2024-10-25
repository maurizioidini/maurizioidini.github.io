let mediaRecorder; // Variabile per registrare il video
let mediaStream;
let recordedChunks = []; // Array per memorizzare i segmenti registrati
let videoElement = document.getElementById('videoPreview'); // Elemento video live
const recordedVideoElement = document.getElementById('recordedVideo'); // Elemento video registrato
let recordingStartTime; // Tempo di inizio registrazione



// Avvia la fotocamera
async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  mediaStream = stream;

  videoElement.srcObject = stream; // Imposta lo stream come sorgente del video live
  videoElement.play();

}

document.getElementById('snap').addEventListener('click', function() {
  const canvas = document.createElement('canvas');
  const photo = document.getElementById('photo');

  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Convert the canvas content to a URL to display the image
  photo.src = canvas.toDataURL('image/png');
  photo.style.display = 'block';
  document.getElementById('reset').disabled = false;
  document.getElementById('uploadPhoto').disabled = false;

  videoElement.style.display = 'none';

});


document.getElementById('startRecording').addEventListener('click', () => {
  recordedChunks = [];
  mediaRecorder = new MediaRecorder(mediaStream);

  // Set up timer
  startTime = Date.now();
  document.getElementById('timer').style.display = 'block';
  timerInterval = setInterval(updateTimeElapsed, 1000);

  // Event to handle recording
  mediaRecorder.ondataavailable = function(event) {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = function() {
    const videoBlob = new Blob(recordedChunks, { type: 'video/mp4' });
    const videoURL = URL.createObjectURL(videoBlob);
    const recordedVideo = document.getElementById('recordedVideo');

    recordedVideo.src = videoURL;
    recordedVideo.style.display = 'block';
    videoElement.style.display = 'none'; // Nascondi il video live

    // Stop the timer
    clearInterval(timerInterval);
    document.getElementById('timer').style.display = 'none';
    document.getElementById('timeElapsed').innerText = '00:00'; // Reset the timer
    const button = document.getElementById('uploadVideo');
    button.style.opacity = 1;
  };

  mediaRecorder.start();
  document.getElementById('startRecording').disabled = true;
  document.getElementById('stopRecording').disabled = false;
});



// Event listener per il pulsante di registrazione
document.getElementById('stopRecording').addEventListener('click', () => {
  mediaRecorder.stop();
  document.getElementById('startRecording').disabled = false;
  document.getElementById('stopRecording').disabled = true;
  document.getElementById('uploadVideo').disabled = false;
  document.getElementById('reset').disabled = false;

});

// Funzione per caricare il video
async function uploadVideo(blobUrl) {
  // Ottieni il Blob dall'URL
  const response = await fetch(blobUrl);
  const blob = await response.blob(); // Ottieni il blob dal blob URL

  const reader = new FileReader();

  reader.onloadend = async () => {
      const base64String = reader.result; // Ottieni la stringa Base64
      // Crea l'oggetto payload con il formato corretto
      const payload = { video: base64String };

      const response = await fetch('http://127.0.0.1:5000/upload/video', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json' // Imposta il Content-Type come application/json
          },
          body: JSON.stringify(payload) // Invia l'oggetto come JSON
      });

      const result = await response.json();
      console.log(result);
  };

  reader.readAsDataURL(blob); // Leggi il blob come Data URL
}

// Funzione per caricare una foto
async function uploadPhoto(base64String) {
  const payload = { photo: base64String }; // Crea l'oggetto payload

  const response = await fetch('http://127.0.0.1:5000/upload/photo', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json' // Imposta il Content-Type come application/json
      },
      body: JSON.stringify(payload) // Invia l'oggetto come JSON
  });

  const result = await response.json();
  console.log(result);
}

// Event listener per il pulsante di caricamento
document.getElementById('uploadVideo').addEventListener('click', () => {
  const videoBlobUrl = recordedVideoElement.src; // Ottieni l'URL del video registrato
  if (videoBlobUrl) {
      uploadVideo(videoBlobUrl);
      alert("Video caricato con successo")
  } else {
      console.log("No video selected");
  }
  document.getElementById('uploadVideo').disabled = true;
  document.getElementById('reset').disabled = true;
  recordedVideoElement.style.display = 'none';
  videoElement.style.display = 'block'; // Nascondi il video live
  videoElement.srcObject = mediaStream; // Imposta lo stream come sorgente del video live
  videoElement.play();
});

// Upload the photo
document.getElementById('uploadPhoto').addEventListener('click', function() {
  const photoFile = document.getElementById('photo').src;
  if (photoFile) {
    uploadPhoto(photoFile);
    alert("Foto caricata con successo")
  } else {
    alert('No photo taken to upload.');
  }
  document.getElementById('photo').style.display = 'none';
  document.getElementById('uploadPhoto').disabled = true;
  document.getElementById('reset').disabled = true;
  videoElement.style.display = 'block'; // Nascondi il video live
  videoElement.srcObject = mediaStream; // Imposta lo stream come sorgente del video live
  videoElement.play();
});

// Event listener per il pulsante di caricamento
document.getElementById('reset').addEventListener('click', () => {

  document.getElementById('uploadPhoto').disabled = true;
  document.getElementById('uploadVideo').disabled = true;
  document.getElementById('reset').disabled = true;
  document.getElementById('photo').style.display = 'none';
  recordedVideoElement.style.display = 'none';
  videoElement.style.display = 'block'; // Nascondi il video live
  videoElement.srcObject = mediaStream; // Imposta lo stream come sorgente del video live
  videoElement.play();
});

function updateTimeElapsed() {
  const currentTime = Date.now();
  const timeElapsedInSeconds = Math.floor((currentTime - startTime) / 1000);
  const minutes = String(Math.floor(timeElapsedInSeconds / 60)).padStart(2, '0');
  const seconds = String(timeElapsedInSeconds % 60).padStart(2, '0');
  document.getElementById('timeElapsed').innerText = `${minutes}:${seconds}`;
}




// Avvia la fotocamera all'apertura della pagina
startCamera();