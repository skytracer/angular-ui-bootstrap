A fairly light slider directive based on progress bars and a button.

It supports optional 'min','max' attributes, transition animations and lazy model update.
Changing the value can be done by dragging the handle or clicking the bar.

### Settings ###

#### `<slider>` ####


 * `ng-model` <i class="glyphicon glyphicon-eye-open"></i> :
    The current value of slider.

 * `update-on-drag`:_(Default: false)_:
    * true:The model is updated as the user drags the handle;
    * false:The model is updated when the handle is released

 * `max`
 	_(Default: 100)_ :
 	A number that specifies the maximum permitted value.

 * `min`
 	_(Default: 0)_ :
 	A number that specifies the minimum permitted value.

 * `transition`
 	_(Default: null)_ :
        A string comprising the duration, type and delay of an animation.
        Eg: the '0.5s ease 0.1s' from a normal transition declaration: 'all 0.5s ease 0.1s'
        The animation is temporarly disabled when the handle is used to change value drag.
