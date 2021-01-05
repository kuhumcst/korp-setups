settings.senseAutoComplete = "<autoc model='model' placeholder='placeholder' type='sense' text-in-field='textInField'/>";

var karpLemgramLink = "https://spraakbanken.gu.se/karp/#?mode=DEFAULT&search=extended||and|lemgram|equals|<%= val.replace(/:\\d+/, '') %>";

var liteOptions = {
    "is": "=",
    "is_not": "!="
}
var setOptions = {
    "is": "contains",
    "is_not": "not contains"
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

var attrs = {};  // positional attributes
var sattrs = {}; // structural attributes

attrs.msd = {
    label: "msd",
    opts: settings.defaultOptions,
    extendedTemplate: '<input ng-model="input" class="arg_value" escaper ng-model-options=\'{debounce : {default : 300, blur : 0}, updateOn: "default blur"}\'>' +
    '<span ng-click="onIconClick()" class="fa fa-info-circle"></span>',
    extendedController: function($scope, $uibModal) {
        var modal = null;

        $scope.onIconClick = function() {
            var msdHTML = settings.markup.msd;
            modal = $uibModal.open({
                template: '<div>' +
                                '<div class="modal-header">' +
                                    '<h3 class="modal-title">{{\'msd_long\' | loc:lang}}</h3>' +
                                    '<span ng-click="clickX()" class="close-x">×</span>' +
                                '</div>' +
                                '<div class="modal-body msd-modal" ng-click="msdClick($event)" ng-include="' + msdHTML + '"></div>' +
                            '</div>',
                scope: $scope
            })
        }
        $scope.clickX = function(event) {
            modal.close()
        }
        $scope.msdClick = function(event) {
            val = $(event.target).parent().data("value")
            if(!val) return;
            $scope.input = val;
            modal.close();
        }
    }
};
attrs.baseform = {
    label: "baseform",
    type: "set",
    opts: settings.defaultOptions,
    extendedTemplate: "<input ng-model='model' >",
    order: 1
};
attrs.prefix = {
    label: "prefix",
    type: "set",
    opts: setOptions,
    stringify: function(lemgram) {
        return util.lemgramToString(lemgram, true);
    },
    externalSearch: karpLemgramLink,
    internalSearch: true,
    extendedTemplate: "<autoc model='model' placeholder='placeholder' type='lemgram' variant='affix' text-in-field='textInField'/>"
};
attrs.suffix = {
    label: "suffix",
    type: "set",
    opts: setOptions,
    stringify: function(lemgram) {
        return util.lemgramToString(lemgram, true);
    },
    externalSearch: karpLemgramLink,
    internalSearch: true,
    extendedTemplate: "<autoc model='model' placeholder='placeholder' type='lemgram' variant='affix' text-in-field='textInField'/>"
};

/*
    ==================================================================
    BELOW: GlOBAL SETTINGS THAT ARE REQUIRED, YET UNSET by DEFAULT
    ==================================================================
*/

// The statistics tab will fail if this setting is left undefined [sg]
settings.groupStatistics = []

// AFAIK unused in our setups, but also needs to be defined [sg]
lemgramResults = false

/*
    =================================================================
                       END OF CST-SPECIFIC ADDITIONS
    ==================================================================
*/

module.exports = {
  spWithin,
  spContext,
  defaultContext,
  attrs,
  sattrs,
  setOptions,
  liteOptions,
}
