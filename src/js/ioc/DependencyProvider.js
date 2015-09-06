// Generated by CoffeeScript 1.9.3

/*
Copyright (c) 2012-2013 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
 */

/**
* Used by Deft.ioc.Injector.
* @private
 */
Ext.define('Deft.ioc.DependencyProvider', {
  requires: ['Deft.log.Logger'],
  config: {
    identifier: null,

    /**
    		Class to be instantiated, by either full name, alias or alternate name, to resolve this dependency.
     */
    className: null,

    /**
    		Optional arguments to pass to the class' constructor when instantiating a class to resolve this dependency.
     */
    parameters: null,

    /**
    		Factory function to be executed to obtain the corresponding object instance or value to resolve this dependency.
    
    		NOTE: For lazily instantiated dependencies, this function will be passed the object instance for which the dependency is being resolved.
     */
    fn: null,

    /**
    		Value to use to resolve this dependency.
     */
    value: void 0,

    /**
    		Indicates whether this dependency should be resolved as a singleton, or as a transient value for each resolution request.
     */
    singleton: true,

    /**
    		Indicates whether this dependency should be 'eagerly' instantiated when this provider is defined, rather than 'lazily' instantiated when later requested.
    
    		NOTE: Only valid when either a factory function or class is specified as a singleton.
     */
    eager: false
  },
  constructor: function(config) {
    var classDefinition;
    this.initConfig(config);
    if ((config.value != null) && config.value.constructor === Object) {
      this.setValue(config.value);
    }
    if (this.getEager()) {
      if (this.getValue() != null) {
        Ext.Error.raise({
          msg: "Error while configuring '" + (this.getIdentifier()) + "': a 'value' cannot be created eagerly."
        });
      }
      if (!this.getSingleton()) {
        Ext.Error.raise({
          msg: "Error while configuring '" + (this.getIdentifier()) + "': only singletons can be created eagerly."
        });
      }
    }
    if (this.getClassName() != null) {
      classDefinition = Ext.ClassManager.get(this.getClassName());
      if (classDefinition == null) {
        Deft.Logger.warn("Synchronously loading '" + (this.getClassName()) + "'; consider adding Ext.require('" + (this.getClassName()) + "') above Ext.onReady.");
        Ext.syncRequire(this.getClassName());
        classDefinition = Ext.ClassManager.get(this.getClassName());
      }
      if (classDefinition == null) {
        Ext.Error.raise({
          msg: "Error while configuring rule for '" + (this.getIdentifier()) + "': unrecognized class name or alias: '" + (this.getClassName()) + "'"
        });
      }
    }
    if (!this.getSingleton()) {
      if (this.getClassName() != null) {
        if (Ext.ClassManager.get(this.getClassName()).singleton) {
          Ext.Error.raise({
            msg: "Error while configuring rule for '" + (this.getIdentifier()) + "': singleton classes cannot be configured for injection as a prototype. Consider removing 'singleton: true' from the class definition."
          });
        }
      }
      if (this.getValue() != null) {
        Ext.Error.raise({
          msg: "Error while configuring '" + (this.getIdentifier()) + "': a 'value' can only be configured as a singleton."
        });
      }
    } else {
      if ((this.getClassName() != null) && (this.getParameters() != null)) {
        if (Ext.ClassManager.get(this.getClassName()).singleton) {
          Ext.Error.raise({
            msg: "Error while configuring rule for '" + (this.getIdentifier()) + "': parameters cannot be applied to singleton classes. Consider removing 'singleton: true' from the class definition."
          });
        }
      }
    }
    return this;
  },

  /**
  	Resolve a target instance's dependency with an object instance or value generated by this dependency provider.
   */
  resolve: function(targetInstance, targetInstanceConstructorArguments) {
    var fnArguments, instance, parameters;
    Deft.Logger.log("Resolving '" + (this.getIdentifier()) + "'.");
    if (this.getValue() !== void 0) {
      return this.getValue();
    }
    instance = null;
    if (this.getFn() != null) {
      Deft.Logger.log("Executing factory function.");
      if (targetInstanceConstructorArguments) {
        fnArguments = [targetInstance].concat(Ext.toArray(targetInstanceConstructorArguments));
      } else {
        fnArguments = [targetInstance];
      }
      instance = this.getFn().apply(Deft.Injector, fnArguments);
    } else if (this.getClassName() != null) {
      if (Ext.ClassManager.get(this.getClassName()).singleton) {
        Deft.Logger.log("Using existing singleton instance of '" + (this.getClassName()) + "'.");
        instance = Ext.ClassManager.get(this.getClassName());
      } else {
        Deft.Logger.log("Creating instance of '" + (this.getClassName()) + "'.");
        parameters = this.getParameters() != null ? [this.getClassName()].concat(this.getParameters()) : [this.getClassName()];
        instance = Ext.create.apply(this, parameters);
      }
    } else {
      Ext.Error.raise({
        msg: "Error while configuring rule for '" + (this.getIdentifier()) + "': no 'value', 'fn', or 'className' was specified."
      });
    }
    if (this.getSingleton()) {
      this.setValue(instance);
    }
    return instance;
  }
});