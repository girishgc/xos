"use strict";angular.module("xos.tenant",["ngResource","ngCookies","ui.router","xos.helpers"]).config(["$stateProvider",function(e){e.state("user-list",{url:"/",template:"<users-list></users-list>"}).state("site",{url:"/site/:id",template:"<site-detail></site-detail>"}).state("createslice",{url:"/site/:site/slice/:id?",template:"<create-slice></create-slice>"})}]).config(["$httpProvider",function(e){e.interceptors.push("NoHyperlinks")}]).directive("usersList",function(){return{restrict:"E",scope:{},bindToController:!0,controllerAs:"vm",templateUrl:"templates/users-list.tpl.html",controller:["Sites","SlicesPlus",function(e,t){var i=this;this.tableConfig={columns:[{label:"Site1",prop:"name",link:function(e){return"#/site/"+e.id}},{label:"Allocated",prop:"instance_total"},{label:"Ready",prop:"instance_total_ready"}]},e.query().$promise.then(function(e){return i.sites=e,t.query().$promise}).then(function(e){i.slices=e,i.site_list=i.returnData(i.sites,i.slices)})["catch"](function(e){throw new Error(e)}),this.returnData=function(e,t){var i,s=0,l=[];for(i=0;i<e.length;i++){var n=0,a=0;for(s=0;s<t.length;s++)null!=e[i].id&&null!=t[s].site&&e[i].id===t[s].site&&(n+=t[s].instance_total,a+=t[s].instance_total_ready);var o={id:e[i].id,name:e[i].name,instance_total:n,instance_total_ready:a};l.push(o)}return l}}]}}).directive("siteDetail",function(){return{restrict:"E",scope:{},bindToController:!0,controllerAs:"sl",templateUrl:"templates/slicelist.html",controller:["SlicesPlus","$stateParams",function(e,t){var i=this;this.siteId=t.id,this.tableConfig={columns:[{label:"Slice List",prop:"name",link:function(e){return"#/site/"+e.site+"/slice/"+e.id}},{label:"Allocated",prop:"instance_total"},{label:"Ready",prop:"instance_total_ready"}]},e.query({site:t.id}).$promise.then(function(e){i.sliceList=e})["catch"](function(e){throw new Error(e)})}]}}).directive("createSlice",function(){return{restrict:"E",scope:{},bindToController:!0,controllerAs:"cs",templateUrl:"templates/createslice.html",controller:["Slices","SlicesPlus","Sites","Images","$stateParams","$http","$state","$q",function(e,t,i,s,l,n,a,o){var r=this;this.config={exclude:["site","password","last_login","mount_data_sets","default_flavor","creator","exposed_ports","networks","omf_friendly","omf_friendly","no_sync","no_policy","lazy_blocked","write_protect","deleted","backend_status","backend_register","policed","enacted","updated","created","validators","humanReadableName"],formName:"SliceDetails",feedback:{show:!1,message:"Form submitted successfully !!!",type:"success"},actions:[{label:"Save",icon:"ok",cb:function(e,t){d(e,t).then(function(){a.go("site",{id:r.model.site})})},"class":"success"},{label:"Save and continue editing",icon:"ok",cb:function(e,t){d(e,t)},"class":"primary"},{label:"Save and add another",icon:"ok",cb:function(e,t){d(e,t).then(function(){a.go("createslice",{site:r.model.site,id:""})})},"class":"primary"}],fields:{site:{label:"Site",type:"select",validators:{required:!0},hint:"The Site this Slice belongs to",options:[]},name:{label:"Name",type:"string",hint:"The Name of the Slice",validators:{required:!0}},serviceClass:{label:"ServiceClass",type:"select",validators:{required:!0},hint:"The Site this Slice belongs to",options:[{id:1,label:"Best effort"}]},enabled:{label:"Enabled",type:"boolean",hint:"Status for this Slice"},description:{label:"Description",type:"string",hint:"High level description of the slice and expected activities",validators:{required:!1,minlength:10}},service:{label:"Service",type:"select",validators:{required:!1},options:[{id:0,label:"--------"}]},slice_url:{label:"Slice url",type:"string",validators:{required:!1,minlength:10}},max_instances:{label:"Max Instances",type:"number",validators:{required:!1,min:0}},default_isolation:{label:"Default Isolation",type:"select",validators:{required:!1},options:[{id:"vm",label:"Virtual Machine"},{id:"container",label:"Container"},{id:"container_vm",label:"Container in VM"}]},default_image:{label:"Default image",type:"select",validators:{required:!1},options:[]},network:{label:"Network",type:"select",validators:{required:!1},options:[{id:"default",label:"Default"},{id:"host",label:"Host"},{id:"bridged",label:"Bridged"},{id:"noauto",label:"No Automatic Networks"}]}}};var c;s.query().$promise.then(function(e){r.users=e,c=r.users,r.optionValImg=r.setData(c,{field1:"id",field2:"name"}),r.config.fields.default_image.options=r.optionValImg})["catch"](function(e){throw new Error(e)}),this.setData=function(e,t){var i,s=[];for(i=0;i<e.length;i++){var l={id:e[i][t.field1],label:e[i][t.field2]};s.push(l)}return s},l.id?(delete this.config.fields.site,this.config.exclude.push("site"),e.get({id:l.id}).$promise.then(function(e){r.users=e,c=e,r.model=c})["catch"](function(e){throw new Error(e)})):(this.model={},n.get("/xoslib/tenantview/").success(function(e){r.userList=e,r.model.creator=r.userList.current_user_id}),i.query().$promise.then(function(e){r.users_site=e,r.optionVal=r.setData(r.users_site,{field1:"id",field2:"name"}),r.config.fields.site.options=r.optionVal})["catch"](function(e){throw new Error(e)}));var d=function(t,i){var s=o.defer();if(delete t.networks,i.$valid){if(t.id)var l=e.update(t).$promise;else var l=e.save(t).$promise;l.then(function(e){r.model=e,r.config.feedback.show=!0,s.resolve(r.model)})["catch"](function(e){r.config.feedback.show=!0,r.config.feedback.type="danger",e.data&&e.data.detail?r.config.feedback.message=e.data.detail:r.config.feedback.message=e.statusText,s.reject(e)})}return s.promise}}]}}),angular.module("xos.tenant").run(["$templateCache",function(e){e.put("templates/createslice.html",'<!--<xos-table config="cs.tableConfig" data="cs.sites"></xos-table>-->\n<h2>Slice Details</h2>\n<hr></hr>\n<xos-form ng-model="cs.model" config="cs.config" ></xos-form>\n\n<!--<pre>-->\n<!--&lt;!&ndash;{{cs.users | json}}&ndash;&gt;-->\n\n<!--{{cs.users.name | json}}-->\n\n<!--</pre>-->'),e.put("templates/slicelist.html",'<!--<span ng-bind="siteNameSe"></span>-->\n<!--<xos-field></xos-field>-->\n<a class="addlink btn btn-info" ui-sref="createslice({site: sl.siteId})"><i class="glyphicon glyphicon-plus-sign"></i> Create Slice</a>\n<xos-table config="sl.tableConfig" data="sl.sliceList"></xos-table>\n<!--<div ui-view="sliceDetails"></div>-->\n<!--<pre>{{sl.users[0].site}}</pre>-->\n'),e.put("templates/users-list.tpl.html",'<xos-table config="vm.tableConfig" data="vm.site_list"></xos-table>')}]),angular.module("xos.tenant").run(["$location",function(e){e.path("/")}]);