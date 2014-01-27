angular.module('ui.bootstrap.slider', ['ui.bootstrap.position'])

.constant('sliderConfig', {
  updateOnDrag: false,
  max: 100,
  min: 0
})

.directive('slider', ['$document', '$position', 'sliderConfig', function($document, $position, sliderConfig) {
    return {
      restrict: 'EA',
      replace: true,
      require: '?ngModel',
      transclude: true,
      scope: {
        transition: '@',
        barClass: '@',
        btnClass: '@'
      },
      templateUrl: 'template/slider/slider.html',
      link: function(scope, element, attrs, ngModel) {

        angular.forEach(sliderConfig, function(value, key) {
          if(key !== 'ngModel') {
            scope[key] = angular.isDefined(attrs[key]) ? scope.$parent.$eval(attrs[key]) : value;
          }
        });

        scope.btn = element.find('button');
        scope.bar = element.children().eq(1).children().eq(0);
        scope.range = scope.max - scope.min;

        scope.hasAnimation = (scope.transition) && (scope.transition !== 'none');

        scope.setAnimation = function(doanimate) {
          if(doanimate)
          {
            scope.btn.css({'transition-property': 'left'});
            scope.bar.css({'transition-property': 'width'});
          } else {
            scope.btn.css({'transition-property': 'none'});
            scope.bar.css({'transition-property': 'none'});
          }
        };

        scope.init = function() {
          if(scope.hasAnimation)
          {
            scope.btn.css({'transition': 'left ' + scope.transition});
            scope.bar.css({'transition': 'width ' + scope.transition});
          }
          scope.setAnimation(scope.hasAnimation);
        };

        scope.getPercentage = function(value) {
          return angular.isNumber(value) ? Math.max(0, Math.min(100, Math.round(100 * (value - scope.min) / scope.range))) : 0;
        };

        scope.percentageToValue = function(perc) {
          return Math.round(scope.min + (scope.range * perc / 100));
        };

        scope.setValid = function(value) {
          var v = parseInt(value,10);
          ngModel.$setValidity('slider', (scope.max >= v) && (v >= scope.min));
          return v;
        };

        ngModel.$formatters.push(scope.setValid);
        ngModel.$parsers.push(scope.setValid);

        scope.update = function() {
          ngModel.$setViewValue(scope.percentageToValue(scope.percent));
          scope.$apply();
        };

        ngModel.$render = function() {
          scope.percent = scope.getPercentage(ngModel.$viewValue);
          scope.redraw();
        };

        scope.redraw = function() {
          scope.btn.css({'display': ngModel.$isEmpty(ngModel.$viewValue) ? 'none' : 'block'});
          scope.btn.css({'left': scope.percent + '%'});
          scope.bar.css({'width': scope.percent + '%'});
        };

        element.on('mousedown', function(event) {
          //updating for window change
          scope.w = $position.position(element).width;
          scope.l = $position.offset(element).left;
        });

        element.on('click', function(event) {
          scope.percent = Math.max(0, Math.min((event.clientX - scope.l) / scope.w * 100, 100));
          scope.update();
          scope.redraw();
        });

        scope.btn.on('mousedown', function(event) {
          if(scope.hasAnimation)
          {
            scope.setAnimation(false);
          }
          event.preventDefault();
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
          scope.percent = Math.max(0, Math.min((event.clientX - scope.l) / scope.w * 100, 100));
          if(scope.updateOnDrag)
          {
            scope.update();
          }
          scope.redraw();
        }

        function mouseup() {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
          if(scope.hasAnimation)
          {
            scope.setAnimation(true);
          }
          if(!scope.updateOnDrag)
          {
            scope.update();
          }
        }

        scope.init();
      }
    };
  }]);
