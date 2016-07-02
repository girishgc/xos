/**
 * © OpenCORD
 *
 * Visit http://guide.xosproject.org/devguide/addview/ for more information
 *
 * Created by teone on 5/25/16.
 */

(function () {
  'use strict';

  angular.module('xos.uiComponents')
  /**
    * @ngdoc directive
    * @name xos.uiComponents.directive:xosField
    * @restrict E
    * @description The xos-field directive.
    * This component decide, give a field wich kind of input it need to print.
    * @param {string} name The field name
    * @param {object} field The field configuration:
    * ```
    * {
    *   label: 'Label',
    *   type: 'number', //typeof field
    *   validators: {} // see xosForm for more details
    * }
    * ```
    * @param {mixed} ngModel The field value
    *
    * @example
    
    # Basic Example
    
      <example module="sampleField1">
        <file name="script.js">
          angular.module('sampleField1', ['xos.uiComponents'])
          .factory('_', function($window){
            return $window._;
          })
          .controller('SampleCtrl', function(){
            this.name = 'input-name';
            this.field = {label: 'My String Value:', type: 'string'};
            this.model = 'my string';
          });
        </file>
        <file name="index.html">
          <div ng-controller="SampleCtrl as vm">
            <xos-field ng-model="vm.model" name="vm.name" field="vm.field"></xos-field>
          </div>
        </file>
      </example>
      
      # Possible Values

      <example module="sampleField2">
        <file name="script.js">
          angular.module('sampleField2', ['xos.uiComponents'])
          .factory('_', function($window){
            return $window._;
          })
          .controller('SampleCtrl', function(){
            this.field1 = {
              name: 'number-field',
              field: {label: 'My Number Value:', type: 'number'},
              model: 2
            };

            this.field2 = {
              name: 'date-field',
              field: {label: 'My Date Value:', type: 'date'},
              model: new Date()
            };

            this.field3 = {
              name: 'boolean-field',
              field: {label: 'My Boolean Value:', type: 'boolean'},
              model: true
            };

            this.field4 = {
              name: 'email-field',
              field: {label: 'My Email Value:', type: 'email'},
              model: 'sample@domain.us'
            };
          });
        </file>
        <file name="index.html">
          <div ng-controller="SampleCtrl as vm">
            <xos-field ng-model="vm.field1.model" name="vm.field1.name" field="vm.field1.field"></xos-field>
            <xos-field ng-model="vm.field2.model" name="vm.field2.name" field="vm.field2.field"></xos-field>
            <xos-field ng-model="vm.field3.model" name="vm.field3.name" field="vm.field3.field"></xos-field>
            <xos-field ng-model="vm.field4.model" name="vm.field4.name" field="vm.field4.field"></xos-field>
          </div>
        </file>
      </example>

      # This element is recursive

      <example module="sampleField3">
        <file name="script.js">
          angular.module('sampleField3', ['xos.uiComponents'])
          .factory('_', function($window){
            return $window._;
          })
          .controller('SampleCtrl', function(){
            this.name1 = 'input-name';
            this.field1 = {label: 'My Object Field:', type: 'object'};
            this.model1 = {
              name: 'Jhon',
              age: '25',
              email: 'jhon@thewall.ru',
              active: true
            };

            this.name2 = 'another-name';
            this.field2 = {
              label: 'Empty Object Field',
              type: 'object',
              properties: {
                foo: {
                  label: 'FooLabel:',
                  type: 'string',
                  validators: {
                    required: true
                  }
                },
                bar: {
                  type: 'number'
                }
              }
            }
          });
        </file>
        <file name="index.html">
          <div ng-controller="SampleCtrl as vm">
            <h4>Autogenerated object field</h4>
            <xos-field ng-model="vm.model1" name="vm.name1" field="vm.field1"></xos-field>

            <h4>Configured object field</h4>
            <xos-field ng-model="vm.model2" name="vm.name2" field="vm.field2"></xos-field>
          </div>
        </file>
      </example>
    */
  .directive('xosField', function(RecursionHelper){
    return {
      restrict: 'E',
      scope: {
        name: '=',
        field: '=',
        ngModel: '='
      },
      template: `
        <label ng-if="vm.field.type !== 'object'">{{vm.field.label}}</label>
            <input
              xos-custom-validator custom-validator="vm.field.validators.custom || null"
              ng-if="vm.field.type !== 'boolean' && vm.field.type !== 'object' && vm.field.type !== 'select'"
              type="{{vm.field.type}}"
              name="{{vm.name}}"
              class="form-control"
              ng-model="vm.ngModel"
              ng-minlength="vm.field.validators.minlength || 0"
              ng-maxlength="vm.field.validators.maxlength || 2000"
              ng-required="vm.field.validators.required || false" />
              <select class="form-control" ng-if ="vm.field.type === 'select'"
                name = "{{vm.name}}"
                ng-options="item.id as item.label for item in vm.field.options"
                ng-model="vm.ngModel"
                ng-required="vm.field.validators.required || false">
                </select>
            <span class="boolean-field" ng-if="vm.field.type === 'boolean'">
              <a href="#"
                class="btn btn-success"
                ng-show="vm.ngModel"
                ng-click="vm.ngModel = false">
                <i class="glyphicon glyphicon-ok"></i>
              </a>
              <a href="#"
                class="btn btn-danger"
                ng-show="!vm.ngModel"
                ng-click="vm.ngModel = true">
                <i class="glyphicon glyphicon-remove"></i>
              </a>
            </span>
            <div
              class="panel panel-default object-field"
              ng-if="vm.field.type == 'object' && (!vm.isEmptyObject(vm.ngModel) || !vm.isEmptyObject(vm.field.properties))"
              >
              <div class="panel-heading">{{vm.field.label}}</div>
              <div class="panel-body">
                <div ng-if="!vm.field.properties" ng-repeat="(k, v) in vm.ngModel">
                  <xos-field
                    name="k"
                    field="{label: vm.formatLabel(k), type: vm.getType(v)}"
                    ng-model="v">
                  </xos-field>
                </div>
                <div ng-if="vm.field.properties" ng-repeat="(k, v) in vm.field.properties">
                  <xos-field
                    name="k"
                    field="{
                      label: v.label || vm.formatLabel(k),
                      type: v.type,
                      validators: v.validators
                    }"
                    ng-model="vm.ngModel[k]">
                  </xos-field>
                </div>
              </div>
            </div>
      `,
      bindToController: true,
      controllerAs: 'vm',
      // the compile cicle is needed to support recursion
      compile: function (element) {
        return RecursionHelper.compile(element);
      },
      controller: function($attrs, XosFormHelpers, LabelFormatter){

        if(!this.name){
          throw new Error('[xosField] Please provide a field name');
        }
        if(!this.field){
          throw new Error('[xosField] Please provide a field definition');
        }
        if(!this.field.type){
          throw new Error('[xosField] Please provide a type in the field definition');
        }
        if(!$attrs.ngModel){
          throw new Error('[xosField] Please provide an ng-model');
        }
        this.getType = XosFormHelpers._getFieldFormat;
        this.formatLabel = LabelFormatter.format;

        this.isEmptyObject = o => o ? Object.keys(o).length === 0 : true;
      }
    }
  })

/**
 * @ngdoc directive
 * @name xos.uiComponents.directive:xosCustomValidator
 * @restrict A
 * @description The xosCustomValidator directive.
 * This component apply a custom validation function
 * @param {function} customValidator The function that execute the validation.
 *
 * You should do your validation here and return true | false,
 * or alternatively you can return an array [errorName, true|false]
 */
  .directive('xosCustomValidator', function(){
    return {
      restrict: 'A',
      scope: {
        fn: '=customValidator'
      },
      require: 'ngModel',
      link: function(scope, element, attr, ctrl){
        if(!angular.isFunction(scope.fn)){
          return;
        }

        function customValidatorWrapper(ngModelValue) {
          const valid = scope.fn(ngModelValue);
          if(angular.isArray(valid)){
            // ES6 spread rocks over fn.apply()
            ctrl.$setValidity(...valid);
          }
          else{
            ctrl.$setValidity('customValidation', valid);
          }
          return ngModelValue;
        }

        ctrl.$parsers.push(customValidatorWrapper);
      }
    };
  });
})();