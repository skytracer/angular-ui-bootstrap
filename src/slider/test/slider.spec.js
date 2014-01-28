describe('slider directive', function() {
    var $rootScope, element, sliderelement, getBar, getBtn;
    beforeEach(module('ui.bootstrap.slider'));
    beforeEach(module('template/slider/slider.html'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $rootScope.slidervalue = 22;
        $rootScope.slidermax = 200;
        $rootScope.slidermin = -50;

        getBar = function() {
            return sliderelement.children().eq(1).children().eq(0);
        };

        getBtn = function() {
            return sliderelement.find('button');
        };
    }));

    describe('slider default construct', function() {
        beforeEach(inject(function($compile) {
            sliderelement = $compile('<slider max="slidermax" ng-model="slidervalue"></slider>')($rootScope);
            $rootScope.$digest();
        }));

        it('checks css classes', function() {
            expect(sliderelement).toHaveClass('progress-slider');
            expect(sliderelement.children().eq(1)).toHaveClass('progress');
            expect(getBar()).toHaveClass('progress-bar');
            expect(getBtn()).toHaveClass('btn');
        });

        it('has a "bar" element with expected width and a "handle" with expected position', function() {
            expect(getBar().css('width')).toBe('11%');
            expect(getBtn().css('left')).toBe('11%');
        });

        it('adjusts the "bar" width when value changes', function() {
            $rootScope.slidervalue = 60;
            $rootScope.$digest();
            expect(getBar().css('width')).toBe('30%');
        });

        it('adjusts the "handle" position when value changes', function() {
            $rootScope.slidervalue = 60;
            $rootScope.$digest();
            expect(getBtn().css('left')).toBe('30%');
        });

        it('should have no transition as default', function() {
            expect(getBar().css('transition-property')).toBe('none');
        });

    });

    describe('validity check', function() {
        beforeEach(inject(function($compile, $position) {
            sliderelement = $compile('<slider max="slidermax" min="slidermin" ng-model="slidervalue"></slider>')($rootScope);
            $rootScope.$digest();
        }));

        it('should bave invalid class', function() {
            $rootScope.slidervalue = $rootScope.slidermax + 10;
            $rootScope.$digest();
            expect(sliderelement).toHaveClass('ng-invalid');
            $rootScope.slidervalue = $rootScope.slidermin - 10;
            $rootScope.$digest();
            expect(sliderelement).toHaveClass('ng-invalid');
        });

        it('should not bave a handle if value is not number', function() {
            $rootScope.slidervalue = 'somevalue';
            $rootScope.$digest();
            expect(getBtn().css('display')).toBe('none');
        });

    });

    describe('user interactions', function() {
        beforeEach(inject(function($compile, $position) {
            spyOn($position, 'position').andReturn({width: 400, left: 100});
            sliderelement = $compile('<slider max="slidermax" ng-model="slidervalue"></slider>')($rootScope);
            $rootScope.$digest();
        }));

        it('should update handle, bar and value when progressbar is clicked', function() {
            var emdown = new $.Event('mousedown');
            var eclick = new $.Event('click');
            eclick.clientX = 100;
            sliderelement.trigger(emdown);
            sliderelement.trigger(eclick);
            $rootScope.$digest();
            expect(getBtn().css('left')).toBe('25%');
            expect(getBar().css('width')).toBe('25%');
            expect($rootScope.slidervalue).toBe(50);
        });

        it('should update position and value when button is dragged', inject(function($document) {
            var emdown = new $.Event('mousedown');
            var emmove = new $.Event('mousemove');
            var emup = new $.Event('mouseup');
            emmove.clientX = 200;
            sliderelement.trigger(emdown);
            getBtn().trigger(emdown);
            $document.trigger(emmove);
            $document.trigger(emup);
            $rootScope.$digest();
            expect(getBtn().css('left')).toBe('50%');
            expect($rootScope.slidervalue).toBe(100);
        }));
    });

    describe('"transition" attribute', function() {
        var TRANSITION = '1s ease 0s';
        beforeEach(inject(function($compile) {
            sliderelement = $compile('<slider ng-model="slidervalue" transition="' + TRANSITION + '"></slider>')($rootScope);
            $rootScope.$digest();
        }));

        it('should use correct transition', function() {
            var css = getBtn().css('transition');
            expect(getBtn().css('transition')).toBe('left ' + TRANSITION);
            expect(getBar().css('transition')).toBe('width ' + TRANSITION);
        });
    });

    describe('additional classes', function() {
        beforeEach(inject(function() {
            sliderelement = $compile('<slider ng-model="slidervalue" bar-class="progress-bar-success" btn-class="btn-sm"></slider>')($rootScope);
            $rootScope.$digest();
        }));

        it('should have correct classes', function() {
            expect(getBar()).toHaveClass('progress-bar-success');
            expect(getBtn()).toHaveClass('btn-sm');
        });
    });
});
