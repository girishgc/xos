"use strict";angular.module("xos.developer",["ngResource","ngCookies","ui.router","xos.helpers"]).config(["$stateProvider",function(e){e.state("developer",{url:"/",template:"<developer-dashboard></developer-dashboard>"})}]).config(["$httpProvider",function(e){e.interceptors.push("NoHyperlinks")}]).directive("developerDashboard",function(){return{restrict:"E",scope:{},bindToController:!0,controllerAs:"vm",templateUrl:"templates/developer-dashboard.tpl.html",controller:["$scope","$timeout","SlicesPlus","Instances","_",function(e,t,n,s,i){var r=this;this.instancePerSliceConfig={data:[],groupBy:"slice",legend:!0,classes:"instance per slice",labelFormatter:function(e){return e.map(function(e){return i.find(r.slices,{id:parseInt(e)}).name})}},this.instancePerSiteConfig={data:[],groupBy:"site",legend:!0,classes:"instance per site"},this.networkPerSliceConfig={data:[],groupBy:"name",legend:!0,classes:"network per slice"},this.tableConfig={columns:[{label:"Name",prop:"name"},{label:"Privileges",prop:"current_user_roles",type:"array"},{label:"Number of Instances (active / total)",type:"custom",formatter:function(e){return e.instance_total_ready+" / "+e.instance_total}},{label:"Active Instances per Sites",type:"object",prop:"instance_distribution_ready"},{label:"Total Instances per Sites",type:"object",prop:"instance_distribution"},{label:"Networks",type:"custom",formatter:function(e){return e.networks.length}}]},n.query().$promise.then(function(e){return r.slices=e,s.query().$promise}).then(function(e){var t=i.reduce(r.slices,function(e,t){if(t.networks.length>1)for(var n=0;n<t.networks.length;n++)e.push({id:t.id,name:t.name,network:t.networks[n]});else 1===t.networks.length&&e.push({id:t.id,name:t.name,network:t.networks[0]});return e},[]),n=i.reduce(r.slices,function(e,t){return i.forEach(Object.keys(t.instance_distribution),function(n){for(var s=0;s<t.instance_distribution[n];s++)e.push({site:n,instance:s})}),e},[]);r.sites=Object.keys(i.groupBy(n,"site")),r.instancePerSliceConfig.data=e,r.instancePerSiteConfig.data=n,r.networkPerSliceConfig.data=t})["catch"](function(e){throw new Error(e)})}]}}),angular.module("xos.developer").run(["$templateCache",function(e){e.put("templates/developer-dashboard.tpl.html",'<div class="row">\n  <div ng-class="{\'col-sm-4\': vm.sites.length > 1 || !vm.sites, \'col-sm-6\': vm.sites.length <= 1}" class="text-center">\n    <h3>Instances per Slice</h3>\n    <xos-smart-pie ng-if="vm.instancePerSliceConfig.data.length > 0" config="vm.instancePerSliceConfig"></xos-smart-pie>\n  </div>\n  <div ng-if="vm.sites.length > 1" class="col-sm-4 text-center">\n    <h3>Instances per Site</h3>\n    <xos-smart-pie ng-if="vm.instancePerSiteConfig.data.length > 0" config="vm.instancePerSiteConfig"></xos-smart-pie>\n  </div>\n  <div ng-class="{\'col-sm-4\': vm.sites.length > 1 || !vm.sites, \'col-sm-6\': vm.sites.length <= 1}" class="text-center">\n    <h3>Network per Slice</h3>\n    <xos-smart-pie ng-if="vm.networkPerSliceConfig.data.length > 0" config="vm.networkPerSliceConfig"></xos-smart-pie>\n  </div>\n</div>\n\n<xos-table config="vm.tableConfig" data="vm.slices"></xos-table>')}]),angular.module("xos.developer").run(["$location",function(e){e.path("/")}]);