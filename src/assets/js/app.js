// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}


// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {

    // First get ahold of the legacy getUserMedia, if present
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}




var audioCtx = new (window.AudioContext ||
  window.mozAudioContext ||
  window.msAudioContext ||
  window.oAudioContext ||
  window.webkitAudioContext)();
var audioCtx2 = new (window.AudioContext ||
  window.mozAudioContext ||
  window.msAudioContext ||
  window.oAudioContext ||
  window.webkitAudioContext)();
  var audioCtx3 = new (window.AudioContext ||
    window.mozAudioContext ||
    window.msAudioContext ||
    window.oAudioContext ||
    window.webkitAudioContext)();
//var voiceSelect = document.getElementById("voice");
var source, source2, source3;
var stream, microphoneStream;
var template = document.createElement('audio');
    template.crossOrigin = 'anonymous';

    var template2 = document.createElement('audio');
    template2.crossOrigin = 'anonymous';


var record = document.querySelector('.record');



//analyzier 1 for canvas 1 
var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

var distortion = audioCtx.createWaveShaper();
var gainNode = audioCtx.createGain();
var biquadFilter = audioCtx.createBiquadFilter();
var convolver = audioCtx.createConvolver();


//analyzier 2 for canvas 2 
var analyser2 = audioCtx2.createAnalyser();
analyser2.minDecibels = -90;
analyser2.maxDecibels = -10;
analyser2.smoothingTimeConstant = 0.85;

// comparison
var distortion2 = audioCtx2.createWaveShaper();
var gainNode2 = audioCtx2.createGain();
var biquadFilter2 = audioCtx2.createBiquadFilter();
var convolver2 = audioCtx2.createConvolver();


var analyser3 = audioCtx3.createAnalyser();
analyser3.minDecibels = -90;
analyser3.maxDecibels = -10;
analyser3.smoothingTimeConstant = 0.85;

var distortion3 = audioCtx3.createWaveShaper();
var gainNode3 = audioCtx3.createGain();
var biquadFilter3 = audioCtx3.createBiquadFilter();
var convolver3 = audioCtx3.createConvolver();



// grab audio track via XHR for convolver node

var templateBuffer, comparisonBuffer;

ajaxRequest = new XMLHttpRequest();

ajaxRequest.open('GET', 'https://speechanalyser.blob.core.windows.net/template/Base.wav', true);

ajaxRequest.responseType = 'arraybuffer';


// in real situation this will get the template from database
ajaxRequest.onload = function() {
  var audioData = ajaxRequest.response;

  audioCtx.decodeAudioData(audioData, function(buffer) {
    templateBuffer = buffer;
      songLength = buffer.duration;
      
      console.log('ajaex buffer: ', buffer)

        template.src = 'https://speechanalyser.blob.core.windows.net/template/Base.wav';

         source = audioCtx.createMediaElementSource(template)
         source.connect(analyser);
         console.log('source : ', source)
         analyser.connect(distortion);
         distortion.connect(biquadFilter);
         biquadFilter.connect(convolver);
         convolver.connect(gainNode);
         gainNode.connect(audioCtx.destination);
 // soundSource.loop = true;
 visualize(analyser, "blue");
    }, function(e){ console.log("Error with decoding audio data" + e.err);});


};

ajaxRequest.send();

function playSound(){
  var soundSource
  soundSource = audioCtx.createBufferSource();
  soundSource.buffer = templateBuffer;
  soundSource.playbackRate.value = 1 // playbackControl.value;
    soundSource.connect(audioCtx.destination);
    soundSource.start();
    console.log('ajaex soundSource: ', soundSource)
 template.play();
 visualize(analyser, "blue");
}

ajaxRequest2 = new XMLHttpRequest();

ajaxRequest2.open('GET', 'https://speechanalyser.blob.core.windows.net/template/Comparison1.wav', true);

ajaxRequest2.responseType = 'arraybuffer';


// in real situation this will get the template from database
ajaxRequest2.onload = function() {
  var audioData = ajaxRequest2.response;

  audioCtx3.decodeAudioData(audioData, function(buffer) {
    comparisonBuffer = buffer;
      songLength = buffer.duration;
        template2.src = 'https://speechanalyser.blob.core.windows.net/template/Comparison1.wav';
         source3 = audioCtx3.createMediaElementSource(template2)
         source3.connect(analyser3);
         console.log('source : ', source3)
         analyser3.connect(distortion3);
         distortion3.connect(biquadFilter3);
         biquadFilter3.connect(convolver3);
         convolver3.connect(gainNode3);
         gainNode3.connect(audioCtx3.destination);
         
 // soundSource.loop = true;

    }, function(e){ console.log("Error with decoding audio data" + e.err);});


};

ajaxRequest2.send();

function play2(){
  var soundSource2
  soundSource2 = audioCtx3.createBufferSource();
  soundSource2.buffer = comparisonBuffer;
  soundSource2.playbackRate.value = 1 // playbackControl.value;
    soundSource2.connect(audioCtx3.destination);
    soundSource2.start();
 template2.play();
 visualize(analyser3, "red");
}

//record.onclick = record;



function recordVoice(){

  if(record.id === "") {

    record.id = "activated";
    record.innerHTML = "Stop";
  } else {

    record.id = "";
    record.innerHTML = "Record";
  }
}

// set up canvas context for visualizer 1
var canvas = document.querySelector('.visualizer');
var canvasCtx = canvas.getContext("2d");

// set up canvas context for visualizer 2
var canvas2 = document.querySelector('.visualizer2');
var canvasCtx2 = canvas2.getContext("2d");


var intendedWidth = document.querySelector('.wrapper').clientWidth;

canvas.setAttribute('width',intendedWidth);


canvas2.setAttribute('width',intendedWidth);

var visualSelect = document.getElementById("visual");

var drawVisual, drawVisual2;


 
function startrecording(){
  if(record.id !== ""){
    var track = microphoneStream.getTracks()[0];  
    track.stop();
    record.id = "";
    record.innerHTML = "Record";
    return
  }
  if (navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');
    var constraints = {audio: true}
    navigator.mediaDevices.getUserMedia (constraints)
       .then(
         function(stream) {
           microphoneStream = stream;
           source2= audioCtx2.createMediaStreamSource(stream);
            source2.connect(analyser2);
           analyser2.connect(distortion2);
           distortion2.connect(biquadFilter2);
           biquadFilter2.connect(convolver2);
           convolver2.connect(gainNode2);
            gainNode2.connect(audioCtx2.destination);
            visualize2();
            record.id = "activated";
            record.innerHTML = "Stop";
           // voiceChange();
       })
       .catch( function(err) { console.log('The following gUM error occured: ' + err);})
 } else {
    console.log('getUserMedia not supported on your browser!');
 }
}
//startrecording();
// template
function visualize(analyzer, color) {
  WIDTH = 2000 // canvas.width;
  HEIGHT = canvas.height;





  analyzer.fftSize = 2048;
    var bufferLength = analyzer.fftSize;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);
    console.log('dataArray: ', dataArray)
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    var draw = function() {

      drawVisual = requestAnimationFrame(draw);

      analyzer.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle =  'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = color // 'rgb(0, 0, 0)';

      canvasCtx.beginPath();

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
    };

    draw();

}


// user vouce
function visualize2() {
  WIDTH = canvas2.width;
  HEIGHT = canvas2.height;

    analyser2.fftSize = 2048;
    var bufferLength = analyser2.fftSize;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);
    console.log('dataArray: ', dataArray)
   // canvasCtx2.clearRect(0, 0, WIDTH, HEIGHT);

    var draw = function() {

      drawVisual2 = requestAnimationFrame(draw);

      analyser2.getByteTimeDomainData(dataArray);

      canvasCtx2.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx2.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx2.lineWidth = 2;
      canvasCtx2.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtx2.beginPath();

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i === 0) {
          canvasCtx2.moveTo(x, y);
        } else {
          canvasCtx2.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx2.lineTo(canvas2.width, canvas2.height/2);
      canvasCtx2.stroke();
    };

    draw();

 
  //  canvasCtx2.clearRect(0, 0, WIDTH, HEIGHT);
  //  canvasCtx2.fillStyle = "red";
  //  canvasCtx2.fillRect(0, 0, WIDTH, HEIGHT);


}



