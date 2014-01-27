var SliderDemoCtrl = function($scope) {
  $scope.max = 200;
  var value = Math.floor((Math.random() * 100) + 1);
  $scope.dynamic = value;
};
