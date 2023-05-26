// filedownload.js
// Functions providing file download functionality for the Korp exporter.
// Philip Diderichsen, 2023

function downloadButtonClick(socket) {
    // Function that runs when the download button is clicked.
    document.getElementById('download-button').disabled = true;
    let uniqueId = generateUniqueId();
    console.log('UID: ' + uniqueId);
    var newSearchString = window.location.search;
    // Specify token variables to include
    let tokenVarValues = getOptgroupChoicesURIstring("token-vars");
    let tokenRegex = new RegExp("show=[^&]+");
    if (tokenVarValues) {
        newSearchString = newSearchString.replace(tokenRegex, "show=" + tokenVarValues);
    }
    // Specify structural variables to include
    let structVarValues = getOptgroupChoicesURIstring("struct-vars");
    let structRegex = new RegExp("show_struct=[^&]+");
    if (structVarValues) {
        newSearchString = newSearchString.replace(structRegex, "show_struct=" + structVarValues);
    }
    // Initiate the download by calling the /getfile endpoint
    fetch('/getfile/csv' + newSearchString + '&uid=' + uniqueId)
        .then(response => response.json())
        .then(data => {
            // Check the status and start tracking progress
            if (data.status === 'Download started') {
                trackProgress(socket, uniqueId);
            }
        })
        .catch(error => console.error('An error occurred:', error));
}


function getOptgroupChoicesURIstring(OptgroupID) {
    // Get selected values of a multi-select menu optgroup as a comma-separated, URI encoded list.
    var optgroup = document.getElementById(OptgroupID);
    var selectedValues = [];
    for (var i = 0; i < optgroup.children.length; i++) {
        if (optgroup.children[i].selected) {
            selectedValues.push(optgroup.children[i].value);
        }
    }
    return encodeURIComponent(selectedValues.join(','));
}


function resumeButtonClick(socket, uniqueId) {
    // Function to run when the download button is in resume mode.
    document.getElementById('warnings').innerHTML = '<div></div>';
    document.getElementById('download-button').disabled = true;
    socket.emit('resume_download', uniqueId);
}


function generateUniqueId() {
    // Generate a unique download/request ID to keep different downloads from being mixed up.
    return '_' + Math.random().toString(36).substr(2, 9);
}


function trackProgress(socket, uniqueId) {
    // Function to track progress and initiate the download once it's ready
    document.getElementById('progress-container').style.display = 'flex';  // Show progress bar.
    let startTime = new Date();
    let elapsedTime = 0;
    const n_tries = 10;  // Number of times to try resuming download on server errors
    let tries = 0;
    let percentageToTimes = {};
    let progressRates = [];
    let progressInterval = emitStatus(socket, uniqueId);  // Emit progress status and keep a handle on the interval.
    // Listen for status updates from the server
    socket.on('status', function(data) {
        let prog = data.progress;
        let stat = data.status;
        console.log('Status: ' + stat);
        if (stat.toString().startsWith('Aborted')) {
            if (stat.includes('ReadTimeout')) {
                // Resume automatically, but don't resume endlessly (Note: n_tries = cumulative total tries)
                tries += 1;
                if (tries <= n_tries) {
                    console.log(stat + '. Resuming ... (x ' + tries + ')');
                    startTime = new Date();
                    socket.emit('resume_download', uniqueId);
                }
                else {
                    // Change the button to a resume button for resuming manually
                    socket.emit('pause_download', uniqueId);
                    msg = stat + '. Try resuming by clicking again.'
                    document.getElementById('warnings').innerHTML = '<div id="warning">' + msg + '</div>';
                    // Reset tries to grant a new set of tries.
                    tries = 0;
                }
            }
            else {
                socket.disconnect();
                document.getElementById('warnings').innerHTML = '<div id="warning">' + stat + '</div>';
            }
        }
        else if (stat.toString().startsWith('Paused')) {
            document.getElementById('download-button').disabled = false;
            document.getElementById('download-button').innerText = 'Genoptag';
            $('#download-button').off('click');
            $('#download-button').on('click', function() { resumeButtonClick(socket, uniqueId); });
        }
        else {
            // For the correct uid, update progress bar and percentage.
            updateProgress(uniqueId, data, progressInterval, socket);
            elapsedTime = (new Date() - startTime) / 1000;  // Elapsed time in seconds.
            // Add an empty array when a new percentage is first encountered, then add the time value.
            if (!percentageToTimes[prog]) {
                percentageToTimes[prog] = [];
            }
            percentageToTimes[prog].push(elapsedTime);
            // Iterate over all but the last array of times (as the last one is assumed to be incomplete).
            for (let progressPercentage of Object.keys(percentageToTimes).slice(0, -1)) {
                progressRate = getProgressRate(progressPercentage, percentageToTimes);
                if (!progressRates.includes(progressRate)) {  // Add to overall array of progress rates.
                    progressRates.push(progressRate);
                }
            }
            // Calculate estimated time left - when there are enough data to skip the first, skewed data.
            if (progressRates.length > 3) {
                // Calculate a current average progress rate based on the last n observations.
                let estimatedTimeLeft = getTimeRemainingString(elapsedTime, progressRates);
                let timeRemainingString = formatTime(estimatedTimeLeft);
                document.getElementById('timer-val').innerText = timeRemainingString;
                let now = new Date() / 1000;
                console.log('Time: ' + formatTime(now));
                console.log('Elapsed time: ' + elapsedTime);
                console.log('Remaining: ' + estimatedTimeLeft);
            }
            if (prog == 100) {
                    document.getElementById('timer-val').innerText = "";
            }
        }
    });
    // Handle server aborts
    socket.on('abort', function(data) {
        if (uniqueId === data.uid) {
            socket.disconnect();
            document.getElementById('warnings').innerHTML = '<div id="warning">' + data.reason + '</div>';
        }
    });
}


function emitStatus(socket, uniqueId) {
    // Set up an interval to periodically check the download progress.
    let progressInterval = setInterval(function() {
        socket.emit('get_progress', uniqueId);
    }, 1000); // Emit status every 1000 ms.
    return progressInterval
}


function getProgressRate(progressPercentage, percentageToTimes) {
    // Calculate a progress rate from total (max) elapsed time for the given progress percentage.
    let timeArray = percentageToTimes[progressPercentage];
    let maxTime = Math.max(...timeArray);
    let progressRate = progressPercentage / maxTime;
    return progressRate;
}


function getTimeRemainingString(elapsedTime, progressRates) {
    // Get remaining download time based on elapsed time and latest progress rates seen.
    let latestRates = progressRates.slice(-3);  // n latest progress rates.
    let latestSum = latestRates.reduce((accumulator, currValue) => accumulator + currValue, 0);
    let currentProgressRate = latestSum / latestRates.length;
    let estimatedProgress = elapsedTime * currentProgressRate;
    let estimatedProgressLeft = 100 - estimatedProgress;
    let estimatedTimeLeft = estimatedProgressLeft / currentProgressRate;
    return estimatedTimeLeft;
}


function formatTime(secondsTimeFloat) {
    // Format time in 00:00:00 format.
    if (secondsTimeFloat < 0) {
        return ''
    }
    let secondsTime = Math.floor(secondsTimeFloat);
    let hours = Math.floor(secondsTime / 3600);
    secondsTime %= 3600;
    let minutes = Math.floor(secondsTime / 60);
    let seconds = secondsTime % 60;
    const formattedSeconds = String(seconds).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedHours = String(hours).padStart(2, '0');
    let timeString = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    return timeString;
}


function updateProgress(uid, data, progressInterval, socket) {
    // Do the actual updating of the progress bar - and trigger the actual download when reaching 100%
    var progress = data.progress;
    console.log('Progress: ' + progress.toFixed(2));
    document.getElementById('progress-val').innerText = Math.floor(progress) + '%';
    document.getElementById('progress-bar').value = progress;
    // If the download is complete, clear the interval and initiate the actual download
    if (progress === 100) {
        clearInterval(progressInterval);
        socket.disconnect();
        console.log('Socket disconnected');
        document.getElementById('download-label').innerText = 'Færdig.';
        // Download file when ready
        fileDownload(uid);
    }
}


function fileDownload(uniqueId) {
    // Do the actual file download
    setTimeout(function() {
        let downloadUrl = (window.location.origin + window.location.pathname).replace("download/csv", "download2/") + uniqueId;
        // Create invisible link and "click" it to initiate download
        var link = document.createElement('a');
        link.href = downloadUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 100);
}