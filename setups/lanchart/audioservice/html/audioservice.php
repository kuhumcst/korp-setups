<?php
# Treat plusses and "%2B"s the same by escaping any plusses in the URL.
if(strpos($_SERVER["QUERY_STRING"], "+") !== false){
    $_SERVER["QUERY_STRING"] = str_replace("+", "%2B", $_SERVER["QUERY_STRING"]);
    parse_str($_SERVER["QUERY_STRING"], $_GET);
}

# Parse parameters to ensure the right format for time specs and file names.
if (!preg_match('/^[0-9.]+$/', $_GET['from']) || !preg_match('/^[0-9.]*$/', $_GET['len'])) { exit; }
if (!preg_match('~^[a-zA-Z0-9/+_.-]+$~',$_GET['file'])) { exit; }

# Header for testing on Korp (CORS circumvention)
if(strpos($_SERVER['HTTP_HOST'], 'localhost') >= 0){
    header('Access-Control-Allow-Origin: http://localhost:5000');
}

# Header for outputting mp3 (format determined in ffmpeg by -f mp3)
header('Content-Type: audio/mpeg');

# Get sound snippets using ffmpeg.
# -ss start time
# -t length of extracted sound (might have to calculate)
# -i input file on server (either mount network drive on webserver (mount.cifs ...) or just copy files over)
# -f wav - output format
# -v fatal - only fatal messages (otherwise server logs will get a bit full!)
# - (end) output to STDOUT (i.e. through apache to browser)
$ffmpegcommand = sprintf("ffmpeg -ss %f -t %f -i /opt/sounds/%s -f mp3 -b 128 -v fatal -",
                         $_GET['from'], $_GET['len'], escapeshellarg($_GET['file']));
system($ffmpegcommand);

?>
 