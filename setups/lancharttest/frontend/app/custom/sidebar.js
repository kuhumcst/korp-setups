export default {
    partiturLink: {
         template: `<span>"{{mywordform}}" (<a href="http://localhost:5000/?label={{mycorpuslabel}}&start={{wordData['xmin']}}&end={{+(wordData['xmin']) + 10}}&file={{myfilename}}&lang={{lang}}" target="_blank"><span rel="localize[show_partitur]">Vis partitur ..</span></a>)</span><div style="margin-bottom: 5px"></div>`,
         controller: ["$scope", function($scope) {
             $scope.mywordform = $scope.wordData['word'];
             $scope.myfilename = encodeURIComponent($scope.sentenceData["text_filename"]);
             $scope.mycorpuslabel = $scope.sentenceData['corpus_label'];
         }]
     }
}   