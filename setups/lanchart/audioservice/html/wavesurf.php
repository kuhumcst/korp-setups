<html lang="en">
  <head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>wavesurfer.js</title>
  <script src="https://unpkg.com/wavesurfer.js"></script>
  <script src="https://unpkg.com/wavesurfer.js/dist/plugin/wavesurfer.spectrogram.js"></script>
  
  </head>
  <body>
  <!--
  <form method="GET">
  from <input name="from" type="text" value="<?php echo (isset($_GET['from'])?$_GET['from']:'300'); ?>" size="5">s - length
  <input name="len" type="text" value="<?php echo (isset($_GET['len'])?$_GET['len']:'5'); ?>" size="4">s. File:
  <input name="file" type="text" value="<?php echo (isset($_GET['file'])?$_GET['file']:'bysoc3gl-09-AWK%2BMKZ%2BMMO%2BMOB_5007_543905.wav'); ?>" size="20">
  <input type="submit" name="submit" value="submit">
  </form>
  -->
  <div id="waveform"></div>
  <div id="wave-spectrogram"></div>
  <div class="controls">
  <button class="btn btn-primary" data-action="play">Play / Pause</button>
  </div>

<?php
if (isset($_GET['from']) && isset($_GET['len']) && isset($_GET['file'])  ) {
# Treat plusses and "%2B"s the same by escaping any plusses in the URL.
if(strpos($_SERVER["QUERY_STRING"], "+") !== false){
    $_SERVER["QUERY_STRING"] = str_replace("+", "%2B", $_SERVER["QUERY_STRING"]);
    parse_str($_SERVER["QUERY_STRING"], $_GET);
}
# Extract all GET parameters to $<paramname>.
extract($_GET);
?>
  <script>
'use strict';
  var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    plugins: [
      WaveSurfer.spectrogram.create({
        wavesurfer: wavesurfer,
        container: '#wave-spectrogram',
        labels: true
      })
    ]
  });
  wavesurfer.load('audioservice.php?from=<?php echo $from,'&len=',$len,
                  '&file=',urlencode($file); ?>');
  var button = document.querySelector('[data-action="play"]');
  button.addEventListener('click', wavesurfer.playPause.bind(wavesurfer));
  </script>
<?php
}
?>
</body>
</html>
