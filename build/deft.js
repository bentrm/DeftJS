/*!
DeftJS 0.6.8pre

Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/
Ext.define("Deft.core.Class",{alternateClassName:["Deft.Class"],statics:{registerPreprocessor:function(b,d,a,c){if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){Ext.Class.registerPreprocessor(b,function(e,f,g){return d.call(this,e,f,f,g)}).setDefaultPreprocessorPosition(b,a,c)}else{Ext.Class.registerPreprocessor(b,function(f,g,e,h){return d.call(this,f,g,e,h)},[b],a,c)}},hookOnClassCreated:function(a,b){if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){Ext.Function.interceptBefore(a,"onClassCreated",b)}else{Ext.Function.interceptBefore(a,"onCreated",b)}},hookOnClassExtended:function(b,a){if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){b.onClassExtended=function(c,d){return a.call(this,c,d,d)}}else{b.onClassExtended=a}}}});Ext.define("Deft.log.Logger",{alternateClassName:["Deft.Logger"],singleton:true,log:function(b,a){},error:function(a){this.log(a,"error")},info:function(a){this.log(a,"info")},verbose:function(a){this.log(a,"verbose")},warn:function(a){this.log(a,"warn")},deprecate:function(a){this.log(a,"deprecate")}},function(){var a;if(Ext.getVersion("extjs")!=null){this.log=function(c,b){if(b==null){b="info"}if(b==="deprecate"){b="warn"}Ext.log({msg:c,level:b})}}else{if(Ext.isFunction((a=Ext.Logger)!=null?a.log:void 0)){this.log=Ext.bind(Ext.Logger.log,Ext.Logger)}}});Ext.define("Deft.util.Function",{alternateClassName:["Deft.Function"],statics:{spread:function(b,a){return function(c){if(!Ext.isArray(c)){Ext.Error.raise({msg:"Error spreading passed Array over target function arguments: passed a non-Array."})}return b.apply(a,c)}},memoize:function(d,c,a){var b;b={};return function(f){var e;e=Ext.isFunction(a)?a.apply(c,arguments):f;if(!(e in b)){b[e]=d.apply(c,arguments)}return b[e]}}}});Ext.define("Deft.event.LiveEventListener",{alternateClassName:["Deft.LiveEventListener"],constructor:function(c){var b,d,e,a;Ext.apply(this,c);this.components=[];d=Ext.ComponentQuery.query(this.selector,this.container);for(e=0,a=d.length;e<a;e++){b=d[e];this.components.push(b);b.on(this.eventName,this.fn,this.scope,this.options)}},destroy:function(){var b,d,a,c;c=this.components;for(d=0,a=c.length;d<a;d++){b=c[d];b.un(this.eventName,this.fn,this.scope)}this.components=null},register:function(a){if(this.matches(a)){this.components.push(a);a.on(this.eventName,this.fn,this.scope,this.options)}},unregister:function(b){var a;a=Ext.Array.indexOf(this.components,b);if(a!==-1){b.un(this.eventName,this.fn,this.scope);Ext.Array.erase(this.components,a,1)}},matches:function(a){if(this.selector===null&&this.container===a){return true}if(this.container===null&&Ext.Array.contains(Ext.ComponentQuery.query(this.selector),a)){return true}if(a.isDescendantOf(this.container)&&Ext.Array.contains(this.container.query(this.selector),a)){return true}return false}});Ext.define("Deft.event.LiveEventBus",{alternateClassName:["Deft.LiveEventBus"],requires:["Deft.event.LiveEventListener"],singleton:true,constructor:function(){this.listeners=[]},destroy:function(){var d,c,a,b;b=this.listeners;for(c=0,a=b.length;c<a;c++){d=b[c];d.destroy()}this.listeners=null},addListener:function(b,a,c,f,e,d){var g;g=Ext.create("Deft.event.LiveEventListener",{container:b,selector:a,eventName:c,fn:f,scope:e,options:d});this.listeners.push(g)},removeListener:function(b,a,c,e,d){var f;f=this.findListener(b,a,c,e,d);if(f!=null){Ext.Array.remove(this.listeners,f);f.destroy()}},on:function(b,a,c,f,e,d){return this.addListener(b,a,c,f,e,d)},un:function(b,a,c,e,d){return this.removeListener(b,a,c,e,d)},findListener:function(a,c,f,g,i){var b,d,h,e;e=this.listeners;for(d=0,h=e.length;d<h;d++){b=e[d];if(b.container===a&&b.selector===c&&b.eventName===f&&b.fn===g&&b.scope===i){return b}}return null},register:function(a){a.on("added",this.onComponentAdded,this);a.on("removed",this.onComponentRemoved,this)},unregister:function(a){a.un("added",this.onComponentAdded,this);a.un("removed",this.onComponentRemoved,this)},onComponentAdded:function(c,b,d){var g,f,a,e;e=this.listeners;for(f=0,a=e.length;f<a;f++){g=e[f];g.register(c)}},onComponentRemoved:function(c,b,d){var g,f,a,e;e=this.listeners;for(f=0,a=e.length;f<a;f++){g=e[f];g.unregister(c)}}},function(){if(Ext.getVersion("touch")!=null){Ext.define("Deft.Component",{override:"Ext.Component",setParent:function(c){var b,a;b=this.getParent();a=this.callParent(arguments);if(b===null&&c!==null){this.fireEvent("added",this,c)}else{if(b!==null&&c!==null){this.fireEvent("removed",this,b);this.fireEvent("added",this,c)}else{if(b!==null&&c===null){this.fireEvent("removed",this,b)}}}return a},isDescendantOf:function(a){var b;b=this.getParent();while(b!=null){if(b===a){return true}b=b.getParent()}return false}})}Ext.require("Ext.ComponentManager",function(){Ext.Function.interceptAfter(Ext.ComponentManager,"register",function(a){Deft.event.LiveEventBus.register(a)});Ext.Function.interceptAfter(Ext.ComponentManager,"unregister",function(a){Deft.event.LiveEventBus.unregister(a)})})});Ext.define("Deft.ioc.DependencyProvider",{requires:["Deft.log.Logger"],config:{identifier:null,className:null,parameters:null,fn:null,value:null,singleton:true,eager:false},constructor:function(b){var a;this.initConfig(b);if((b.value!=null)&&b.value.constructor===Object){this.setValue(b.value)}if(this.getEager()){if(this.getValue()!=null){Ext.Error.raise({msg:"Error while configuring '"+(this.getIdentifier())+"': a 'value' cannot be created eagerly."})}if(!this.getSingleton()){Ext.Error.raise({msg:"Error while configuring '"+(this.getIdentifier())+"': only singletons can be created eagerly."})}}if(this.getClassName()!=null){a=Ext.ClassManager.get(this.getClassName());if(!(a!=null)){Deft.Logger.warn("Synchronously loading '"+(this.getClassName())+"'; consider adding Ext.require('"+(this.getClassName())+"') above Ext.onReady.");Ext.syncRequire(this.getClassName());a=Ext.ClassManager.get(this.getClassName())}if(!(a!=null)){Ext.Error.raise({msg:"Error while configuring rule for '"+(this.getIdentifier())+"': unrecognized class name or alias: '"+(this.getClassName())+"'"})}}if(!this.getSingleton()){if(this.getClassName()!=null){if(Ext.ClassManager.get(this.getClassName()).singleton){Ext.Error.raise({msg:"Error while configuring rule for '"+(this.getIdentifier())+"': singleton classes cannot be configured for injection as a prototype. Consider removing 'singleton: true' from the class definition."})}}if(this.getValue()!=null){Ext.Error.raise({msg:"Error while configuring '"+(this.getIdentifier())+"': a 'value' can only be configured as a singleton."})}}else{if((this.getClassName()!=null)&&(this.getParameters()!=null)){if(Ext.ClassManager.get(this.getClassName()).singleton){Ext.Error.raise({msg:"Error while configuring rule for '"+(this.getIdentifier())+"': parameters cannot be applied to singleton classes. Consider removing 'singleton: true' from the class definition."})}}}return this},resolve:function(c){var a,b;Deft.Logger.log("Resolving '"+(this.getIdentifier())+"'.");if(this.getValue()!=null){return this.getValue()}a=null;if(this.getFn()!=null){Deft.Logger.log("Executing factory function.");a=this.getFn().call(null,c)}else{if(this.getClassName()!=null){if(Ext.ClassManager.get(this.getClassName()).singleton){Deft.Logger.log("Using existing singleton instance of '"+(this.getClassName())+"'.");a=Ext.ClassManager.get(this.getClassName())}else{Deft.Logger.log("Creating instance of '"+(this.getClassName())+"'.");b=this.getParameters()!=null?[this.getClassName()].concat(this.getParameters()):[this.getClassName()];a=Ext.create.apply(this,b)}}else{Ext.Error.raise({msg:"Error while configuring rule for '"+(this.getIdentifier())+"': no 'value', 'fn', or 'className' was specified."})}}if(this.getSingleton()){this.setValue(a)}return a}});Ext.define("Deft.ioc.Injector",{alternateClassName:["Deft.Injector"],requires:["Deft.log.Logger","Deft.ioc.DependencyProvider"],singleton:true,constructor:function(){this.providers={};return this},configure:function(a){Deft.Logger.log("Configuring injector.");Ext.Object.each(a,function(c,b){var d;Deft.Logger.log("Configuring dependency provider for '"+c+"'.");if(Ext.isString(b)){d=Ext.create("Deft.ioc.DependencyProvider",{identifier:c,className:b})}else{d=Ext.create("Deft.ioc.DependencyProvider",Ext.apply({identifier:c},b))}this.providers[c]=d},this);Ext.Object.each(this.providers,function(b,c){if(c.getEager()){Deft.Logger.log("Eagerly creating '"+(c.getIdentifier())+"'.");c.resolve()}},this)},canResolve:function(a){var b;b=this.providers[a];return b!=null},resolve:function(a,b){var c;c=this.providers[a];if(c!=null){return c.resolve(b)}else{Ext.Error.raise({msg:"Error while resolving value to inject: no dependency provider found for '"+a+"'."})}},inject:function(a,c,f){var e,b,h,g,d;if(f==null){f=true}e={};if(Ext.isString(a)){a=[a]}Ext.Object.each(a,function(l,m){var k,i,j;j=Ext.isArray(a)?m:l;k=m;i=this.resolve(k,c);if(j in c.config){Deft.Logger.log("Injecting '"+k+"' into '"+j+"' config.");e[j]=i}else{Deft.Logger.log("Injecting '"+k+"' into '"+j+"' property.");c[j]=i}},this);if(f){for(b in e){d=e[b];g="set"+Ext.String.capitalize(b);c[g].call(c,d)}}else{if((Ext.getVersion("extjs")!=null)&&c instanceof Ext.ClassManager.get("Ext.Component")){c.injectConfig=e}else{if(Ext.isFunction(c.initConfig)){h=c.initConfig;c.initConfig=function(j){var i;i=h.call(this,Ext.Object.merge({},j||{},e));return i}}}}return c}},function(){if(Ext.getVersion("extjs")!=null){if(Ext.getVersion("core").isLessThan("4.1.0")){Ext.require("Ext.Component",function(){Ext.Component.override({constructor:function(a){a=Ext.Object.merge({},a||{},this.injectConfig||{});delete this.injectConfig;return this.callOverridden([a])}})})}else{Ext.define("Deft.InjectableComponent",{override:"Ext.Component",constructor:function(a){a=Ext.Object.merge({},a||{},this.injectConfig||{});delete this.injectConfig;return this.callParent([a])}})}}});Ext.define("Deft.mixin.Injectable",{requires:["Deft.core.Class","Deft.ioc.Injector","Deft.log.Logger"],onClassMixedIn:function(a){Deft.Logger.deprecate("Deft.mixin.Injectable has been deprecated and can now be omitted - simply use the 'inject' class annotation on its own.")}},function(){var a;if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){a=function(){return function(){if(!this.$injected){Deft.Injector.inject(this.inject,this,false);this.$injected=true}return this.callOverridden(arguments)}}}else{a=function(){return function(){if(!this.$injected){Deft.Injector.inject(this.inject,this,false);this.$injected=true}return this.callParent(arguments)}}}Deft.Class.registerPreprocessor("inject",function(b,e,j,i){var g,f,c,h,d;if(Ext.isString(e.inject)){e.inject=[e.inject]}if(Ext.isArray(e.inject)){g={};d=e.inject;for(c=0,h=d.length;c<h;c++){f=d[c];g[f]=f}e.inject=g}Deft.Class.hookOnClassCreated(j,function(k){k.override({constructor:a()})});Deft.Class.hookOnClassExtended(e,function(m,n,l){var k;Deft.Class.hookOnClassCreated(l,function(o){o.override({constructor:a()})});if((k=n.inject)==null){n.inject={}}Ext.applyIf(n.inject,m.superclass.inject)})},"before","extend")});Ext.define("Deft.mvc.ComponentSelectorListener",{requires:["Deft.event.LiveEventBus"],constructor:function(c){var b,e,a,d;Ext.apply(this,c);if(this.componentSelector.live){Deft.LiveEventBus.addListener(this.componentSelector.view,this.componentSelector.selector,this.eventName,this.fn,this.scope,this.options)}else{d=this.componentSelector.components;for(e=0,a=d.length;e<a;e++){b=d[e];b.on(this.eventName,this.fn,this.scope,this.options)}}return this},destroy:function(){var b,d,a,c;if(this.componentSelector.live){Deft.LiveEventBus.removeListener(this.componentSelector.view,this.componentSelector.selector,this.eventName,this.fn,this.scope)}else{c=this.componentSelector.components;for(d=0,a=c.length;d<a;d++){b=c[d];b.un(this.eventName,this.fn,this.scope)}}}});Ext.define("Deft.mvc.ComponentSelector",{requires:["Deft.log.Logger","Deft.mvc.ComponentSelectorListener"],constructor:function(c){var a,e,g,b,d,f;Ext.apply(this,c);if(!this.live){this.components=this.selector!=null?Ext.ComponentQuery.query(this.selector,this.view):[this.view]}this.selectorListeners=[];if(Ext.isObject(this.listeners)){f=this.listeners;for(a in f){g=f[a];e=g;d=this.scope;b=null;if(Ext.isObject(g)){b=Ext.apply({},g);if(b.fn!=null){e=b.fn;delete b.fn}if(b.scope!=null){d=b.scope;delete b.scope}}if(Ext.isString(e)&&Ext.isFunction(d[e])){e=d[e]}if(!Ext.isFunction(e)){Ext.Error.raise({msg:"Error adding '"+a+"' listener: the specified handler '"+e+"' is not a Function or does not exist."})}this.addListener(a,e,d,b)}}return this},destroy:function(){var d,c,a,b;b=this.selectorListeners;for(c=0,a=b.length;c<a;c++){d=b[c];d.destroy()}this.selectorListeners=[]},addListener:function(a,d,c,b){var e;if(this.findListener(a,d,c)!=null){Ext.Error.raise({msg:"Error adding '"+a+"' listener: an existing listener for the specified function was already registered for '"+this.selector+"."})}Deft.Logger.log("Adding '"+a+"' listener to '"+this.selector+"'.");e=Ext.create("Deft.mvc.ComponentSelectorListener",{componentSelector:this,eventName:a,fn:d,scope:c,options:b});this.selectorListeners.push(e)},removeListener:function(a,c,b){var d;d=this.findListener(a,c,b);if(d!=null){Deft.Logger.log("Removing '"+a+"' listener from '"+this.selector+"'.");d.destroy();Ext.Array.remove(this.selectorListeners,d)}},findListener:function(b,d,c){var g,f,a,e;e=this.selectorListeners;for(f=0,a=e.length;f<a;f++){g=e[f];if(g.eventName===b&&g.fn===d&&g.scope===c){return g}}return null}});Ext.define("Deft.mvc.ViewController",{alternateClassName:["Deft.ViewController"],requires:["Deft.log.Logger","Deft.mvc.ComponentSelector"],config:{view:null},constructor:function(a){if(a==null){a={}}if(a.view){this.controlView(a.view)}return this.initConfig(a)},controlView:function(a){if(a instanceof Ext.ClassManager.get("Ext.Container")){this.setView(a);this.registeredComponentReferences={};this.registeredComponentSelectors={};if(Ext.getVersion("extjs")!=null){if(this.getView().rendered){this.onViewInitialize()}else{this.getView().on("afterrender",this.onViewInitialize,this,{single:true})}}else{if(this.getView().initialized){this.onViewInitialize()}else{this.getView().on("initialize",this.onViewInitialize,this,{single:true})}}}else{Ext.Error.raise({msg:"Error constructing ViewController: the configured 'view' is not an Ext.Container."})}},init:function(){},destroy:function(){return true},onViewInitialize:function(){var d,h,e,f,c,a,b,g;if(Ext.getVersion("extjs")!=null){this.getView().on("beforedestroy",this.onViewBeforeDestroy,this);this.getView().on("destroy",this.onViewDestroy,this,{single:true})}else{b=this;c=this.getView().destroy;this.getView().destroy=function(){if(b.destroy()){c.call(this)}}}g=this.control;for(h in g){d=g[h];a=null;if(h!=="view"){if(Ext.isString(d)){a=d}else{if(d.selector!=null){a=d.selector}else{a="#"+h}}}e=null;if(Ext.isObject(d.listeners)){e=d.listeners}else{if(!((d.selector!=null)||(d.live!=null))){e=d}}f=(d.live!=null)&&d.live;this.addComponentReference(h,a,f);this.addComponentSelector(a,e,f)}this.init()},onViewBeforeDestroy:function(){if(this.destroy()){this.getView().un("beforedestroy",this.onBeforeDestroy,this);return true}return false},onViewDestroy:function(){var b,a;for(b in this.registeredComponentReferences){this.removeComponentReference(b)}for(a in this.registeredComponentSelectors){this.removeComponentSelector(a)}},addComponentReference:function(e,a,c){var b,d;if(c==null){c=false}Deft.Logger.log("Adding '"+e+"' component reference for selector: '"+a+"'.");if(this.registeredComponentReferences[e]!=null){Ext.Error.raise({msg:"Error adding component reference: an existing component reference was already registered as '"+e+"'."})}if(e!=="view"){b="get"+Ext.String.capitalize(e);if(this[b]==null){if(c){this[b]=Ext.Function.pass(this.getViewComponent,[a],this)}else{d=this.getViewComponent(a);if(d==null){Ext.Error.raise({msg:"Error locating component: no component(s) found matching '"+a+"'."})}this[b]=function(){return d}}this[b].generated=true}}this.registeredComponentReferences[e]=true},removeComponentReference:function(b){var a;Deft.Logger.log("Removing '"+b+"' component reference.");if(this.registeredComponentReferences[b]==null){Ext.Error.raise({msg:"Error removing component reference: no component reference is registered as '"+b+"'."})}if(b!=="view"){a="get"+Ext.String.capitalize(b);if(this[a].generated){this[a]=null}}delete this.registeredComponentReferences[b]},getViewComponent:function(a){var b;if(a!=null){b=Ext.ComponentQuery.query(a,this.getView());if(b.length===0){return null}else{if(b.length===1){return b[0]}else{return b}}}else{return this.getView()}},addComponentSelector:function(a,b,c){var d,e;if(c==null){c=false}Deft.Logger.log("Adding component selector for: '"+a+"'.");e=this.getComponentSelector(a);if(e!=null){Ext.Error.raise({msg:"Error adding component selector: an existing component selector was already registered for '"+a+"'."})}d=Ext.create("Deft.mvc.ComponentSelector",{view:this.getView(),selector:a,listeners:b,scope:this,live:c});this.registeredComponentSelectors[a]=d},removeComponentSelector:function(a){var b;Deft.Logger.log("Removing component selector for '"+a+"'.");b=this.getComponentSelector(a);if(b==null){Ext.Error.raise({msg:"Error removing component selector: no component selector registered for '"+a+"'."})}b.destroy();delete this.registeredComponentSelectors[a]},getComponentSelector:function(a){return this.registeredComponentSelectors[a]}});Ext.define("Deft.mixin.Controllable",{requires:["Deft.core.Class","Deft.log.Logger"],onClassMixedIn:function(a){Deft.Logger.deprecate("Deft.mixin.Controllable has been deprecated and can now be omitted - simply use the 'controller' class annotation on its own.")}},function(){var a;if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){a=function(){return function(d){var b;if(d==null){d={}}if(this instanceof Ext.ClassManager.get("Ext.Container")&&!this.$controlled){try{b=Ext.create(this.controller,d.controllerConfig||this.controllerConfig||{})}catch(c){Deft.Logger.warn("Error initializing view controller: an error occurred while creating an instance of the specified controller: '"+this.controller+"'.");throw c}if(this.getController===void 0){this.getController=function(){return b}}this.$controlled=true;this.callOverridden(arguments);b.controlView(this);return this}return this.callOverridden(arguments)}}}else{a=function(){return function(d){var b;if(d==null){d={}}if(this instanceof Ext.ClassManager.get("Ext.Container")&&!this.$controlled){try{b=Ext.create(this.controller,d.controllerConfig||this.controllerConfig||{})}catch(c){Deft.Logger.warn("Error initializing view controller: an error occurred while creating an instance of the specified controller: '"+this.controller+"'.");throw c}if(this.getController===void 0){this.getController=function(){return b}}this.$controlled=true;this.callParent(arguments);b.controlView(this);return this}return this.callParent(arguments)}}}Deft.Class.registerPreprocessor("controller",function(d,e,b,f){var c;Deft.Class.hookOnClassCreated(b,function(g){g.override({constructor:a()})});Deft.Class.hookOnClassExtended(e,function(h,i,g){Deft.Class.hookOnClassCreated(g,function(j){j.override({constructor:a()})})});c=this;Ext.require([e.controller],function(){if(f!=null){f.call(c,d,e,b)}});return false},"before","extend")});Ext.define("Deft.promise.Deferred",{alternateClassName:["Deft.Deferred"],constructor:function(){this.state="pending";this.progress=void 0;this.value=void 0;this.progressCallbacks=[];this.successCallbacks=[];this.failureCallbacks=[];this.cancelCallbacks=[];this.promise=Ext.create("Deft.Promise",this);return this},then:function(h){var j,k,l,a,c,b,g,f,d,i,e;if(Ext.isObject(h)){b=h.success,a=h.failure,c=h.progress,k=h.cancel}else{b=arguments[0],a=arguments[1],c=arguments[2],k=arguments[3]}e=[b,a,c,k];for(d=0,i=e.length;d<i;d++){j=e[d];if(!(Ext.isFunction(j)||j===null||j===void 0)){Ext.Error.raise({msg:"Error while configuring callback: a non-function specified."})}}l=Ext.create("Deft.promise.Deferred");g=function(n,m){return function(q){var o;if(Ext.isFunction(n)){try{o=n(q);if(o instanceof Ext.ClassManager.get("Deft.promise.Promise")||o instanceof Ext.ClassManager.get("Deft.promise.Deferred")){o.then(Ext.bind(l.resolve,l),Ext.bind(l.reject,l),Ext.bind(l.update,l),Ext.bind(l.cancel,l))}else{l.resolve(o)}}catch(p){l.reject(p)}}else{l[m](q)}}};this.register(g(b,"resolve"),this.successCallbacks,"resolved",this.value);this.register(g(a,"reject"),this.failureCallbacks,"rejected",this.value);this.register(g(k,"cancel"),this.cancelCallbacks,"cancelled",this.value);f=function(m){return function(o){var n;if(Ext.isFunction(m)){n=m(o);l.update(n)}else{l.update(o)}}};this.register(f(c),this.progressCallbacks,"pending",this.progress);return l.getPromise()},otherwise:function(a){return this.then({failure:a})},always:function(a){return this.then({success:a,failure:a,cancel:a})},update:function(a){if(this.state==="pending"){this.progress=a;this.notify(this.progressCallbacks,a)}else{if(this.state!=="cancelled"){Ext.Error.raise({msg:"Error: this Deferred has already been completed and cannot be modified."})}}},resolve:function(a){this.complete("resolved",a,this.successCallbacks)},reject:function(a){this.complete("rejected",a,this.failureCallbacks)},cancel:function(a){this.complete("cancelled",a,this.cancelCallbacks)},getPromise:function(){return this.promise},getState:function(){return this.state},register:function(d,a,c,b){if(Ext.isFunction(d)){if(this.state==="pending"){a.push(d);if(this.state===c&&b!==void 0){this.notify([d],b)}}else{if(this.state===c){this.notify([d],b)}}}},complete:function(c,b,a){if(this.state==="pending"){this.state=c;this.value=b;this.notify(a,b);this.releaseCallbacks()}else{if(this.state!=="cancelled"){Ext.Error.raise({msg:"Error: this Deferred has already been completed and cannot be modified."})}}},notify:function(b,d){var e,c,a;for(c=0,a=b.length;c<a;c++){e=b[c];e(d)}},releaseCallbacks:function(){this.progressCallbacks=null;this.successCallbacks=null;this.failureCallbacks=null;this.cancelCallbacks=null}});Ext.define("Deft.promise.Promise",{alternateClassName:["Deft.Promise"],statics:{when:function(a){var b;if(a instanceof Ext.ClassManager.get("Deft.promise.Promise")||a instanceof Ext.ClassManager.get("Deft.promise.Deferred")){return a.then()}else{if(Ext.isObject(a)&&Ext.isFunction(a.then)){b=Ext.create("Deft.promise.Deferred");a.then(function(c){b.resolve(c)},function(c){b.reject(c)});return b.then()}else{b=Ext.create("Deft.promise.Deferred");b.resolve(a);return b.then()}}},all:function(m){var p,k,h,g,q,c,d,i,o,j,l,b,e,r,f,a,n;q=Ext.create("Deft.promise.Deferred");r=m.length;b=new Array(m);l=0;f=function(s){q.update(s)};e=function(s,t){b[s]=t;l++;if(l===r){h();q.resolve(b)}};j=function(s){h();q.reject(s)};k=function(s){h();q.cancel(s)};h=function(){return f=e=j=k=Ext.emptyFn};g=function(s){return function(t){return e(s,t)}};c=function(s){return j(s)};i=function(s){return f(s)};p=function(s){return k(s)};for(d=a=0,n=m.length;a<n;d=++a){o=m[d];if(d in m){this.when(o).then({success:g(d),failure:c,progress:i,cancel:p})}}return q.getPromise()},any:function(g){var b,n,a,o,j,h,i,c,e,d,k,m,f,l;o=Ext.create("Deft.promise.Deferred");m=function(p){o.update(p)};d=function(p){a();o.resolve(p)};e=function(p){a();o.reject(p)};n=function(p){a();return o.cancel(p)};a=function(){return m=d=e=n=Ext.emptyFn};k=function(p){return d(p)};j=function(p){return e(p)};i=function(p){return m(p)};b=function(p){return n(p)};for(h=f=0,l=g.length;f<l;h=++f){c=g[h];if(h in g){this.when(c).then({success:k,failure:j,progress:i,cancel:b})}}return o.getPromise()},memoize:function(c,b,a){return this.all(Ext.Array.toArray(arguments)).then(Deft.util.Function.spread(function(){return Deft.util.memoize(arguments,b,a)},b))},map:function(g,e){var c,a,d,f,b;d=new Array(g.length);for(c=f=0,b=g.length;f<b;c=++f){a=g[c];if(c in g){d[c]=this.when(a).then(e)}}return this.reduce(d,this.reduceIntoArray,d)},reduce:function(e,b,a){var d,c;c=this.when;d=[function(g,h,f){return c(g).then(function(i){return c(h).then(function(j){return b(i,j,f,e)})})}];if(arguments.length===3){d.push(a)}return this.when(this.reduceArray.apply(e,d))},reduceArray:function(b,a){var e,g,d,f,c;d=0;g=Object(this);f=g.length>>>0;e=arguments;if(e.length<=1){while(true){if(d in g){c=g[d++];break}if(++d>=f){throw new TypeError()}}}else{c=e[1]}while(d<f){if(d in g){c=b(c,g[d],d,g)}d++}return c},reduceIntoArray:function(b,c,a){b[a]=c;return b}},constructor:function(a){this.deferred=a;return this},then:function(a){return this.deferred.then.apply(this.deferred,arguments)},otherwise:function(a){return this.deferred.otherwise(a)},always:function(a){return this.deferred.always(a)},cancel:function(a){return this.deferred.cancel(a)},getState:function(){return this.deferred.getState()}},function(){if(Array.prototype.reduce!=null){this.reduceArray=Array.prototype.reduce}});