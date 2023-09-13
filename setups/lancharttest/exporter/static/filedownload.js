// filedownload.js
// Functions providing file download functionality for the Korp exporter.
// Philip Diderichsen, 2023

function downloadButtonClick(socket) {
    // Function that runs when the download button is clicked.
    var uniqueId = generateUniqueId();
    console.log('uniqueId: ' + uniqueId);

    // Initiate the download by calling the /getfile endpoint
    //fetch('/getfile2/csv?uid=' + uniqueId)
    fetch('/getfile/csv' + window.location.search + '&uid=' + uniqueId)
        .then(response => response.json())
        .then(data => {
            // Check the status and start tracking progress
            if (data.status === 'Download started') {
                trackProgress(socket, uniqueId);
            }
        })
        .catch(error => console.error('An error occurred:', error));
}


function generateUniqueId() {
    // Generate a unique download/request ID to keep different downloads from being mixed up.
    return '_' + Math.random().toString(36).substr(2, 9);
}


function trackProgress(socket, uniqueId) {
    // Function to track progress and initiate the download once it's ready
    console.log('Tracking progress for unique ID: ' + uniqueId);
    // Show the progress bar
    document.getElementById('progress-container').style.visibility = 'visible';
    // Set up an interval to periodically check the download progress
    var progressInterval = setInterval(function() {
        console.log('Emitting get_status ..');
        socket.emit('get_status', uniqueId);
    }, 100); // Adjust the interval as needed

    // Listen for status updates from the server
    socket.on('status', function(data) {
        var uid = data.uid;
        console.log('Uid: ' + uid);
        // For the correct uid, update progress bar and percentage.
        if (uid === uniqueId) {
            updateProgress(uid, data, progressInterval, socket);
        }
    });

    // Handle server aborts
    socket.on('abort', function(data) {
        socket.disconnect();
        document.getElementById('warnings').innerHTML = '<div id="warning">' + data.reason + '</div>';
    });

}


function updateProgress(uid, data, progressInterval, socket) {
    // Do the actual updating of the progress bar - and trigger the actual download when reaching 100%
    console.log('Correct uid: ' + uid);
    var progress = data.progress;
    var progress2 = Math.floor(data.progress2);
    console.log('Progress: ' + progress);
    console.log('Progress 2: ' + progress2);
    document.getElementById('progress-bar').style.width = progress + '%';
    document.getElementById('progress-bar-label').innerText = progress + '%';

    // If the download is complete, clear the interval and initiate the actual download
    if (progress === 100) {
        clearInterval(progressInterval);
        socket.disconnect();
        console.log('Socket disconnected');
        document.getElementById('label-small').innerText = 'Formatering færdig.'
        // Download file when ready
        fileDownload(uid);
    }
}


function fileDownload(uniqueId) {
    // Do the actual file download
    setTimeout(function() {
        // var downloadUrl = '/getfile2/csv' + window.location.search + '&uid=' + uniqueId;
        var downloadUrl = '/download2/' + uniqueId;
        console.log('downloadUrl: ' + downloadUrl);

        // Create invisible link and "click" it to initiate download
        var link = document.createElement('a');
        link.href = downloadUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 100);
}