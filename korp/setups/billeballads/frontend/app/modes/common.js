settings.senseAutoComplete = "<autoc model='model' placeholder='placeholder' type='sense' text-in-field='textInField'/>";

var liteOptions = {
    "is": "=",
    "is_not": "!="
}
var setOptions = {
    "is": "contains",
    "is_not": "not contains"
};
var probabilitySetOptions = {
    "is": "highest_rank",
    "is_not": "not_highest_rank",
    "contains": "rank_contains",
    "contains_not": "not_rank_contains",
};

var defaultContext = {
    "1 sentence": "1 sentence"
};

var spContext = {
    "1 sentence": "1 sentence",
    "1 paragraph": "1 paragraph"
};
var spWithin = {
    "sentence": "sentence",
    "paragraph": "paragraph"
};


/*
    ==================================================================
    BELOW: GlOBAL SETTINGS THAT ARE REQUIRED, YET UNSET by DEFAULT
    ==================================================================
*/

// The statistics tab will fail if this setting is left undefined [sg]
settings.groupStatistics = [];

// AFAIK unused in our setups, but also needs to be defined [sg]
lemgramResults = false;


module.exports = {
  spWithin,
  spContext,
  defaultContext,
  setOptions,
  liteOptions,
}
