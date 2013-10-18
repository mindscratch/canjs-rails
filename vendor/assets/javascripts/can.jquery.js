/*!
 * CanJS - 2.0.0
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Fri, 18 Oct 2013 00:13:35 GMT
 * Licensed MIT
 * Includes: can/component/component.js,can/construct/construct.js,can/observe/observe.js,can/compute/compute.js,can/model/model.js,can/view/view.js,can/control/control.js,can/route/route.js,can/control/route/route.js,can/util/string/string.js,can/view/mustache/mustache.js,can/view/ejs/ejs.js,can/route/pushstate/pushstate.js,can/model/queue/queue.js,can/construct/super/super.js,can/construct/proxy/proxy.js,can/map/delegate/delegate.js,can/map/setter/setter.js,can/map/attributes/attributes.js,can/map/validations/validations.js,can/map/backup/backup.js,can/map/list/list.js,can/control/plugin/plugin.js,can/view/modifiers/modifiers.js,can/util/object/object.js,can/util/fixture/fixture.js
 * Download from: http://bitbuilder.herokuapp.com/can.custom.js?configuration=jquery&plugins=can%2Fcomponent%2Fcomponent.js&plugins=can%2Fconstruct%2Fconstruct.js&plugins=can%2Fobserve%2Fobserve.js&plugins=can%2Fcompute%2Fcompute.js&plugins=can%2Fmodel%2Fmodel.js&plugins=can%2Fview%2Fview.js&plugins=can%2Fcontrol%2Fcontrol.js&plugins=can%2Froute%2Froute.js&plugins=can%2Fcontrol%2Froute%2Froute.js&plugins=can%2Futil%2Fstring%2Fstring.js&plugins=can%2Fview%2Fmustache%2Fmustache.js&plugins=can%2Fview%2Fejs%2Fejs.js&plugins=can%2Froute%2Fpushstate%2Fpushstate.js&plugins=can%2Fmodel%2Fqueue%2Fqueue.js&plugins=can%2Fconstruct%2Fsuper%2Fsuper.js&plugins=can%2Fconstruct%2Fproxy%2Fproxy.js&plugins=can%2Fmap%2Fdelegate%2Fdelegate.js&plugins=can%2Fmap%2Fsetter%2Fsetter.js&plugins=can%2Fmap%2Fattributes%2Fattributes.js&plugins=can%2Fmap%2Fvalidations%2Fvalidations.js&plugins=can%2Fmap%2Fbackup%2Fbackup.js&plugins=can%2Fmap%2Flist%2Flist.js&plugins=can%2Fcontrol%2Fplugin%2Fplugin.js&plugins=can%2Fview%2Fmodifiers%2Fmodifiers.js&plugins=can%2Futil%2Fobject%2Fobject.js&plugins=can%2Futil%2Ffixture%2Ffixture.js
 */
(function(undefined) {

    // ## can/util/can.js
    var __m4 = (function() {
        var can = window.can || {};
        if (typeof GLOBALCAN === 'undefined' || GLOBALCAN !== false) {
            window.can = can;
        }

        can.isDeferred = function(obj) {
            var isFunction = this.isFunction;
            // Returns `true` if something looks like a deferred.
            return obj && isFunction(obj.then) && isFunction(obj.pipe);
        };

        var cid = 0;
        can.cid = function(object, name) {
            if (object._cid) {
                return object._cid
            } else {
                return object._cid = (name || "") + (++cid)
            }
        }
        can.VERSION = '@EDGE';
        return can;
    })();

    // ## can/util/array/each.js
    var __m5 = (function(can) {
        can.each = function(elements, callback, context) {
            var i = 0,
                key;
            if (elements) {
                if (typeof elements.length === 'number' && elements.pop) {
                    if (elements.attr) {
                        elements.attr('length');
                    }
                    for (key = elements.length; i < key; i++) {
                        if (callback.call(context || elements[i], elements[i], i, elements) === false) {
                            break;
                        }
                    }
                } else if (elements.hasOwnProperty) {
                    for (key in elements) {
                        if (elements.hasOwnProperty(key)) {
                            if (callback.call(context || elements[key], elements[key], key, elements) === false) {
                                break;
                            }
                        }
                    }
                }
            }
            return elements;
        };

        return can;
    })(__m4);

    // ## can/util/inserted/inserted.js
    var __m6 = (function(can) {
        // Given a list of elements, check if they are in the dom, if they 
        // are in the dom, trigger inserted on them.
        can.inserted = function(elems) {
            var inDocument = false,
                checked = false,
                children;
            for (var i = 0, elem;
                (elem = elems[i]) !== undefined; i++) {
                if (!inDocument) {
                    if (elem.getElementsByTagName) {
                        if (can.has(can.$(document), elem).length) {
                            inDocument = true;
                        } else {
                            return;
                        }
                    } else {
                        continue;
                    }
                }

                if (inDocument && elem.getElementsByTagName) {
                    can.trigger(elem, "inserted", [], false);
                    children = can.makeArray(elem.getElementsByTagName("*"));
                    for (var j = 0, child;
                        (child = children[j]) !== undefined; j++) {
                        // Trigger the destroyed event
                        can.trigger(child, "inserted", [], false);
                    }
                }
            }
        }


        can.appendChild = function(el, child) {
            if (child.nodeType === 11) {
                var children = can.makeArray(child.childNodes);
            } else {
                var children = [child]
            }
            el.appendChild(child);
            can.inserted(children)
        }
        can.insertBefore = function(el, child, ref) {
            if (child.nodeType === 11) {
                var children = can.makeArray(child.childNodes);
            } else {
                var children = [child];
            }
            el.insertBefore(child, ref);
            can.inserted(children)
        }

    })(__m4);

    // ## can/util/jquery/jquery.js
    var __m2 = (function($, can) {
        // _jQuery node list._
        $.extend(can, $, {
                trigger: function(obj, event, args) {
                    if (obj.trigger) {
                        obj.trigger(event, args);
                    } else {
                        $.event.trigger(event, args, obj, true);
                    }
                },
                addEvent: function(ev, cb) {
                    $([this]).bind(ev, cb);
                    return this;
                },
                removeEvent: function(ev, cb) {
                    $([this]).unbind(ev, cb);
                    return this;
                },
                // jquery caches fragments, we always needs a new one
                buildFragment: function(elems, context) {
                    var oldFragment = $.buildFragment,
                        ret;

                    elems = [elems];
                    // Set context per 1.8 logic
                    context = context || document;
                    context = !context.nodeType && context[0] || context;
                    context = context.ownerDocument || context;

                    ret = oldFragment.call(jQuery, elems, context);

                    return ret.cacheable ? $.clone(ret.fragment) : ret.fragment || ret;
                },
                $: $,
                each: can.each
            });

        // Wrap binding functions.
        $.each(['bind', 'unbind', 'undelegate', 'delegate'], function(i, func) {
            can[func] = function() {
                var t = this[func] ? this : $([this]);
                t[func].apply(t, arguments);
                return this;
            };
        });

        // Aliases
        can.on = can.bind;
        can.off = can.unbind;

        // Wrap modifier functions.
        $.each(["append", "filter", "addClass", "remove", "data", "get", "has"], function(i, name) {
            can[name] = function(wrapped) {
                return wrapped[name].apply(wrapped, can.makeArray(arguments).slice(1));
            };
        });

        // Memory safe destruction.
        var oldClean = $.cleanData;

        $.cleanData = function(elems) {
            $.each(elems, function(i, elem) {
                if (elem) {
                    can.trigger(elem, "removed", [], false);
                }
            });
            oldClean(elems);
        };

        var oldDomManip = $.fn.domManip;

        $.fn.domManip = function(args, table, callback) {
            return oldDomManip.call(this, args, table, function(elem) {
                if (elem.nodeType === 11) {
                    var elems = can.makeArray(elem.childNodes);
                }
                var ret = callback.apply(this, arguments);
                can.inserted(elems ? elems : [elem])
                return ret
            })
        }
        $.event.special.inserted = {};
        $.event.special.removed = {};

        return can;
    })(jQuery, __m4, __m5, __m6);

    // ## can/util/string/string.js
    var __m9 = (function(can) {
        // ##string.js
        // _Miscellaneous string utility functions._  

        // Several of the methods in this plugin use code adapated from Prototype
        // Prototype JavaScript framework, version 1.6.0.1.
        // © 2005-2007 Sam Stephenson
        var strUndHash = /_|-/,
            strColons = /\=\=/,
            strWords = /([A-Z]+)([A-Z][a-z])/g,
            strLowUp = /([a-z\d])([A-Z])/g,
            strDash = /([a-z\d])([A-Z])/g,
            strReplacer = /\{([^\}]+)\}/g,
            strQuote = /"/g,
            strSingleQuote = /'/g,

            // Returns the `prop` property from `obj`.
            // If `add` is true and `prop` doesn't exist in `obj`, create it as an
            // empty object.
            getNext = function(obj, prop, add) {
                var result = obj[prop];

                if (result === undefined && add === true) {
                    result = obj[prop] = {}
                }
                return result
            },

            // Returns `true` if the object can have properties (no `null`s).
            isContainer = function(current) {
                return (/^f|^o/).test(typeof current);
            };

        can.extend(can, {
                // Escapes strings for HTML.
                esc: function(content) {
                    // Convert bad values into empty strings
                    var isInvalid = content === null || content === undefined || (isNaN(content) && ("" + content === 'NaN'));
                    return ("" + (isInvalid ? '' : content))
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(strQuote, '&#34;')
                        .replace(strSingleQuote, "&#39;");
                },

                getObject: function(name, roots, add) {

                    // The parts of the name we are looking up
                    // `['App','Models','Recipe']`
                    var parts = name ? name.split('.') : [],
                        length = parts.length,
                        current,
                        r = 0,
                        i, container, rootsLength;

                    // Make sure roots is an `array`.
                    roots = can.isArray(roots) ? roots : [roots || window];

                    rootsLength = roots.length

                    if (!length) {
                        return roots[0];
                    }

                    // For each root, mark it as current.
                    for (r; r < rootsLength; r++) {
                        current = roots[r];
                        container = undefined;

                        // Walk current to the 2nd to last object or until there
                        // is not a container.
                        for (i = 0; i < length && isContainer(current); i++) {
                            container = current;
                            current = getNext(container, parts[i]);
                        }

                        // If we found property break cycle
                        if (container !== undefined && current !== undefined) {
                            break
                        }
                    }

                    // Remove property from found container
                    if (add === false && current !== undefined) {
                        delete container[parts[i - 1]]
                    }

                    // When adding property add it to the first root
                    if (add === true && current === undefined) {
                        current = roots[0]

                        for (i = 0; i < length && isContainer(current); i++) {
                            current = getNext(current, parts[i], true);
                        }
                    }

                    return current;
                },
                // Capitalizes a string.

                capitalize: function(s, cache) {
                    // Used to make newId.
                    return s.charAt(0).toUpperCase() + s.slice(1);
                },

                // Underscores a string.
                underscore: function(s) {
                    return s
                        .replace(strColons, '/')
                        .replace(strWords, '$1_$2')
                        .replace(strLowUp, '$1_$2')
                        .replace(strDash, '_')
                        .toLowerCase();
                },
                // Micro-templating.

                sub: function(str, data, remove) {
                    var obs = [];

                    str = str || '';

                    obs.push(str.replace(strReplacer, function(whole, inside) {

                                // Convert inside to type.
                                var ob = can.getObject(inside, data, remove === true ? false : undefined);

                                if (ob === undefined || ob === null) {
                                    obs = null;
                                    return "";
                                }

                                // If a container, push into objs (which will return objects found).
                                if (isContainer(ob) && obs) {
                                    obs.push(ob);
                                    return "";
                                }

                                return "" + ob;
                            }));

                    return obs === null ? obs : (obs.length <= 1 ? obs[0] : obs);
                },

                // These regex's are used throughout the rest of can, so let's make
                // them available.
                replacer: strReplacer,
                undHash: strUndHash
            });
        return can;
    })(__m2);

    // ## can/construct/construct.js
    var __m8 = (function(can) {

        // ## construct.js
        // `can.Construct`  
        // _This is a modified version of
        // [John Resig's class](http://ejohn.org/blog/simple-javascript-inheritance/).  
        // It provides class level inheritance and callbacks._

        // A private flag used to initialize a new class instance without
        // initializing it's bindings.
        var initializing = 0;


        can.Construct = function() {
            if (arguments.length) {
                return can.Construct.extend.apply(can.Construct, arguments);
            }
        };


        can.extend(can.Construct, {

                constructorExtends: true,

                newInstance: function() {
                    // Get a raw instance object (`init` is not called).
                    var inst = this.instance(),
                        arg = arguments,
                        args;

                    // Call `setup` if there is a `setup`
                    if (inst.setup) {
                        args = inst.setup.apply(inst, arguments);
                    }

                    // Call `init` if there is an `init`  
                    // If `setup` returned `args`, use those as the arguments
                    if (inst.init) {
                        inst.init.apply(inst, args || arguments);
                    }

                    return inst;
                },
                // Overwrites an object with methods. Used in the `super` plugin.
                // `newProps` - New properties to add.  
                // `oldProps` - Where the old properties might be (used with `super`).  
                // `addTo` - What we are adding to.
                _inherit: function(newProps, oldProps, addTo) {
                    can.extend(addTo || newProps, newProps || {})
                },
                // used for overwriting a single property.
                // this should be used for patching other objects
                // the super plugin overwrites this
                _overwrite: function(what, oldProps, propName, val) {
                    what[propName] = val;
                },
                // Set `defaults` as the merger of the parent `defaults` and this 
                // object's `defaults`. If you overwrite this method, make sure to
                // include option merging logic.

                setup: function(base, fullName) {
                    this.defaults = can.extend(true, {}, base.defaults, this.defaults);
                },
                // Create's a new `class` instance without initializing by setting the
                // `initializing` flag.
                instance: function() {

                    // Prevents running `init`.
                    initializing = 1;

                    var inst = new this();

                    // Allow running `init`.
                    initializing = 0;

                    return inst;
                },
                // Extends classes.

                extend: function(fullName, klass, proto) {
                    // Figure out what was passed and normalize it.
                    if (typeof fullName != 'string') {
                        proto = klass;
                        klass = fullName;
                        fullName = null;
                    }

                    if (!proto) {
                        proto = klass;
                        klass = null;
                    }
                    proto = proto || {};

                    var _super_class = this,
                        _super = this.prototype,
                        name, shortName, namespace, prototype;

                    // Instantiate a base class (but only create the instance,
                    // don't run the init constructor).
                    prototype = this.instance();

                    // Copy the properties over onto the new prototype.
                    can.Construct._inherit(proto, _super, prototype);

                    // The dummy class constructor.

                    function Constructor() {
                        // All construction is actually done in the init method.
                        if (!initializing) {
                            return this.constructor !== Constructor && arguments.length && Constructor.constructorExtends ?
                            // We are being called without `new` or we are extending.
                            arguments.callee.extend.apply(arguments.callee, arguments) :
                            // We are being called with `new`.
                            Constructor.newInstance.apply(Constructor, arguments);
                        }
                    }

                    // Copy old stuff onto class (can probably be merged w/ inherit)
                    for (name in _super_class) {
                        if (_super_class.hasOwnProperty(name)) {
                            Constructor[name] = _super_class[name];
                        }
                    }

                    // Copy new static properties on class.
                    can.Construct._inherit(klass, _super_class, Constructor);

                    // Setup namespaces.
                    if (fullName) {

                        var parts = fullName.split('.'),
                            shortName = parts.pop(),
                            current = can.getObject(parts.join('.'), window, true),
                            namespace = current,
                            _fullName = can.underscore(fullName.replace(/\./g, "_")),
                            _shortName = can.underscore(shortName);



                        current[shortName] = Constructor;
                    }

                    // Set things that shouldn't be overwritten.
                    can.extend(Constructor, {
                            constructor: Constructor,
                            prototype: prototype,

                            namespace: namespace,

                            _shortName: _shortName,

                            fullName: fullName,
                            _fullName: _fullName
                        });

                    // Dojo and YUI extend undefined
                    if (shortName !== undefined) {
                        Constructor.shortName = shortName;
                    }

                    // Make sure our prototype looks nice.
                    Constructor.prototype.constructor = Constructor;


                    // Call the class `setup` and `init`
                    var t = [_super_class].concat(can.makeArray(arguments)),
                        args = Constructor.setup.apply(Constructor, t);

                    if (Constructor.init) {
                        Constructor.init.apply(Constructor, args || t);
                    }


                    return Constructor;



                }

            });

        can.Construct.prototype.setup = function() {};

        can.Construct.prototype.init = function() {};


        return can.Construct;
    })(__m9);

    // ## can/control/control.js
    var __m7 = (function(can) {
        // ## control.js
        // `can.Control`  
        // _Controller_

        // Binds an element, returns a function that unbinds.
        var bind = function(el, ev, callback) {

            can.bind.call(el, ev, callback);

            return function() {
                can.unbind.call(el, ev, callback);
            };
        },
            isFunction = can.isFunction,
            extend = can.extend,
            each = can.each,
            slice = [].slice,
            paramReplacer = /\{([^\}]+)\}/g,
            special = can.getObject("$.event.special", [can]) || {},

            // Binds an element, returns a function that unbinds.
            delegate = function(el, selector, ev, callback) {
                can.delegate.call(el, selector, ev, callback);
                return function() {
                    can.undelegate.call(el, selector, ev, callback);
                };
            },

            // Calls bind or unbind depending if there is a selector.
            binder = function(el, ev, callback, selector) {
                return selector ?
                    delegate(el, can.trim(selector), ev, callback) :
                    bind(el, ev, callback);
            },

            basicProcessor;

        var Control = can.Control = can.Construct(

            {
                // Setup pre-processes which methods are event listeners.

                setup: function() {

                    // Allow contollers to inherit "defaults" from super-classes as it 
                    // done in `can.Construct`
                    can.Construct.setup.apply(this, arguments);

                    // If you didn't provide a name, or are `control`, don't do anything.
                    if (can.Control) {

                        // Cache the underscored names.
                        var control = this,
                            funcName;

                        // Calculate and cache actions.
                        control.actions = {};
                        for (funcName in control.prototype) {
                            if (control._isAction(funcName)) {
                                control.actions[funcName] = control._action(funcName);
                            }
                        }
                    }
                },
                // Moves `this` to the first argument, wraps it with `jQuery` if it's an element
                _shifter: function(context, name) {

                    var method = typeof name == "string" ? context[name] : name;

                    if (!isFunction(method)) {
                        method = context[method];
                    }

                    return function() {
                        context.called = name;
                        return method.apply(context, [this.nodeName ? can.$(this) : this].concat(slice.call(arguments, 0)));
                    };
                },

                // Return `true` if is an action.

                _isAction: function(methodName) {

                    var val = this.prototype[methodName],
                        type = typeof val;
                    // if not the constructor
                    return (methodName !== 'constructor') &&
                    // and is a function or links to a function
                    (type == "function" || (type == "string" && isFunction(this.prototype[val]))) &&
                    // and is in special, a processor, or has a funny character
                    !! (special[methodName] || processors[methodName] || /[^\w]/.test(methodName));
                },
                // Takes a method name and the options passed to a control
                // and tries to return the data necessary to pass to a processor
                // (something that binds things).

                _action: function(methodName, options) {

                    // If we don't have options (a `control` instance), we'll run this 
                    // later.  
                    paramReplacer.lastIndex = 0;
                    if (options || !paramReplacer.test(methodName)) {
                        // If we have options, run sub to replace templates `{}` with a
                        // value from the options or the window
                        var convertedName = options ? can.sub(methodName, this._lookup(options)) : methodName;
                        if (!convertedName) {
                            return null;
                        }
                        // If a `{}` template resolves to an object, `convertedName` will be
                        // an array
                        var arr = can.isArray(convertedName),

                            // Get the name
                            name = arr ? convertedName[1] : convertedName,

                            // Grab the event off the end
                            parts = name.split(/\s+/g),
                            event = parts.pop();

                        return {
                            processor: processors[event] || basicProcessor,
                            parts: [name, parts.join(" "), event],
                            delegate: arr ? convertedName[0] : undefined
                        };
                    }
                },
                _lookup: function(options) {
                    return [options, window]
                },
                // An object of `{eventName : function}` pairs that Control uses to 
                // hook up events auto-magically.

                processors: {},
                // A object of name-value pairs that act as default values for a 
                // control instance
                defaults: {}

            }, {

                // Sets `this.element`, saves the control in `data, binds event
                // handlers.

                setup: function(element, options) {

                    var cls = this.constructor,
                        pluginname = cls.pluginName || cls._fullName,
                        arr;

                    // Want the raw element here.
                    this.element = can.$(element)

                    if (pluginname && pluginname !== 'can_control') {
                        // Set element and `className` on element.
                        this.element.addClass(pluginname);
                    }

                    (arr = can.data(this.element, "controls")) || can.data(this.element, "controls", arr = []);
                    arr.push(this);

                    // Option merging.

                    this.options = extend({}, cls.defaults, options);

                    // Bind all event handlers.
                    this.on();

                    // Gets passed into `init`.

                    return [this.element, this.options];
                },

                on: function(el, selector, eventName, func) {
                    if (!el) {

                        // Adds bindings.
                        this.off();

                        // Go through the cached list of actions and use the processor 
                        // to bind
                        var cls = this.constructor,
                            bindings = this._bindings,
                            actions = cls.actions,
                            element = this.element,
                            destroyCB = can.Control._shifter(this, "destroy"),
                            funcName, ready;

                        for (funcName in actions) {
                            // Only push if we have the action and no option is `undefined`
                            if (actions.hasOwnProperty(funcName) &&
                                (ready = actions[funcName] || cls._action(funcName, this.options))) {
                                bindings.push(ready.processor(ready.delegate || element,
                                        ready.parts[2], ready.parts[1], funcName, this));
                            }
                        }


                        // Setup to be destroyed...  
                        // don't bind because we don't want to remove it.
                        can.bind.call(element, "removed", destroyCB);
                        bindings.push(function(el) {
                            can.unbind.call(el, "removed", destroyCB);
                        });
                        return bindings.length;
                    }

                    if (typeof el == 'string') {
                        func = eventName;
                        eventName = selector;
                        selector = el;
                        el = this.element;
                    }

                    if (func === undefined) {
                        func = eventName;
                        eventName = selector;
                        selector = null;
                    }

                    if (typeof func == 'string') {
                        func = can.Control._shifter(this, func);
                    }

                    this._bindings.push(binder(el, eventName, func, selector));

                    return this._bindings.length;
                },
                // Unbinds all event handlers on the controller.

                off: function() {
                    var el = this.element[0];
                    each(this._bindings || [], function(value) {
                        value(el);
                    });
                    // Adds bindings.
                    this._bindings = [];
                },
                // Prepares a `control` for garbage collection

                destroy: function() {
                    //Control already destroyed
                    if (this.element === null) {

                        return;
                    }
                    var Class = this.constructor,
                        pluginName = Class.pluginName || Class._fullName,
                        controls;

                    // Unbind bindings.
                    this.off();

                    if (pluginName && pluginName !== 'can_control') {
                        // Remove the `className`.
                        this.element.removeClass(pluginName);
                    }

                    // Remove from `data`.
                    controls = can.data(this.element, "controls");
                    controls.splice(can.inArray(this, controls), 1);

                    can.trigger(this, "destroyed"); // In case we want to know if the `control` is removed.

                    this.element = null;
                }
            });

        var processors = can.Control.processors,
            // Processors do the binding.
            // They return a function that unbinds when called.  
            // The basic processor that binds events.
            basicProcessor = function(el, event, selector, methodName, control) {
                return binder(el, event, can.Control._shifter(control, methodName), selector);
            };

        // Set common events to be processed as a `basicProcessor`
        each(["change", "click", "contextmenu", "dblclick", "keydown", "keyup",
                "keypress", "mousedown", "mousemove", "mouseout", "mouseover",
                "mouseup", "reset", "resize", "scroll", "select", "submit", "focusin",
                "focusout", "mouseenter", "mouseleave",
                // #104 - Add touch events as default processors
                // TOOD feature detect?
                "touchstart", "touchmove", "touchcancel", "touchend", "touchleave"
            ], function(v) {
                processors[v] = basicProcessor;
            });

        return Control;
    })(__m2, __m8);

    // ## can/util/bind/bind.js
    var __m12 = (function(can) {


        // ## Bind helpers
        can.bindAndSetup = function() {
            // Add the event to this object
            can.addEvent.apply(this, arguments);
            // If not initializing, and the first binding
            // call bindsetup if the function exists.
            if (!this._init) {
                if (!this._bindings) {
                    this._bindings = 1;
                    // setup live-binding
                    this._bindsetup && this._bindsetup();

                } else {
                    this._bindings++;
                }

            }

            return this;
        };

        can.unbindAndTeardown = function(ev, handler) {
            // Remove the event handler
            can.removeEvent.apply(this, arguments);

            if (this._bindings == null) {
                this._bindings = 0;
            } else {
                this._bindings--;
            }
            // If there are no longer any bindings and
            // there is a bindteardown method, call it.
            if (!this._bindings) {
                this._bindteardown && this._bindteardown();
            }
            return this;
        }

        return can;

    })(__m2);

    // ## can/util/batch/batch.js
    var __m13 = (function(can) {

        // Which batch of events this is for -- might not want to send multiple
        // messages on the same batch.  This is mostly for event delegation.
        var batchNum = 1,
            // how many times has start been called without a stop
            transactions = 0,
            // an array of events within a transaction
            batchEvents = [],
            stopCallbacks = [];


        can.batch = {

            start: function(batchStopHandler) {
                transactions++;
                batchStopHandler && stopCallbacks.push(batchStopHandler);
            },

            stop: function(force, callStart) {
                if (force) {
                    transactions = 0;
                } else {
                    transactions--;
                }

                if (transactions == 0) {
                    var items = batchEvents.slice(0),
                        callbacks = stopCallbacks.slice(0);
                    batchEvents = [];
                    stopCallbacks = [];
                    batchNum++;
                    callStart && can.batch.start();
                    can.each(items, function(args) {
                        can.trigger.apply(can, args);
                    });
                    can.each(callbacks, function(cb) {
                        cb();
                    });
                }
            },

            trigger: function(item, event, args) {
                // Don't send events if initalizing.
                if (!item._init) {
                    if (transactions == 0) {
                        return can.trigger(item, event, args);
                    } else {
                        event = typeof event === "string" ? {
                            type: event
                        } :
                            event;
                        event.batchNum = batchNum;
                        batchEvents.push([
                                item,
                                event,
                                args
                            ]);
                    }
                }
            }
        }


    })(__m4);

    // ## can/map/map.js
    var __m11 = (function(can, bind) {
        // ## map.js  
        // `can.Map`  
        // _Provides the observable pattern for JavaScript Objects._  
        // Removes all listeners.
        var bindToChildAndBubbleToParent = function(child, prop, parent) {
            child.bind("change" + parent._cid, function() {
                // `batchTrigger` the type on this...
                var args = can.makeArray(arguments),
                    ev = args.shift();
                args[0] = (prop === "*" ? [parent.indexOf(child), args[0]] : [prop, args[0]]).join(".");

                // track objects dispatched on this map		
                ev.triggeredNS = ev.triggeredNS || {};

                // if it has already been dispatched exit
                if (ev.triggeredNS[parent._cid]) {
                    return;
                }

                ev.triggeredNS[parent._cid] = true;
                // send change event with modified attr to parent	
                can.trigger(parent, ev, args);
                // send modified attr event to parent
                //can.trigger(parent, args[0], args);
            });
        },
            // An `id` to track events for a given map.
            observeId = 0,
            attrParts = function(attr, keepKey) {
                if (keepKey) {
                    return [attr];
                }
                return can.isArray(attr) ? attr : ("" + attr).split(".");
            },
            makeBindSetup = function(wildcard) {
                return function() {
                    var parent = this;
                    this._each(function(child, prop) {
                        if (child && child.bind) {
                            bindToChildAndBubbleToParent(child, wildcard || prop, parent)
                        }
                    })
                };
            };


        var Map = can.Map = can.Construct.extend({

                setup: function() {

                    can.Construct.setup.apply(this, arguments);


                    if (can.Map) {
                        if (!this.defaults) {
                            this.defaults = {};
                        }
                        for (var prop in this.prototype) {
                            if (typeof this.prototype[prop] !== "function") {
                                this.defaults[prop] = this.prototype[prop];
                            }
                        }
                    }
                    // if we inerit from can.Map, but not can.List
                    if (can.List && !(this.prototype instanceof can.List)) {
                        this.List = Map.List({
                                Map: this
                            }, {});
                    }

                },
                // keep so it can be overwritten
                bind: can.bindAndSetup,
                on: can.bindAndSetup,
                unbind: can.unbindAndTeardown,
                off: can.unbindAndTeardown,
                id: "id",
                helpers: {
                    canMakeObserve: function(obj) {
                        return obj && !can.isDeferred(obj) && (can.isArray(obj) || can.isPlainObject(obj) || (obj instanceof can.Map));
                    },
                    unhookup: function(items, namespace) {
                        return can.each(items, function(item) {
                            if (item && item.unbind) {
                                item.unbind("change" + namespace);
                            }
                        });
                    },
                    // Listens to changes on `child` and "bubbles" the event up.  
                    // `child` - The object to listen for changes on.  
                    // `prop` - The property name is at on.  
                    // `parent` - The parent object of prop.
                    // `ob` - (optional) The Map object constructor
                    // `list` - (optional) The observable list constructor
                    hookupBubble: function(child, prop, parent, Ob, List) {
                        Ob = Ob || Map;
                        List = List || Map.List;

                        // If it's an `array` make a list, otherwise a child.
                        if (child instanceof Map) {
                            // We have an `map` already...
                            // Make sure it is not listening to this already
                            // It's only listening if it has bindings already.
                            parent._bindings && Map.helpers.unhookup([child], parent._cid);
                        } else if (can.isArray(child)) {
                            child = new List(child);
                        } else {
                            child = new Ob(child);
                        }
                        // only listen if something is listening to you
                        if (parent._bindings) {
                            // Listen to all changes and `batchTrigger` upwards.
                            bindToChildAndBubbleToParent(child, prop, parent)
                        }


                        return child;
                    },
                    // A helper used to serialize an `Map` or `Map.List`.  
                    // `map` - The observable.  
                    // `how` - To serialize with `attr` or `serialize`.  
                    // `where` - To put properties, in an `{}` or `[]`.
                    serialize: function(map, how, where) {
                        // Go through each property.
                        map.each(function(val, name) {
                            // If the value is an `object`, and has an `attrs` or `serialize` function.
                            where[name] = Map.helpers.canMakeObserve(val) && can.isFunction(val[how]) ?
                            // Call `attrs` or `serialize` to get the original data back.
                            val[how]() :
                            // Otherwise return the value.
                            val;
                        });
                        return where;
                    },
                    makeBindSetup: makeBindSetup
                },

                // starts collecting events
                // takes a callback for after they are updated
                // how could you hook into after ejs

                keys: function(map) {
                    var keys = [];
                    can.__reading && can.__reading(map, '__keys');
                    for (var keyName in map._data) {
                        keys.push(keyName);
                    }
                    return keys;
                }
            },

            {
                setup: function(obj) {
                    // `_data` is where we keep the properties.
                    this._data = {}

                    // The namespace this `object` uses to listen to events.
                    can.cid(this, ".map");
                    // Sets all `attrs`.
                    this._init = 1;
                    this._setupComputes();
                    var data = can.extend(can.extend(true, {}, this.constructor.defaults || {}), obj)
                    this.attr(data);
                    this.bind('change' + this._cid, can.proxy(this._changes, this));
                    delete this._init;
                },
                _setupComputes: function() {
                    var prototype = this.constructor.prototype
                    for (var prop in prototype) {
                        if (prototype[prop] && prototype[prop].isComputed) {
                            this[prop] = prototype[prop].clone(this);
                        }
                    }
                },
                _bindsetup: makeBindSetup(),
                _bindteardown: function() {
                    var cid = this._cid;
                    this._each(function(child) {
                        Map.helpers.unhookup([child], cid)
                    })
                },
                _changes: function(ev, attr, how, newVal, oldVal) {
                    can.batch.trigger(this, {
                            type: attr,
                            batchNum: ev.batchNum
                        }, [newVal, oldVal]);
                },
                _triggerChange: function(attr, how, newVal, oldVal) {
                    can.batch.trigger(this, "change", can.makeArray(arguments))
                },
                // no live binding iterator
                _each: function(callback) {
                    var data = this.__get();
                    for (var prop in data) {
                        if (data.hasOwnProperty(prop)) {
                            callback(data[prop], prop)
                        }
                    }
                },

                attr: function(attr, val) {
                    // This is super obfuscated for space -- basically, we're checking
                    // if the type of the attribute is not a `number` or a `string`.
                    var type = typeof attr;
                    if (type !== "string" && type !== "number") {
                        return this._attrs(attr, val)
                    } else if (arguments.length === 1) { // If we are getting a value.
                        // Let people know we are reading.
                        can.__reading && can.__reading(this, attr)
                        return this._get(attr)
                    } else {
                        // Otherwise we are setting.
                        this._set(attr, val);
                        return this;
                    }
                },

                each: function() {
                    can.__reading && can.__reading(this, '__keys');
                    return can.each.apply(undefined, [this.__get()].concat(can.makeArray(arguments)))
                },

                removeAttr: function(attr) {
                    // Info if this is List or not
                    var isList = can.List && this instanceof can.List,
                        // Convert the `attr` into parts (if nested).
                        parts = attrParts(attr),
                        // The actual property to remove.
                        prop = parts.shift(),
                        // The current value.
                        current = isList ? this[prop] : this._data[prop];

                    // If we have more parts, call `removeAttr` on that part.
                    if (parts.length) {
                        return current.removeAttr(parts)
                    } else {
                        if (isList) {
                            this.splice(prop, 1)
                        } else if (prop in this._data) {
                            // Otherwise, `delete`.
                            delete this._data[prop];
                            // Create the event.
                            if (!(prop in this.constructor.prototype)) {
                                delete this[prop]
                            }
                            // Let others know the number of keys have changed
                            can.batch.trigger(this, "__keys");
                            this._triggerChange(prop, "remove", undefined, current);

                        }
                        return current;
                    }
                },
                // Reads a property from the `object`.
                _get: function(attr) {
                    var value = typeof attr === 'string' && !! ~attr.indexOf('.') && this.__get(attr);
                    if (value) {
                        return value;
                    }

                    // break up the attr (`"foo.bar"`) into `["foo","bar"]`
                    var parts = attrParts(attr),
                        // get the value of the first attr name (`"foo"`)
                        current = this.__get(parts.shift());
                    // if there are other attributes to read
                    return parts.length ?
                    // and current has a value
                    current ?
                    // lookup the remaining attrs on current
                    current._get(parts) :
                    // or if there's no current, return undefined
                    undefined :
                    // if there are no more parts, return current
                    current;
                },
                // Reads a property directly if an `attr` is provided, otherwise
                // returns the "real" data object itself.
                __get: function(attr) {
                    if (attr) {
                        if (this[attr] && this[attr].isComputed) {
                            return this[attr]()
                        } else {
                            return this._data[attr]
                        }
                    } else {
                        return this._data;
                    }
                },
                // Sets `attr` prop as value on this object where.
                // `attr` - Is a string of properties or an array  of property values.
                // `value` - The raw value to set.
                _set: function(attr, value, keepKey) {
                    // Convert `attr` to attr parts (if it isn't already).
                    var parts = attrParts(attr, keepKey),
                        // The immediate prop we are setting.
                        prop = parts.shift(),
                        // The current value.
                        current = this.__get(prop);

                    // If we have an `object` and remaining parts.
                    if (Map.helpers.canMakeObserve(current) && parts.length) {
                        // That `object` should set it (this might need to call attr).
                        current._set(parts, value)
                    } else if (!parts.length) {
                        // We're in "real" set territory.
                        if (this.__convert) {
                            value = this.__convert(prop, value)
                        }
                        this.__set(prop, value, current)
                    } else {
                        throw "can.Map: Object does not exist"
                    }
                },
                __set: function(prop, value, current) {

                    // Otherwise, we are setting it on this `object`.
                    // TODO: Check if value is object and transform
                    // are we changing the value.
                    if (value !== current) {
                        // Check if we are adding this for the first time --
                        // if we are, we need to create an `add` event.
                        var changeType = this.__get().hasOwnProperty(prop) ? "set" : "add";

                        // Set the value on data.
                        this.___set(prop,

                            // If we are getting an object.
                            Map.helpers.canMakeObserve(value) ?

                            // Hook it up to send event.
                            Map.helpers.hookupBubble(value, prop, this) :
                            // Value is normal.
                            value);

                        if (changeType == "add") {
                            // If there is no current value, let others know that
                            // the the number of keys have changed

                            can.batch.trigger(this, "__keys", undefined);

                        }
                        // `batchTrigger` the change event.
                        this._triggerChange(prop, changeType, value, current);

                        //can.batch.trigger(this, prop, [value, current]);
                        // If we can stop listening to our old value, do it.
                        current && Map.helpers.unhookup([current], this._cid);
                    }

                },
                // Directly sets a property on this `object`.
                ___set: function(prop, val) {

                    if (this[prop] && this[prop].isComputed) {
                        this[prop](val)
                    }

                    this._data[prop] = val;
                    // Add property directly for easy writing.
                    // Check if its on the `prototype` so we don't overwrite methods like `attrs`.
                    if (!(can.isFunction(this.constructor.prototype[prop]))) {
                        this[prop] = val
                    }
                },


                bind: can.bindAndSetup,
                on: can.bindAndSetup,

                unbind: can.unbindAndTeardown,
                off: can.unbindAndTeardown,

                serialize: function() {
                    return can.Map.helpers.serialize(this, 'serialize', {});
                },

                _attrs: function(props, remove) {

                    if (props === undefined) {
                        return Map.helpers.serialize(this, 'attr', {})
                    }

                    props = can.extend({}, props);
                    var prop,
                        self = this,
                        newVal;
                    can.batch.start();
                    this.each(function(curVal, prop) {
                        newVal = props[prop];

                        // If we are merging...
                        if (newVal === undefined) {
                            remove && self.removeAttr(prop);
                            return;
                        }

                        if (self.__convert) {
                            newVal = self.__convert(prop, newVal)
                        }

                        // if we're dealing with models, want to call _set to let converter run
                        if (newVal instanceof can.Map) {
                            self.__set(prop, newVal, curVal)
                            // if its an object, let attr merge
                        } else if (Map.helpers.canMakeObserve(curVal) && Map.helpers.canMakeObserve(newVal) && curVal.attr) {
                            curVal.attr(newVal, remove)
                            // otherwise just set
                        } else if (curVal != newVal) {
                            self.__set(prop, newVal, curVal)
                        }

                        delete props[prop];
                    })
                    // Add remaining props.
                    for (var prop in props) {
                        newVal = props[prop];
                        this._set(prop, newVal, true)
                    }
                    can.batch.stop()
                    return this;
                },


                compute: function(prop) {
                    if (can.isFunction(this.constructor.prototype[prop])) {
                        return can.compute(this[prop], this);
                    } else {
                        return can.compute(this, prop);
                    }

                }
            });

        return Map;
    })(__m2, __m12, __m8, __m13);

    // ## can/list/list.js
    var __m14 = (function(can, Map) {



        // Helpers for `observable` lists.
        var splice = [].splice,

            list = Map(

                {
                    setup: function(instances, options) {
                        this.length = 0;
                        can.cid(this, ".map")
                        this._init = 1;
                        if (can.isDeferred(instances)) {
                            this.replace(instances)
                        } else {
                            this.push.apply(this, can.makeArray(instances || []));
                        }
                        // this change needs to be ignored
                        this.bind('change' + this._cid, can.proxy(this._changes, this));
                        can.extend(this, options);
                        delete this._init;
                    },
                    _triggerChange: function(attr, how, newVal, oldVal) {

                        Map.prototype._triggerChange.apply(this, arguments)
                        // `batchTrigger` direct add and remove events...
                        if (!~attr.indexOf('.')) {

                            if (how === 'add') {
                                can.batch.trigger(this, how, [newVal, +attr]);
                                can.batch.trigger(this, 'length', [this.length]);
                            } else if (how === 'remove') {
                                can.batch.trigger(this, how, [oldVal, +attr]);
                                can.batch.trigger(this, 'length', [this.length]);
                            } else {
                                can.batch.trigger(this, how, [newVal, +attr])
                            }

                        }

                    },
                    __get: function(attr) {
                        return attr ? this[attr] : this;
                    },
                    ___set: function(attr, val) {
                        this[attr] = val;
                        if (+attr >= this.length) {
                            this.length = (+attr + 1)
                        }
                    },
                    _each: function(callback) {
                        var data = this.__get();
                        for (var i = 0; i < data.length; i++) {
                            callback(data[i], i)
                        }
                    },
                    _bindsetup: Map.helpers.makeBindSetup("*"),
                    // Returns the serialized form of this list.

                    serialize: function() {
                        return Map.helpers.serialize(this, 'serialize', []);
                    },

                    splice: function(index, howMany) {
                        var args = can.makeArray(arguments),
                            i;

                        for (i = 2; i < args.length; i++) {
                            var val = args[i];
                            if (Map.helpers.canMakeObserve(val)) {
                                args[i] = Map.helpers.hookupBubble(val, "*", this, this.constructor.Map, this.constructor)
                            }
                        }
                        if (howMany === undefined) {
                            howMany = args[1] = this.length - index;
                        }
                        var removed = splice.apply(this, args);
                        can.batch.start();
                        if (howMany > 0) {
                            this._triggerChange("" + index, "remove", undefined, removed);
                            Map.helpers.unhookup(removed, this._cid);
                        }
                        if (args.length > 2) {
                            this._triggerChange("" + index, "add", args.slice(2), removed);
                        }
                        can.batch.stop();
                        return removed;
                    },

                    _attrs: function(items, remove) {
                        if (items === undefined) {
                            return Map.helpers.serialize(this, 'attr', []);
                        }

                        // Create a copy.
                        items = can.makeArray(items);

                        can.batch.start();
                        this._updateAttrs(items, remove);
                        can.batch.stop()
                    },

                    _updateAttrs: function(items, remove) {
                        var len = Math.min(items.length, this.length);

                        for (var prop = 0; prop < len; prop++) {
                            var curVal = this[prop],
                                newVal = items[prop];

                            if (Map.helpers.canMakeObserve(curVal) && Map.helpers.canMakeObserve(newVal)) {
                                curVal.attr(newVal, remove)
                            } else if (curVal != newVal) {
                                this._set(prop, newVal)
                            } else {

                            }
                        }
                        if (items.length > this.length) {
                            // Add in the remaining props.
                            this.push.apply(this, items.slice(this.length));
                        } else if (items.length < this.length && remove) {
                            this.splice(items.length)
                        }
                    }
                }),

            // Converts to an `array` of arguments.
            getArgs = function(args) {
                return args[0] && can.isArray(args[0]) ?
                    args[0] :
                    can.makeArray(args);
            };
        // Create `push`, `pop`, `shift`, and `unshift`
        can.each({

                push: "length",

                unshift: 0
            },
            // Adds a method
            // `name` - The method name.
            // `where` - Where items in the `array` should be added.

            function(where, name) {
                var orig = [][name]
                list.prototype[name] = function() {
                    // Get the items being added.
                    var args = [],
                        // Where we are going to add items.
                        len = where ? this.length : 0,
                        i = arguments.length,
                        res,
                        val,
                        constructor = this.constructor;

                    // Go through and convert anything to an `map` that needs to be converted.
                    while (i--) {
                        val = arguments[i];
                        args[i] = Map.helpers.canMakeObserve(val) ?
                            Map.helpers.hookupBubble(val, "*", this, this.constructor.Map, this.constructor) :
                            val;
                    }

                    // Call the original method.
                    res = orig.apply(this, args);

                    if (!this.comparator || args.length) {

                        this._triggerChange("" + len, "add", args, undefined);
                    }

                    return res;
                }
            });

        can.each({

                pop: "length",

                shift: 0
            },
            // Creates a `remove` type method

            function(where, name) {
                list.prototype[name] = function() {

                    var args = getArgs(arguments),
                        len = where && this.length ? this.length - 1 : 0;

                    var res = [][name].apply(this, args)

                    // Create a change where the args are
                    // `len` - Where these items were removed.
                    // `remove` - Items removed.
                    // `undefined` - The new values (there are none).
                    // `res` - The old, removed values (should these be unbound).
                    this._triggerChange("" + len, "remove", undefined, [res])

                    if (res && res.unbind) {
                        res.unbind("change" + this._cid)
                    }
                    return res;
                }
            });

        can.extend(list.prototype, {

                indexOf: function(item) {
                    this.attr('length')
                    return can.inArray(item, this)
                },


                join: [].join,


                reverse: [].reverse,


                slice: function() {
                    var temp = Array.prototype.slice.apply(this, arguments);
                    return new this.constructor(temp);
                },


                concat: function() {
                    var args = [];
                    can.each(can.makeArray(arguments), function(arg, i) {
                        args[i] = arg instanceof can.List ? arg.serialize() : arg;
                    });
                    return new this.constructor(Array.prototype.concat.apply(this.serialize(), args));
                },


                forEach: function(cb, thisarg) {
                    can.each(this, cb, thisarg || this);
                },


                replace: function(newList) {
                    if (can.isDeferred(newList)) {
                        newList.then(can.proxy(this.replace, this));
                    } else {
                        this.splice.apply(this, [0, this.length].concat(can.makeArray(newList || [])));
                    }

                    return this;
                }
            });

        can.List = Map.List = list;
        return can.List;
    })(__m2, __m11);

    // ## can/compute/compute.js
    var __m15 = (function(can, bind) {

        // returns the
        // - observes and attr methods are called by func
        // - the value returned by func
        // ex: `{value: 100, observed: [{obs: o, attr: "completed"}]}`
        var getValueAndObserved = function(func, self) {

            var oldReading;

            // Set a callback on can.Map to know
            // when an attr is read.
            // Keep a reference to the old reader
            // if there is one.  This is used
            // for nested live binding.
            oldReading = can.__reading;
            can.__reading = function(obj, attr) {
                // Add the observe and attr that was read
                // to `observed`
                observed.push({
                        obj: obj,
                        attr: attr + ""
                    });
            };


            var observed = [],
                // Call the "wrapping" function to get the value. `observed`
                // will have the observe/attribute pairs that were read.
                value = func.call(self);

            // Set back so we are no longer reading.
            can.__reading = oldReading;

            return {
                value: value,
                observed: observed
            };
        },
            // Calls `callback(newVal, oldVal)` everytime an observed property
            // called within `getterSetter` is changed and creates a new result of `getterSetter`.
            // Also returns an object that can teardown all event handlers.
            computeBinder = function(getterSetter, context, callback, computeState) {
                // track what we are observing
                var observing = {},
                    // a flag indicating if this observe/attr pair is already bound
                    matched = true,
                    // the data to return 
                    data = {
                        // we will maintain the value while live-binding is taking place
                        value: undefined,
                        // a teardown method that stops listening
                        teardown: function() {
                            for (var name in observing) {
                                var ob = observing[name];
                                ob.observe.obj.unbind(ob.observe.attr, onchanged);
                                delete observing[name];
                            }
                        }
                    },
                    batchNum;

                // when a property value is changed
                var onchanged = function(ev) {
                    // If the compute is no longer bound (because the same change event led to an unbind)
                    // then do not call getValueAndBind, or we will leak bindings.
                    if (computeState && !computeState.bound) {
                        return;
                    }
                    if (ev.batchNum === undefined || ev.batchNum !== batchNum) {
                        // store the old value
                        var oldValue = data.value,
                            // get the new value
                            newvalue = getValueAndBind();

                        // update the value reference (in case someone reads)
                        data.value = newvalue;
                        // if a change happened
                        if (newvalue !== oldValue) {
                            callback(newvalue, oldValue);
                        }
                        batchNum = batchNum = ev.batchNum;
                    }


                };

                // gets the value returned by `getterSetter` and also binds to any attributes
                // read by the call
                var getValueAndBind = function() {
                    var info = getValueAndObserved(getterSetter, context),
                        newObserveSet = info.observed;

                    var value = info.value;
                    matched = !matched;

                    // go through every attribute read by this observe
                    can.each(newObserveSet, function(ob) {
                        // if the observe/attribute pair is being observed
                        if (observing[ob.obj._cid + "|" + ob.attr]) {
                            // mark at as observed
                            observing[ob.obj._cid + "|" + ob.attr].matched = matched;
                        } else {
                            // otherwise, set the observe/attribute on oldObserved, marking it as being observed
                            observing[ob.obj._cid + "|" + ob.attr] = {
                                matched: matched,
                                observe: ob
                            };
                            ob.obj.bind(ob.attr, onchanged);
                        }
                    });

                    // Iterate through oldObserved, looking for observe/attributes
                    // that are no longer being bound and unbind them
                    for (var name in observing) {
                        var ob = observing[name];
                        if (ob.matched !== matched) {
                            ob.observe.obj.unbind(ob.observe.attr, onchanged);
                            delete observing[name];
                        }
                    }
                    return value;
                };
                // set the initial value
                data.value = getValueAndBind();

                data.isListening = !can.isEmptyObject(observing);
                return data;
            }

            // if no one is listening ... we can not calculate every time

        can.compute = function(getterSetter, context, eventName) {
            if (getterSetter && getterSetter.isComputed) {
                return getterSetter;
            }
            // stores the result of computeBinder
            var computedData,
                // how many listeners to this this compute
                bindings = 0,
                // the computed object
                computed,
                // an object that keeps track if the computed is bound
                // onchanged needs to know this. It's possible a change happens and results in
                // something that unbinds the compute, it needs to not to try to recalculate who it
                // is listening to
                computeState = {
                    bound: false,
                    // true if this compute is calculated from other computes and observes
                    hasDependencies: false
                },
                // The following functions are overwritten depending on how compute() is called
                // a method to setup listening
                on = function() {},
                // a method to teardown listening
                off = function() {},
                // the current cached value (only valid if bound = true)
                value,
                // how to read the value
                get = function() {
                    return value
                },
                // sets the value
                set = function(newVal) {
                    value = newVal;
                },
                // this compute can be a dependency of other computes
                canReadForChangeEvent = true,
                // save for clone
                args = can.makeArray(arguments);

            computed = function(newVal) {
                // setting ...
                if (arguments.length) {
                    // save a reference to the old value
                    var old = value;

                    // setter may return a value if 
                    // setter is for a value maintained exclusively by this compute
                    var setVal = set.call(context, newVal, old);

                    // if this has dependencies return the current value
                    if (computed.hasDependencies) {
                        return get.call(context);
                    }

                    if (setVal === undefined) {
                        // it's possible, like with the DOM, setting does not
                        // fire a change event, so we must read
                        value = get.call(context);
                    } else {
                        value = setVal;
                    }
                    // fire the change
                    if (old !== value) {
                        can.batch.trigger(computed, "change", [value, old]);
                    }
                    return value;
                } else {
                    var oldReading = can.__reading,
                        ret;
                    // Let others know to listen to changes in this compute
                    if (can.__reading && canReadForChangeEvent) {
                        can.__reading(computed, 'change');
                        // but we are going to bind on this compute,
                        // so we don't want to bind on what it is binding to
                        delete can.__reading;
                    }
                    // if we are bound, use the cached value
                    if (computeState.bound) {
                        ret = value;
                    } else {
                        ret = get.call(context);
                    }
                    can.__reading = oldReading;
                    return ret;
                }
            }
            if (typeof getterSetter === "function") {
                set = getterSetter;
                get = getterSetter;
                canReadForChangeEvent = eventName === false ? false : true;
                computed.hasDependencies = false;
                on = function(update) {
                    computedData = computeBinder(getterSetter, context || this, update, computeState);
                    computed.hasDependencies = computedData.isListening
                    value = computedData.value;
                }
                off = function() {
                    computedData && computedData.teardown();
                }
            } else if (context) {

                if (typeof context == "string") {
                    // `can.compute(obj, "propertyName", [eventName])`

                    var propertyName = context,
                        isObserve = getterSetter instanceof can.Map;
                    if (isObserve) {
                        computed.hasDependencies = true;
                    }
                    get = function() {
                        if (isObserve) {
                            return getterSetter.attr(propertyName);
                        } else {
                            return getterSetter[propertyName];
                        }
                    }
                    set = function(newValue) {
                        if (isObserve) {
                            getterSetter.attr(propertyName, newValue)
                        } else {
                            getterSetter[propertyName] = newValue;
                        }
                    }
                    var handler;
                    on = function(update) {
                        handler = function() {
                            update(get(), value)
                        };
                        can.bind.call(getterSetter, eventName || propertyName, handler)

                        // use getValueAndObserved because
                        // we should not be indicating that some parent
                        // reads this property if it happens to be binding on it
                        value = getValueAndObserved(get).value
                    }
                    off = function() {
                        can.unbind.call(getterSetter, eventName || propertyName, handler)
                    }

                } else {
                    // `can.compute(initialValue, setter)`
                    if (typeof context === "function") {
                        value = getterSetter;
                        set = context;
                    } else {
                        // `can.compute(initialValue,{get:, set:, on:, off:})`
                        value = getterSetter;
                        var options = context;
                        get = options.get || get;
                        set = options.set || set;
                        on = options.on || on;
                        off = options.off || off;
                    }

                }



            } else {
                // `can.compute(5)`
                value = getterSetter;
            }

            computed.isComputed = true;

            can.cid(computed, "compute")

            var updater = function(newValue, oldValue) {
                value = newValue;
                // might need a way to look up new and oldVal
                can.batch.trigger(computed, "change", [newValue, oldValue])
            }

            return can.extend(computed, {
                    _bindsetup: function() {
                        computeState.bound = true;
                        // setup live-binding
                        on.call(this, updater)
                    },
                    _bindteardown: function() {
                        off.call(this, updater)
                        computeState.bound = false;
                    },

                    bind: can.bindAndSetup,

                    unbind: can.unbindAndTeardown,
                    clone: function(context) {
                        if (context) {
                            args[1] = context
                        }
                        return can.compute.apply(can, args);
                    }
                });
        };
        can.compute.binder = computeBinder;
        return can.compute;
    })(__m2, __m12, __m13);

    // ## can/observe/observe.js
    var __m10 = (function(can) {
        can.Observe = can.Map;
        can.Observe.startBatch = can.batch.start;
        can.Observe.stopBatch = can.batch.stop;
        can.Observe.triggerBatch = can.batch.trigger;
        return can;
    })(__m2, __m11, __m14, __m15);

    // ## can/view/view.js
    var __m18 = (function(can) {
        // ## view.js
        // `can.view`  
        // _Templating abstraction._

        var isFunction = can.isFunction,
            makeArray = can.makeArray,
            // Used for hookup `id`s.
            hookupId = 1,

            $view = can.view = can.template = function(view, data, helpers, callback) {
                // If helpers is a `function`, it is actually a callback.
                if (isFunction(helpers)) {
                    callback = helpers;
                    helpers = undefined;
                }

                var pipe = function(result) {
                    return $view.frag(result);
                },
                    // In case we got a callback, we need to convert the can.view.render
                    // result to a document fragment
                    wrapCallback = isFunction(callback) ? function(frag) {
                        callback(pipe(frag));
                    } : null,
                    // Get the result, if a renderer function is passed in, then we just use that to render the data
                    result = isFunction(view) ? view(data, helpers, wrapCallback) : $view.render(view, data, helpers, wrapCallback),
                    deferred = can.Deferred();

                if (isFunction(result)) {
                    return result;
                }

                if (can.isDeferred(result)) {
                    result.then(function(result, data) {
                        deferred.resolve.call(deferred, pipe(result), data);
                    }, function() {
                        deferred.fail.apply(deferred, arguments);
                    });
                    return deferred;
                }

                // Convert it into a dom frag.
                return pipe(result);
            };

        can.extend($view, {
                // creates a frag and hooks it up all at once

                frag: function(result, parentNode) {
                    return $view.hookup($view.fragment(result), parentNode);
                },

                // simply creates a frag
                // this is used internally to create a frag
                // insert it
                // then hook it up
                fragment: function(result) {
                    var frag = can.buildFragment(result, document.body);
                    // If we have an empty frag...
                    if (!frag.childNodes.length) {
                        frag.appendChild(document.createTextNode(''));
                    }
                    return frag;
                },

                // Convert a path like string into something that's ok for an `element` ID.
                toId: function(src) {
                    return can.map(src.toString().split(/\/|\./g), function(part) {
                        // Dont include empty strings in toId functions
                        if (part) {
                            return part;
                        }
                    }).join("_");
                },

                hookup: function(fragment, parentNode) {
                    var hookupEls = [],
                        id,
                        func;

                    // Get all `childNodes`.
                    can.each(fragment.childNodes ? can.makeArray(fragment.childNodes) : fragment, function(node) {
                        if (node.nodeType === 1) {
                            hookupEls.push(node);
                            hookupEls.push.apply(hookupEls, can.makeArray(node.getElementsByTagName('*')));
                        }
                    });

                    // Filter by `data-view-id` attribute.
                    can.each(hookupEls, function(el) {
                        if (el.getAttribute && (id = el.getAttribute('data-view-id')) && (func = $view.hookups[id])) {
                            func(el, parentNode, id);
                            delete $view.hookups[id];
                            el.removeAttribute('data-view-id');
                        }
                    });

                    return fragment;
                },


                // auj

                // heir

                hookups: {},


                hook: function(cb) {
                    $view.hookups[++hookupId] = cb;
                    return " data-view-id='" + hookupId + "'";
                },


                cached: {},

                cachedRenderers: {},


                cache: true,


                register: function(info) {
                    this.types["." + info.suffix] = info;
                },

                types: {},


                ext: ".ejs",


                registerScript: function() {},


                preload: function() {},


                render: function(view, data, helpers, callback) {
                    // If helpers is a `function`, it is actually a callback.
                    if (isFunction(helpers)) {
                        callback = helpers;
                        helpers = undefined;
                    }

                    // See if we got passed any deferreds.
                    var deferreds = getDeferreds(data);

                    if (deferreds.length) { // Does data contain any deferreds?
                        // The deferred that resolves into the rendered content...
                        var deferred = new can.Deferred(),
                            dataCopy = can.extend({}, data);

                        // Add the view request to the list of deferreds.
                        deferreds.push(get(view, true))

                        // Wait for the view and all deferreds to finish...
                        can.when.apply(can, deferreds).then(function(resolved) {
                            // Get all the resolved deferreds.
                            var objs = makeArray(arguments),
                                // Renderer is the last index of the data.
                                renderer = objs.pop(),
                                // The result of the template rendering with data.
                                result;

                            // Make data look like the resolved deferreds.
                            if (can.isDeferred(data)) {
                                dataCopy = usefulPart(resolved);
                            } else {
                                // Go through each prop in data again and
                                // replace the defferreds with what they resolved to.
                                for (var prop in data) {
                                    if (can.isDeferred(data[prop])) {
                                        dataCopy[prop] = usefulPart(objs.shift());
                                    }
                                }
                            }

                            // Get the rendered result.
                            result = renderer(dataCopy, helpers);

                            // Resolve with the rendered view.
                            deferred.resolve(result, dataCopy);

                            // If there's a `callback`, call it back with the result.
                            callback && callback(result, dataCopy);
                        }, function() {
                            deferred.reject.apply(deferred, arguments)
                        });
                        // Return the deferred...
                        return deferred;
                    } else {
                        // get is called async but in 
                        // ff will be async so we need to temporarily reset
                        if (can.__reading) {
                            var reading = can.__reading;
                            can.__reading = null;
                        }

                        // No deferreds! Render this bad boy.
                        var response,
                            // If there's a `callback` function
                            async = isFunction(callback),
                            // Get the `view` type
                            deferred = get(view, async);

                        if (can.Map && can.__reading) {
                            can.__reading = reading;
                        }

                        // If we are `async`...
                        if (async) {
                            // Return the deferred
                            response = deferred;
                            // And fire callback with the rendered result.
                            deferred.then(function(renderer) {
                                callback(data ? renderer(data, helpers) : renderer);
                            })
                        } else {
                            // if the deferred is resolved, call the cached renderer instead
                            // this is because it's possible, with recursive deferreds to
                            // need to render a view while its deferred is _resolving_.  A _resolving_ deferred
                            // is a deferred that was just resolved and is calling back it's success callbacks.
                            // If a new success handler is called while resoliving, it does not get fired by
                            // jQuery's deferred system.  So instead of adding a new callback
                            // we use the cached renderer.
                            // We also add __view_id on the deferred so we can look up it's cached renderer.
                            // In the future, we might simply store either a deferred or the cached result.
                            if (deferred.state() === "resolved" && deferred.__view_id) {
                                var currentRenderer = $view.cachedRenderers[deferred.__view_id];
                                return data ? currentRenderer(data, helpers) : currentRenderer;
                            } else {
                                // Otherwise, the deferred is complete, so
                                // set response to the result of the rendering.
                                deferred.then(function(renderer) {
                                    response = data ? renderer(data, helpers) : renderer;
                                });
                            }
                        }

                        return response;
                    }
                },


                registerView: function(id, text, type, def) {
                    // Get the renderer function.
                    var func = (type || $view.types[$view.ext]).renderer(id, text);
                    def = def || new can.Deferred();

                    // Cache if we are caching.
                    if ($view.cache) {
                        $view.cached[id] = def;
                        def.__view_id = id;
                        $view.cachedRenderers[id] = func;
                    }

                    // Return the objects for the response's `dataTypes`
                    // (in this case view).
                    return def.resolve(func);
                }
            });

        // Makes sure there's a template, if not, have `steal` provide a warning.
        var checkText = function(text, url) {
            if (!text.length) {

                throw "can.view: No template or empty template:" + url;
            }
        },
            // `Returns a `view` renderer deferred.  
            // `url` - The url to the template.  
            // `async` - If the ajax request should be asynchronous.  
            // Returns a deferred.
            get = function(obj, async) {
                var url = typeof obj === 'string' ? obj : obj.url,
                    suffix = obj.engine || url.match(/\.[\w\d]+$/),
                    type,
                    // If we are reading a script element for the content of the template,
                    // `el` will be set to that script element.
                    el,
                    // A unique identifier for the view (used for caching).
                    // This is typically derived from the element id or
                    // the url for the template.
                    id,
                    // The ajax request used to retrieve the template content.
                    jqXHR;

                //If the url has a #, we assume we want to use an inline template
                //from a script element and not current page's HTML
                if (url.match(/^#/)) {
                    url = url.substr(1);
                }
                // If we have an inline template, derive the suffix from the `text/???` part.
                // This only supports `<script>` tags.
                if (el = document.getElementById(url)) {
                    suffix = "." + el.type.match(/\/(x\-)?(.+)/)[2];
                }

                // If there is no suffix, add one.
                if (!suffix && !$view.cached[url]) {
                    url += (suffix = $view.ext);
                }

                if (can.isArray(suffix)) {
                    suffix = suffix[0]
                }

                // Convert to a unique and valid id.
                id = $view.toId(url);

                // If an absolute path, use `steal` to get it.
                // You should only be using `//` if you are using `steal`.
                if (url.match(/^\/\//)) {
                    var sub = url.substr(2);
                    url = !window.steal ?
                        sub :
                        steal.config().root.mapJoin("" + steal.id(sub));
                }

                // Set the template engine type.
                type = $view.types[suffix];

                // If it is cached, 
                if ($view.cached[id]) {
                    // Return the cached deferred renderer.
                    return $view.cached[id];

                    // Otherwise if we are getting this from a `<script>` element.
                } else if (el) {
                    // Resolve immediately with the element's `innerHTML`.
                    return $view.registerView(id, el.innerHTML, type);
                } else {
                    // Make an ajax request for text.
                    var d = new can.Deferred();
                    can.ajax({
                            async: async,
                            url: url,
                            dataType: "text",
                            error: function(jqXHR) {
                                checkText("", url);
                                d.reject(jqXHR);
                            },
                            success: function(text) {
                                // Make sure we got some text back.
                                checkText(text, url);
                                $view.registerView(id, text, type, d)
                            }
                        });
                    return d;
                }
            },
            // Gets an `array` of deferreds from an `object`.
            // This only goes one level deep.
            getDeferreds = function(data) {
                var deferreds = [];

                // pull out deferreds
                if (can.isDeferred(data)) {
                    return [data]
                } else {
                    for (var prop in data) {
                        if (can.isDeferred(data[prop])) {
                            deferreds.push(data[prop]);
                        }
                    }
                }
                return deferreds;
            },
            // Gets the useful part of a resolved deferred.
            // This is for `model`s and `can.ajax` that resolve to an `array`.
            usefulPart = function(resolved) {
                return can.isArray(resolved) && resolved[1] === 'success' ? resolved[0] : resolved
            };

        //!steal-pluginify-remove-start
        if (window.steal) {
            steal.type("view js", function(options, success, error) {
                var type = $view.types["." + options.type],
                    id = $view.toId(options.id);

                options.text = "steal('" + (type.plugin || "can/view/" + options.type) + "',function(can){return " + "can.view.preload('" + id + "'," + options.text + ");\n})";
                success();
            })
        }
        //!steal-pluginify-remove-end

        can.extend($view, {
                register: function(info) {
                    this.types["." + info.suffix] = info;

                    //!steal-pluginify-remove-start
                    if (window.steal) {
                        steal.type(info.suffix + " view js", function(options, success, error) {
                            var type = $view.types["." + options.type],
                                id = $view.toId(options.id + '');

                            options.text = type.script(id, options.text)
                            success();
                        })
                    };
                    //!steal-pluginify-remove-end

                    $view[info.suffix] = function(id, text) {
                        if (!text) {
                            // Return a nameless renderer
                            var renderer = function() {
                                return $view.frag(renderer.render.apply(this, arguments));
                            }
                            renderer.render = function() {
                                var renderer = info.renderer(null, id);
                                return renderer.apply(renderer, arguments);
                            }
                            return renderer;
                        }

                        return $view.preload(id, info.renderer(id, text));
                    }
                },
                registerScript: function(type, id, src) {
                    return "can.view.preload('" + id + "'," + $view.types["." + type].script(id, src) + ");";
                },
                preload: function(id, renderer) {
                    var def = $view.cached[id] = new can.Deferred().resolve(function(data, helpers) {
                        return renderer.call(data, data, helpers);
                    });

                    function frag() {
                        return $view.frag(renderer.apply(this, arguments));
                    }
                    // expose the renderer for mustache
                    frag.render = renderer;

                    // set cache references (otherwise preloaded recursive views won't recurse properly)
                    def.__view_id = id;
                    $view.cachedRenderers[id] = renderer;

                    return frag;
                }

            });

        return can;
    })(__m2);

    // ## can/view/scope/scope.js
    var __m17 = (function(can) {

        var isObserve = function(obj) {
            return obj instanceof can.Map || (obj && !! obj.__get);
        }
        var getProp = function(obj, prop) {
            var val = obj[prop];

            if (typeof val !== "function" && obj.__get) {
                return obj.__get(prop);
            } else {
                return val;
            }
        }

        var Scope = can.Construct.extend({
                init: function(data, parent) {
                    this._data = data;
                    this._parent = parent;
                },
                get: function(attr) {

                    if (attr.substr(0, 3) === "../") {
                        return this._parent.get(attr.substr(3))
                    } else if (attr == "..") {
                        return {
                            value: this._parent._data
                        }
                    } else if (attr == "." || attr == "this") {
                        return {
                            value: this._data
                        };
                    }


                    var names = attr.indexOf('\\.') == -1
                    // Reference doesn't contain escaped periods
                    ? attr.split('.')
                    // Reference contains escaped periods (`a.b\c.foo` == `a["b.c"].foo)
                    : (function() {
                        var names = [],
                            last = 0;
                        attr.replace(/(\\)?\./g, function($0, $1, index) {
                            if (!$1) {
                                names.push(attr.slice(last, index).replace(/\\\./g, '.'));
                                last = index + $0.length;
                            }
                        });
                        names.push(attr.slice(last).replace(/\\\./g, '.'));
                        return names;
                    })(),
                        namesLength = names.length,
                        defaultPropertyDepth = -1,
                        defaultObserve,
                        defaultObserveName,
                        j,
                        lastValue,
                        ref,
                        value;

                    var scope = this;
                    while (scope) {

                        value = scope._data




                        if (value != null) {
                            // if it's a compute, read the compute's value


                            for (j = 0; j < namesLength; j++) {

                                // convert computes to read properties from them ...
                                // better would be to generate another compute that reads this compute
                                if (can.isFunction(value) && value.isComputed) {
                                    value = value();
                                }
                                var tempValue = getProp(value, names[j]);
                                // Keep running up the tree while there are matches.
                                if (typeof tempValue !== 'undefined' && tempValue !== null) {
                                    // //if(typeof tempValue !== 'undefined' && tempValue !== null) {
                                    // //if (typeof value[names[j]] !== 'undefined' && value[names[j]] !== null) {
                                    lastValue = value;
                                    value = tempValue;
                                    name = names[j];
                                }

                                // If it's undefined, still match if the parent is an Observe.
                                else if (isObserve(value) && j > defaultPropertyDepth) {
                                    defaultObserve = value;
                                    defaultObserveName = names[j];
                                    defaultPropertyDepth = j;
                                    lastValue = value = undefined;
                                    break;
                                } else {
                                    lastValue = value = undefined;
                                    break;
                                }


                            }
                        }
                        // Found a matched reference.
                        if (value !== undefined) {
                            return {
                                scope: scope,
                                parent: lastValue || scope._data,
                                value: value,
                                name: name
                            }; // Mustache.resolve(value, lastValue, name, isArgument);
                        } else {

                        }

                        // move up to the next scope
                        scope = scope._parent;
                    }

                    if (defaultObserve) {
                        {
                            return {
                                //scope: scope,
                                parent: defaultObserve,
                                name: defaultObserveName,
                                value: undefined
                            }
                        }
                    }
                    return {
                        //scope: this,
                        parent: null,
                        name: attr,
                        value: undefined
                    }
                },
                attr: function(attr, value) {
                    if (arguments.length > 1) {
                        this._data.attr(attr, value)
                        return this;
                    } else {
                        return this.get(attr).value
                    }

                },
                add: function(data) {
                    if (data !== this._data) {
                        return new this.constructor(data, this);
                    } else {
                        return this;
                    }

                },
                compute: function(attr) {
                    var data = this.get(attr);

                    if (isObserve(data.parent)) {
                        return data.parent.compute(data.name);
                    } else {
                        can.compute(function(newValue) {
                            if (arguments.length) {
                                data.parent[data.name] = newValue;
                            } else {
                                return data.parent[data.name];
                            }
                        })
                    }
                }
            });
        can.view.Scope = Scope;
        return Scope;

    })(__m2, __m8, __m11, __m14, __m18, __m15);

    // ## can/view/elements.js
    var __m20 = (function() {

        var elements = {
            tagToContentPropMap: {
                option: "textContent" in document.createElement("option") ? "textContent" : "innerText",
                textarea: "value"
            },

            attrMap: {
                "class": "className",
                "value": "value",
                "innerText": "innerText",
                "textContent": "textContent",
                "checked": true,
                "disabled": true,
                "readonly": true,
                "required": true,
                src: function(el, val) {
                    if (val == null || val == "") {
                        el.removeAttribute("src")
                    } else {
                        el.setAttribute("src", val)
                    }
                }
            },
            // matches the attrName of a regexp
            attrReg: /([^\s]+)[\s]*=[\s]*/,
            // elements whos default value we should set
            defaultValue: ["input", "textarea"],
            // a map of parent element to child elements
            tagMap: {
                "": "span",
                table: "tbody",
                tr: "td",
                ol: "li",
                ul: "li",
                tbody: "tr",
                thead: "tr",
                tfoot: "tr",
                select: "option",
                optgroup: "option"
            },
            // a tag's parent element
            reverseTagMap: {
                tr: "tbody",
                option: "select",
                td: "tr",
                th: "tr",
                li: "ul"
            },

            getParentNode: function(el, defaultParentNode) {
                return defaultParentNode && el.parentNode.nodeType === 11 ? defaultParentNode : el.parentNode;
            },
            // set an attribute on an element
            setAttr: function(el, attrName, val) {
                var tagName = el.nodeName.toString().toLowerCase(),
                    prop = elements.attrMap[attrName];
                // if this is a special property
                if (typeof prop === "function") {
                    prop(el, val)
                } else if (prop === true) {
                    el[attrName] = true;
                } else if (prop) {
                    // set the value as true / false
                    el[prop] = val;
                    if (prop === "value" && can.inArray(tagName, elements.defaultValue) >= 0) {
                        el.defaultValue = val;
                    }
                } else {
                    el.setAttribute(attrName, val);
                }
            },
            // gets the value of an attribute
            getAttr: function(el, attrName) {
                // Default to a blank string for IE7/8
                return (elements.attrMap[attrName] && el[elements.attrMap[attrName]] ?
                    el[elements.attrMap[attrName]] :
                    el.getAttribute(attrName)) || '';
            },
            // removes the attribute
            removeAttr: function(el, attrName) {
                var setter = elements.attrMap[attrName];
                if (typeof prop === "function") {
                    prop(el, undefined)
                }
                if (setter === true) {
                    el[attrName] = false;
                } else if (typeof setter === "string") {
                    el[setter] = "";
                } else {
                    el.removeAttribute(attrName);
                }
            },
            contentText: function(text) {
                if (typeof text == 'string') {
                    return text;
                }
                // If has no value, return an empty string.
                if (!text && text !== 0) {
                    return '';
                }
                return "" + text;
            }
        };

        // feature detect if setAttribute works with styles
        (function() {
            // feature detect if 
            var div = document.createElement('div')
            div.setAttribute("style", "width: 5px")
            div.setAttribute("style", "width: 10px");
            // make style use cssText
            elements.attrMap.style = function(el, val) {
                el.style.cssText = val || ""
            }
        })();


        return elements;
    })();

    // ## can/view/scanner.js
    var __m19 = (function(can, elements) {

        var newLine = /(\r|\n)+/g,
            // Escapes characters starting with `\`.
            clean = function(content) {
                return content
                    .split('\\').join("\\\\")
                    .split("\n").join("\\n")
                    .split('"').join('\\"')
                    .split("\t").join("\\t");
            },
            // Returns a tagName to use as a temporary placeholder for live content
            // looks forward ... could be slow, but we only do it when necessary
            getTag = function(tagName, tokens, i) {
                // if a tagName is provided, use that
                if (tagName) {
                    return tagName;
                } else {
                    // otherwise go searching for the next two tokens like "<",TAG
                    while (i < tokens.length) {
                        if (tokens[i] == "<" && elements.reverseTagMap[tokens[i + 1]]) {
                            return elements.reverseTagMap[tokens[i + 1]];
                        }
                        i++;
                    }
                }
                return '';
            },
            bracketNum = function(content) {
                return (--content.split("{").length) - (--content.split("}").length);
            },
            myEval = function(script) {
                eval(script);
            },
            attrReg = /([^\s]+)[\s]*=[\s]*$/,
            // Commands for caching.
            startTxt = 'var ___v1ew = [];',
            finishTxt = "return ___v1ew.join('')",
            put_cmd = "___v1ew.push(\n",
            insert_cmd = put_cmd,
            // Global controls (used by other functions to know where we are).
            // Are we inside a tag?
            htmlTag = null,
            // Are we within a quote within a tag?
            quote = null,
            // What was the text before the current quote? (used to get the `attr` name)
            beforeQuote = null,
            // Whether a rescan is in progress
            rescan = null,
            getAttrName = function() {
                var matches = beforeQuote.match(attrReg);
                return matches && matches[1];
            },
            // Used to mark where the element is.
            status = function() {
                // `t` - `1`.
                // `h` - `0`.
                // `q` - String `beforeQuote`.
                return quote ? "'" + getAttrName() + "'" : (htmlTag ? 1 : 0);
            },
            // returns the top of a stack
            top = function(stack) {
                return stack[stack.length - 1]
            };

        can.view.Scanner = Scanner = function(options) {
            // Set options on self
            can.extend(this, {

                    text: {},
                    tokens: []
                }, options);
            // make sure it's an empty string if it's not
            this.text.options = this.text.options || ""

            // Cache a token lookup
            this.tokenReg = [];
            this.tokenSimple = {
                "<": "<",
                ">": ">",
                '"': '"',
                "'": "'"
            };
            this.tokenComplex = [];
            this.tokenMap = {};
            for (var i = 0, token; token = this.tokens[i]; i++) {


                // Save complex mappings (custom regexp)
                if (token[2]) {
                    this.tokenReg.push(token[2]);
                    this.tokenComplex.push({
                            abbr: token[1],
                            re: new RegExp(token[2]),
                            rescan: token[3]
                        });
                }
                // Save simple mappings (string only, no regexp)
                else {
                    this.tokenReg.push(token[1]);
                    this.tokenSimple[token[1]] = token[0];
                }
                this.tokenMap[token[0]] = token[1];
            }

            // Cache the token registry.
            this.tokenReg = new RegExp("(" + this.tokenReg.slice(0).concat(["<", ">", '"', "'"]).join("|") + ")", "g");
        };

        Scanner.attributes = {};
        Scanner.regExpAttributes = {};

        Scanner.attribute = function(attribute, callback) {
            if (typeof attribute == "string") {
                Scanner.attributes[attribute] = callback;
            } else {
                Scanner.regExpAttributes[attribute] = {
                    match: attribute,
                    callback: callback
                };
            }

        }
        Scanner.hookupAttributes = function(options, el) {
            can.each(options && options.attrs || [], function(attr) {
                options.attr = attr;
                if (Scanner.attributes[attr]) {
                    Scanner.attributes[attr](options, el);
                } else {
                    can.each(Scanner.regExpAttributes, function(attrMatcher) {
                        if (attrMatcher.match.test(attr)) {
                            attrMatcher.callback(options, el)
                        }
                    })
                }

            })
        }
        Scanner.tag = function(tagName, callback) {
            // if we have html5shive ... re-generate
            if (window.html5) {
                html5.elements += " " + tagName
                html5.shivDocument();
            }

            Scanner.tags[tagName.toLowerCase()] = callback;
        }
        Scanner.tags = {};

        Scanner.hookupTag = function(hookupOptions) {
            var hooks = can.view.getHooks();
            return can.view.hook(function(el) {
                can.each(hooks, function(fn) {
                    fn(el);
                });

                var helperTags = hookupOptions.options.attr('helpers._tags'),
                    tagName = hookupOptions.tagName,
                    tagCallback = (helperTags && helperTags[tagName]) || Scanner.tags[tagName]

                var res = tagCallback(el, hookupOptions),
                    scope = hookupOptions.scope;

                if (res) {

                    if (scope !== res) {
                        scope = scope.add(res)
                    }
                    var frag = can.view.frag(hookupOptions.subtemplate(scope, hookupOptions.options));
                    can.appendChild(el, frag);
                }
                can.view.Scanner.hookupAttributes(hookupOptions, el);
            });

        }

        Scanner.prototype = {

            helpers: [],

            scan: function(source, name) {
                var tokens = [],
                    last = 0,
                    simple = this.tokenSimple,
                    complex = this.tokenComplex;

                source = source.replace(newLine, "\n");
                if (this.transform) {
                    source = this.transform(source);
                }
                source.replace(this.tokenReg, function(whole, part) {
                    // offset is the second to last argument
                    var offset = arguments[arguments.length - 2];

                    // if the next token starts after the last token ends
                    // push what's in between
                    if (offset > last) {
                        tokens.push(source.substring(last, offset));
                    }

                    // push the simple token (if there is one)
                    if (simple[whole]) {
                        tokens.push(whole);
                    }
                    // otherwise lookup complex tokens
                    else {
                        for (var i = 0, token; token = complex[i]; i++) {
                            if (token.re.test(whole)) {
                                tokens.push(token.abbr);
                                // Push a rescan function if one exists
                                if (token.rescan) {
                                    tokens.push(token.rescan(part));
                                }
                                break;
                            }
                        }
                    }

                    // update the position of the last part of the last token
                    last = offset + part.length;
                });

                // if there's something at the end, add it
                if (last < source.length) {
                    tokens.push(source.substr(last));
                }

                var content = '',
                    buff = [startTxt + (this.text.start || '')],
                    // Helper `function` for putting stuff in the view concat.
                    put = function(content, bonus) {
                        buff.push(put_cmd, '"', clean(content), '"' + (bonus || '') + ');');
                    },
                    // A stack used to keep track of how we should end a bracket
                    // `}`.  
                    // Once we have a `<%= %>` with a `leftBracket`,
                    // we store how the file should end here (either `))` or `;`).
                    endStack = [],
                    // The last token, used to remember which tag we are in.
                    lastToken,
                    // The corresponding magic tag.
                    startTag = null,
                    // Was there a magic tag inside an html tag?
                    magicInTag = false,
                    // was there a special state
                    specialStates = {
                        attributeHookups: [],
                        // a stack of tagHookups
                        tagHookups: []
                    },
                    // The current tag name.
                    tagName = '',
                    // stack of tagNames
                    tagNames = [],
                    // Pop from tagNames?
                    popTagName = false,
                    // Declared here.
                    bracketCount,

                    // in a special attr like src= or style=
                    specialAttribute = false,

                    i = 0,
                    token,
                    tmap = this.tokenMap,
                    attrName;

                // Reinitialize the tag state goodness.
                htmlTag = quote = beforeQuote = null;

                for (;
                    (token = tokens[i++]) !== undefined;) {
                    if (startTag === null) {
                        switch (token) {
                            case tmap.left:
                            case tmap.escapeLeft:
                            case tmap.returnLeft:
                                magicInTag = htmlTag && 1;
                            case tmap.commentLeft:
                                // A new line -- just add whatever content within a clean.  
                                // Reset everything.
                                startTag = token;
                                if (content.length) {
                                    put(content);
                                }
                                content = '';
                                break;
                            case tmap.escapeFull:
                                // This is a full line escape (a line that contains only whitespace and escaped logic)
                                // Break it up into escape left and right
                                magicInTag = htmlTag && 1;
                                rescan = 1;
                                startTag = tmap.escapeLeft;
                                if (content.length) {
                                    put(content);
                                }
                                rescan = tokens[i++];
                                content = rescan.content || rescan;
                                if (rescan.before) {
                                    put(rescan.before);
                                }
                                tokens.splice(i, 0, tmap.right);
                                break;
                            case tmap.commentFull:
                                // Ignore full line comments.
                                break;
                            case tmap.templateLeft:
                                content += tmap.left;
                                break;
                            case '<':
                                // Make sure we are not in a comment.
                                if (tokens[i].indexOf("!--") !== 0) {
                                    htmlTag = 1;
                                    magicInTag = 0;
                                }

                                content += token;


                                break;
                            case '>':
                                htmlTag = 0;
                                // content.substr(-1) doesn't work in IE7/8
                                var emptyElement = (content.substr(content.length - 1) == "/" || content.substr(content.length - 2) == "--"),
                                    attrs = "";
                                // if there was a magic tag
                                // or it's an element that has text content between its tags, 
                                // but content is not other tags add a hookup
                                // TODO: we should only add `can.EJS.pending()` if there's a magic tag 
                                // within the html tags.
                                if (specialStates.attributeHookups.length) {
                                    attrs = "attrs: ['" + specialStates.attributeHookups.join("','") + "'], ";
                                    specialStates.attributeHookups = [];
                                }

                                if (tagName === top(specialStates.tagHookups)) {
                                    // If it's a self closing tag (like <content/>) make sure we put the / at the end
                                    if (emptyElement) {
                                        content = content.substr(0, content.length - 1)
                                    }
                                    buff.push(put_cmd,
                                        '"', clean(content), '"',
                                        ",can.view.Scanner.hookupTag({tagName:'" + tagName + "'," + (attrs) + "scope: " + (this.text.scope || "this") + this.text.options)




                                    // if it's a self closing tag (like <content/>) close and end the tag
                                    if (emptyElement) {
                                        buff.push("}));");
                                        content = "/>";
                                        specialStates.tagHookups.pop()
                                    }
                                    // if it's an empty tag	 
                                    else if (tokens[i] === "<" && tokens[i + 1] === "/" + tagName) {
                                        buff.push("}));");
                                        content = token;
                                        specialStates.tagHookups.pop()
                                    } else {
                                        buff.push(",subtemplate: function(" + this.text.argNames + "){\n" + startTxt + (this.text.start || ''));
                                        content = '';
                                    }

                                } else if (magicInTag || (!popTagName && elements.tagToContentPropMap[tagNames[tagNames.length - 1]]) || attrs) {
                                    // make sure / of /> is on the right of pending
                                    if (emptyElement) {
                                        put(content.substr(0, content.length - 1), ",can.view.pending({" + attrs + "scope: " + (this.text.scope || "this") + this.text.options + "}),\"/>\"");
                                    } else {
                                        put(content, ",can.view.pending({" + attrs + "scope: " + (this.text.scope || "this") + this.text.options + "}),\">\"");
                                    }
                                    content = '';
                                    magicInTag = 0;
                                } else {
                                    content += token;
                                }



                                // if it's a tag like <input/>
                                if (emptyElement || popTagName) {
                                    // remove the current tag in the stack
                                    tagNames.pop();
                                    // set the current tag to the previous parent
                                    tagName = tagNames[tagNames.length - 1];
                                    // Don't pop next time
                                    popTagName = false;
                                }
                                specialStates.attributeHookups = [];
                                break;
                            case "'":
                            case '"':
                                // If we are in an html tag, finding matching quotes.
                                if (htmlTag) {
                                    // We have a quote and it matches.
                                    if (quote && quote === token) {
                                        // We are exiting the quote.
                                        quote = null;
                                        // Otherwise we are creating a quote.
                                        // TODO: does this handle `\`?
                                        var attr = getAttrName();
                                        if (Scanner.attributes[attr]) {
                                            specialStates.attributeHookups.push(attr);
                                        } else {
                                            can.each(Scanner.regExpAttributes, function(attrMatcher) {
                                                if (attrMatcher.match.test(attr)) {
                                                    specialStates.attributeHookups.push(attr);
                                                }
                                            });
                                        }

                                        if (specialAttribute) {

                                            content += token;
                                            put(content);
                                            buff.push(finishTxt, "}));\n")
                                            content = ""
                                            specialAttribute = false;

                                            break;
                                        }


                                    } else if (quote === null) {
                                        quote = token;
                                        beforeQuote = lastToken;
                                        attrName = getAttrName()
                                        // TODO: check if there's magic!!!!
                                        if ((tagName == "img" && attrName == "src") || attrName === "style") {
                                            // put content that was before the attr name, but don't include the src=
                                            put(content.replace(attrReg, ""));
                                            content = "";

                                            specialAttribute = true;

                                            buff.push(insert_cmd, "can.view.txt(2,'" + getTag(tagName, tokens, i) + "'," + status() + ",this,function(){", startTxt);
                                            put(attrName + "=" + token);
                                            break;
                                        }

                                    }
                                }
                            default:
                                // Track the current tag
                                if (lastToken === '<') {
                                    tagName = token.split(/\s/)[0];
                                    var isClosingTag = false;

                                    if (tagName.indexOf("/") === 0) {
                                        isClosingTag = true;
                                        var cleanedTagName = tagName.substr(1);
                                    }

                                    if (isClosingTag) { // </tag>

                                        // when we enter a new tag, pop the tag name stack
                                        if (top(tagNames) === cleanedTagName) {
                                            // set tagName to the last tagName
                                            // if there are no more tagNames, we'll rely on getTag.
                                            tagName = cleanedTagName;
                                            popTagName = true;
                                        }

                                        // if we are in a closing tag of a custom tag
                                        if (top(specialStates.tagHookups) == cleanedTagName) {

                                            // remove the last < from the content
                                            put(content.substr(0, content.length - 1));

                                            // finish the "section"
                                            buff.push(finishTxt + "}}) );");

                                            // the < belongs to the outside
                                            content = "><"
                                            specialStates.tagHookups.pop()
                                        }

                                    } else {
                                        if (tagName.lastIndexOf("/") === tagName.length - 1) {
                                            tagName = tagName.substr(0, tagName.length - 1);


                                        }

                                        if (Scanner.tags[tagName]) {
                                            // if the content tag is inside something it doesn't belong ...
                                            if (tagName === "content" && elements.tagMap[top(tagNames)]) {
                                                // convert it to an element that will work
                                                token = token.replace("content", elements.tagMap[top(tagNames)])
                                            }
                                            // we will hookup at the ending tag>
                                            specialStates.tagHookups.push(tagName);
                                        }


                                        tagNames.push(tagName);

                                    }

                                }
                                content += token;
                                break;
                        }
                    } else {
                        // We have a start tag.
                        switch (token) {
                            case tmap.right:
                            case tmap.returnRight:
                                switch (startTag) {
                                    case tmap.left:
                                        // Get the number of `{ minus }`
                                        bracketCount = bracketNum(content);

                                        // We are ending a block.
                                        if (bracketCount == 1) {

                                            // We are starting on.
                                            buff.push(insert_cmd, "can.view.txt(0,'" + getTag(tagName, tokens, i) + "'," + status() + ",this,function(){", startTxt, content);

                                            endStack.push({
                                                    before: "",
                                                    after: finishTxt + "}));\n"
                                                });
                                        } else {

                                            // How are we ending this statement?
                                            last = // If the stack has value and we are ending a block...
                                            endStack.length && bracketCount == -1 ? // Use the last item in the block stack.
                                            endStack.pop() : // Or use the default ending.
                                            {
                                                after: ";"
                                            };

                                            // If we are ending a returning block, 
                                            // add the finish text which returns the result of the
                                            // block.
                                            if (last.before) {
                                                buff.push(last.before);
                                            }
                                            // Add the remaining content.
                                            buff.push(content, ";", last.after);
                                        }
                                        break;
                                    case tmap.escapeLeft:
                                    case tmap.returnLeft:
                                        // We have an extra `{` -> `block`.
                                        // Get the number of `{ minus }`.
                                        bracketCount = bracketNum(content);
                                        // If we have more `{`, it means there is a block.
                                        if (bracketCount) {
                                            // When we return to the same # of `{` vs `}` end with a `doubleParent`.
                                            endStack.push({
                                                    before: finishTxt,
                                                    after: "}));\n"
                                                });
                                        }

                                        var escaped = startTag === tmap.escapeLeft ? 1 : 0,
                                            commands = {
                                                insert: insert_cmd,
                                                tagName: getTag(tagName, tokens, i),
                                                status: status(),
                                                specialAttribute: specialAttribute
                                            };

                                        for (var ii = 0; ii < this.helpers.length; ii++) {
                                            // Match the helper based on helper
                                            // regex name value
                                            var helper = this.helpers[ii];
                                            if (helper.name.test(content)) {
                                                content = helper.fn(content, commands);

                                                // dont escape partials
                                                if (helper.name.source == /^>[\s]*\w*/.source) {
                                                    escaped = 0;
                                                }
                                                break;
                                            }
                                        }

                                        // Handle special cases
                                        if (typeof content == 'object') {
                                            if (content.raw) {
                                                buff.push(content.raw);
                                            }
                                        } else if (specialAttribute) {
                                            buff.push(insert_cmd, content, ');');
                                        } else {
                                            // If we have `<%== a(function(){ %>` then we want
                                            // `can.EJS.text(0,this, function(){ return a(function(){ var _v1ew = [];`.
                                            buff.push(insert_cmd, "can.view.txt(\n" + escaped + ",\n'" + tagName + "',\n" + status() + ",\nthis,\nfunction(){ " + (this.text.escape || '') + "return ", content,
                                                // If we have a block.
                                                bracketCount ?
                                                // Start with startTxt `"var _v1ew = [];"`.
                                                startTxt :
                                                // If not, add `doubleParent` to close push and text.
                                                "}));\n");
                                        }

                                        if (rescan && rescan.after && rescan.after.length) {
                                            put(rescan.after.length);
                                            rescan = null;
                                        }
                                        break;
                                }
                                startTag = null;
                                content = '';
                                break;
                            case tmap.templateLeft:
                                content += tmap.left;
                                break;
                            default:
                                content += token;
                                break;
                        }
                    }
                    lastToken = token;
                }

                // Put it together...
                if (content.length) {
                    // Should be `content.dump` in Ruby.
                    put(content);
                }
                buff.push(";");
                var template = buff.join(''),
                    out = {
                        out: (this.text.outStart || "") + template + " " + finishTxt + (this.text.outEnd || "")
                    };
                // Use `eval` instead of creating a function, because it is easier to debug.
                myEval.call(out, 'this.fn = (function(' + this.text.argNames + '){' + out.out + '});\r\n//@ sourceURL=' + name + ".js");

                return out;
            }
        };

        can.view.Scanner.tag("content", function(el, options) {
            return options.scope;
        })

        return Scanner;
    })(__m18, __m20);

    // ## can/view/node_lists.js
    var __m23 = (function(can) {

        // text node expando test
        var canExpando = true;
        try {
            document.createTextNode('')._ = 0;
        } catch (ex) {
            canExpando = false;
        }

        // a mapping of element ids to nodeList ids
        var nodeMap = {},
            // a mapping of ids to text nodes
            textNodeMap = {},
            // a mapping of nodeList ids to nodeList
            nodeListMap = {},
            expando = "ejs_" + Math.random(),
            _id = 0,
            id = function(node) {
                if (canExpando || node.nodeType !== 3) {
                    if (node[expando]) {
                        return node[expando];
                    } else {
                        return node[expando] = (node.nodeName ? "element_" : "obj_") + (++_id);
                    }
                } else {
                    for (var textNodeID in textNodeMap) {
                        if (textNodeMap[textNodeID] === node) {
                            return textNodeID;
                        }
                    }

                    textNodeMap["text_" + (++_id)] = node;
                    return "text_" + _id;
                }
            },
            // removes a nodeListId from a node's nodeListIds
            removeNodeListId = function(node, nodeListId) {
                var nodeListIds = nodeMap[id(node)];
                if (nodeListIds) {
                    var index = can.inArray(nodeListId, nodeListIds);

                    if (index >= 0) {
                        nodeListIds.splice(index, 1);
                    }
                    if (!nodeListIds.length) {
                        delete nodeMap[id(node)];
                    }
                }
            },
            addNodeListId = function(node, nodeListId) {
                var nodeListIds = nodeMap[id(node)];
                if (!nodeListIds) {
                    nodeListIds = nodeMap[id(node)] = [];
                }
                nodeListIds.push(nodeListId);
            };

        var nodeLists = {
            id: id,
            // replaces the contents of one node list with the nodes in another list
            replace: function(oldNodeList, newNodes) {
                // for each node in the node list
                oldNodeList = can.makeArray(oldNodeList);

                // try every set
                //can.each( oldNodeList, function(node){
                var node = oldNodeList[0]
                // for each nodeList the node is in
                can.each(can.makeArray(nodeMap[id(node)]), function(nodeListId) {

                    // if startNode to endNode is 
                    // within list, replace that list
                    // I think the problem is not the WHOLE part is being 
                    // matched
                    var nodeList = nodeListMap[nodeListId],
                        startIndex = can.inArray(node, nodeList),
                        endIndex = can.inArray(oldNodeList[oldNodeList.length - 1], nodeList);


                    // remove this nodeListId from each node
                    if (startIndex >= 0 && endIndex >= 0) {
                        for (var i = startIndex; i <= endIndex; i++) {
                            var n = nodeList[i];
                            removeNodeListId(n, nodeListId);
                        }
                        // swap in new nodes into the nodeLIst
                        nodeList.splice.apply(nodeList, [startIndex, endIndex - startIndex + 1].concat(newNodes));

                        // tell these new nodes they belong to the nodeList
                        can.each(newNodes, function(node) {
                            addNodeListId(node, nodeListId);
                        });
                    } else {
                        nodeLists.unregister(nodeList);
                    }
                });
                //});
            },
            // registers a list of nodes
            register: function(nodeList) {
                var nLId = id(nodeList);
                nodeListMap[nLId] = nodeList;

                can.each(nodeList, function(node) {
                    addNodeListId(node, nLId);
                });

            },
            // removes mappings
            unregister: function(nodeList) {
                var nLId = id(nodeList);
                can.each(nodeList, function(node) {
                    removeNodeListId(node, nLId);
                });
                delete nodeListMap[nLId];
            },
            nodeMap: nodeMap,
            nodeListMap: nodeListMap
        }
        var ids = function(nodeList) {
            return nodeList.map(function(n) {
                return id(n) + ":" + (n.innerHTML || n.nodeValue)
            })
        }
        return nodeLists;

    })(__m2);

    // ## can/view/live.js
    var __m22 = (function(can, elements, view, nodeLists) {
        // ## live.js
        // The live module provides live binding for computes
        // and can.List.
        // Currently, it's API is designed for `can/view/render`, but
        // it could easily be used for other purposes.

        // ### Helper methods
        // #### setup
        // `setup(HTMLElement, bind(data), unbind(data)) -> data`
        // Calls bind right away, but will call unbind
        // if the element is "destroyed" (removed from the DOM).
        var setup = function(el, bind, unbind) {
            var teardown = function() {
                unbind(data)
                can.unbind.call(el, 'removed', teardown);
            },
                data = {
                    teardownCheck: function(parent) {
                        if (!parent) {
                            teardown();
                        }
                    }
                }

            can.bind.call(el, 'removed', teardown);
            bind(data)
            return data;
        },
            // #### listen
            // Calls setup, but presets bind and unbind to 
            // operate on a compute
            listen = function(el, compute, change) {
                return setup(el, function() {
                    compute.bind("change", change);
                }, function(data) {
                    compute.unbind("change", change);
                    if (data.nodeList) {
                        nodeLists.unregister(data.nodeList);
                    }
                });
            },
            // #### getAttributeParts
            // Breaks up a string like foo='bar' into ["foo","'bar'""]
            getAttributeParts = function(newVal) {
                return (newVal || "").replace(/['"]/g, '').split('=')
            }
            // #### insertElementsAfter
            // Appends elements after the last item in oldElements.
        insertElementsAfter = function(oldElements, newFrag) {
            var last = oldElements[oldElements.length - 1];

            // Insert it in the `document` or `documentFragment`
            if (last.nextSibling) {
                can.insertBefore(last.parentNode, newFrag, last.nextSibling)
            } else {
                can.appendChild(last.parentNode, newFrag);
            }
        };

        var live = {
            nodeLists: nodeLists,
            list: function(el, list, func, context, parentNode) {
                // A mapping of the index to an array
                // of elements that represent the item.
                // Each array is registered so child or parent
                // live structures can update the elements
                var nodesMap = [],

                    add = function(ev, items, index) {

                        // Collect new html and mappings
                        var frag = document.createDocumentFragment(),
                            newMappings = [];
                        can.each(items, function(item) {
                            var itemHTML = func.call(context, item),
                                itemFrag = can.view.frag(itemHTML, parentNode);

                            newMappings.push(can.makeArray(itemFrag.childNodes));
                            frag.appendChild(itemFrag);
                        })

                        // Inserting at the end of the list
                        if (!nodesMap[index]) {
                            insertElementsAfter(
                                index == 0 ? [text] :
                                nodesMap[index - 1], frag)
                        } else {
                            var el = nodesMap[index][0];
                            can.insertBefore(el.parentNode, frag, el);
                        }
                        // register each item
                        can.each(newMappings, function(nodeList) {
                            nodeLists.register(nodeList)
                        });
                        [].splice.apply(nodesMap, [index, 0].concat(newMappings));
                    },
                    remove = function(ev, items, index) {
                        var removedMappings = nodesMap.splice(index, items.length),
                            itemsToRemove = [];

                        can.each(removedMappings, function(nodeList) {
                            // add items that we will remove all at once
                            [].push.apply(itemsToRemove, nodeList)
                            // Update any parent lists to remove these items
                            nodeLists.replace(nodeList, []);
                            // unregister the list
                            nodeLists.unregister(nodeList);

                        });
                        can.remove(can.$(itemsToRemove));
                    },
                    parentNode = elements.getParentNode(el, parentNode),
                    text = document.createTextNode("");

                // Setup binding and teardown to add and remove events
                setup(parentNode, function() {
                    list.bind("add", add).bind("remove", remove)
                }, function() {
                    list.unbind("add", add).unbind("remove", remove);
                    can.each(nodesMap, function(nodeList) {
                        nodeLists.unregister(nodeList);
                    })
                })

                insertElementsAfter([el], text);
                can.remove(can.$(el));
                add({}, list, 0);

            },
            html: function(el, compute, parentNode) {
                var parentNode = elements.getParentNode(el, parentNode),

                    data = listen(parentNode, compute, function(ev, newVal, oldVal) {
                        var attached = nodes[0].parentNode;
                        // update the nodes in the DOM with the new rendered value
                        if (attached) {
                            makeAndPut(newVal);
                        }
                        data.teardownCheck(nodes[0].parentNode);
                    });

                var nodes,
                    makeAndPut = function(val) {
                        // create the fragment, but don't hook it up
                        // we need to insert it into the document first
                        var frag = can.view.frag(val, parentNode),
                            // keep a reference to each node
                            newNodes = can.makeArray(frag.childNodes);
                        // Insert it in the `document` or `documentFragment`
                        insertElementsAfter(nodes || [el], frag)
                        // nodes hasn't been set yet
                        if (!nodes) {
                            can.remove(can.$(el));
                            nodes = newNodes;
                            // set the teardown nodeList
                            data.nodeList = nodes;
                            nodeLists.register(nodes);
                        } else {
                            // Update node Array's to point to new nodes
                            // and then remove the old nodes.
                            // It has to be in this order for Mootools
                            // and IE because somehow, after an element
                            // is removed from the DOM, it loses its
                            // expando values.
                            var nodesToRemove = can.makeArray(nodes);
                            nodeLists.replace(nodes, newNodes);
                            can.remove(can.$(nodesToRemove));
                        }
                    };
                makeAndPut(compute(), [el]);

            },
            text: function(el, compute, parentNode) {
                var parent = elements.getParentNode(el, parentNode);

                // setup listening right away so we don't have to re-calculate value
                var data = listen(el.parentNode !== parent ? el.parentNode : parent, compute, function(ev, newVal, oldVal) {
                    // Sometimes this is 'unknown' in IE and will throw an exception if it is
                    if (typeof node.nodeValue != 'unknown') {
                        node.nodeValue = "" + newVal;
                    }
                    data.teardownCheck(node.parentNode);
                });

                var node = document.createTextNode(compute());

                if (el.parentNode !== parent) {
                    parent = el.parentNode;
                    parent.insertBefore(node, el);
                    parent.removeChild(el);
                } else {
                    parent.insertBefore(node, el);
                    parent.removeChild(el);
                }
            },
            attributes: function(el, compute, currentValue) {
                var setAttrs = function(newVal) {
                    var parts = getAttributeParts(newVal),
                        newAttrName = parts.shift();

                    // Remove if we have a change and used to have an `attrName`.
                    if ((newAttrName != attrName) && attrName) {
                        elements.removeAttr(el, attrName);
                    }
                    // Set if we have a new `attrName`.
                    if (newAttrName) {
                        elements.setAttr(el, newAttrName, parts.join('='));
                        attrName = newAttrName;
                    }
                }

                listen(el, compute, function(ev, newVal) {
                    setAttrs(newVal)
                })
                // current value has been set
                if (arguments.length >= 3) {
                    var attrName = getAttributeParts(currentValue)[0]
                } else {
                    setAttrs(compute())
                }
            },
            attributePlaceholder: '__!!__',
            attributeReplace: /__!!__/g,
            attribute: function(el, attributeName, compute) {
                listen(el, compute, function(ev, newVal) {
                    elements.setAttr(el, attributeName, hook.render());
                })

                var wrapped = can.$(el),
                    hooks;

                // Get the list of hookups or create one for this element.
                // Hooks is a map of attribute names to hookup `data`s.
                // Each hookup data has:
                // `render` - A `function` to render the value of the attribute.
                // `funcs` - A list of hookup `function`s on that attribute.
                // `batchNum` - The last event `batchNum`, used for performance.
                hooks = can.data(wrapped, 'hooks');
                if (!hooks) {
                    can.data(wrapped, 'hooks', hooks = {});
                }

                // Get the attribute value.
                var attr = elements.getAttr(el, attributeName),
                    // Split the attribute value by the template.
                    // Only split out the first __!!__ so if we have multiple hookups in the same attribute, 
                    // they will be put in the right spot on first render
                    parts = attr.split(live.attributePlaceholder),
                    goodParts = [],
                    hook;
                goodParts.push(parts.shift(),
                    parts.join(live.attributePlaceholder));

                // If we already had a hookup for this attribute...
                if (hooks[attributeName]) {
                    // Just add to that attribute's list of `function`s.
                    hooks[attributeName].computes.push(compute);
                } else {
                    // Create the hookup data.
                    hooks[attributeName] = {
                        render: function() {
                            var i = 0,
                                // attr doesn't have a value in IE
                                newAttr = attr ? attr.replace(live.attributeReplace, function() {
                                    return elements.contentText(hook.computes[i++]());
                                }) : elements.contentText(hook.computes[i++]());
                            return newAttr;
                        },
                        computes: [compute],
                        batchNum: undefined
                    };
                }

                // Save the hook for slightly faster performance.
                hook = hooks[attributeName];

                // Insert the value in parts.
                goodParts.splice(1, 0, compute());

                // Set the attribute.
                elements.setAttr(el, attributeName, goodParts.join(""));

            },
            specialAttribute: function(el, attributeName, compute) {

                listen(el, compute, function(ev, newVal) {
                    elements.setAttr(el, attributeName, getValue(newVal));
                });

                elements.setAttr(el, attributeName, getValue(compute()));
            }
        }

        var getValue = function(val) {
            val = val.replace(elements.attrReg, "");
            // check if starts and ends with " or '
            return /^["'].*["']$/.test(val) ? val.substr(1, val.length - 2) : val
        }

        return live;

    })(__m2, __m20, __m18, __m23);

    // ## can/view/render.js
    var __m21 = (function(can, elements, live) {

        var pendingHookups = [],
            tagChildren = function(tagName) {
                var newTag = elements.tagMap[tagName] || "span";
                if (newTag === "span") {
                    //innerHTML in IE doesn't honor leading whitespace after empty elements
                    return "@@!!@@";
                }
                return "<" + newTag + ">" + tagChildren(newTag) + "</" + newTag + ">";
            },
            contentText = function(input, tag) {

                // If it's a string, return.
                if (typeof input == 'string') {
                    return input;
                }
                // If has no value, return an empty string.
                if (!input && input !== 0) {
                    return '';
                }

                // If it's an object, and it has a hookup method.
                var hook = (input.hookup &&

                    // Make a function call the hookup method.

                    function(el, id) {
                        input.hookup.call(input, el, id);
                    }) ||

                // Or if it's a `function`, just use the input.
                (typeof input == 'function' && input);

                // Finally, if there is a `function` to hookup on some dom,
                // add it to pending hookups.
                if (hook) {
                    if (tag) {
                        return "<" + tag + " " + can.view.hook(hook) + "></" + tag + ">"
                    } else {
                        pendingHookups.push(hook);
                    }

                    return '';
                }

                // Finally, if all else is `false`, `toString()` it.
                return "" + input;
            },
            // Returns escaped/sanatized content for anything other than a live-binding
            contentEscape = function(txt, tag) {
                return (typeof txt == 'string' || typeof txt == 'number') ?
                    can.esc(txt) :
                    contentText(txt, tag);
            };

        var current;

        can.extend(can.view, {
                live: live,
                setupLists: function() {

                    var old = can.view.lists,
                        data;

                    can.view.lists = function(list, renderer) {
                        data = {
                            list: list,
                            renderer: renderer
                        }
                    }
                    return function() {
                        can.view.lists = old;
                        return data;
                    }
                },
                pending: function(data) {
                    // TODO, make this only run for the right tagName
                    var hooks = can.view.getHooks();
                    return can.view.hook(function(el) {
                        can.each(hooks, function(fn) {
                            fn(el);
                        });
                        can.view.Scanner.hookupAttributes(data, el);
                    });
                },
                getHooks: function() {
                    var hooks = pendingHookups.slice(0);
                    lastHookups = hooks;
                    pendingHookups = [];
                    return hooks;
                },
                onlytxt: function(self, func) {
                    return contentEscape(func.call(self))
                },

                txt: function(escape, tagName, status, self, func) {
                    var listTeardown = can.view.setupLists(),
                        emptyHandler = function() {},
                        unbind = function() {
                            compute.unbind("change", emptyHandler)
                        };

                    var compute = can.compute(func, self, false);
                    // bind to get and temporarily cache the value
                    compute.bind("change", emptyHandler);
                    // call the "wrapping" function and get the binding information
                    var tag = (elements.tagMap[tagName] || "span"),
                        listData = listTeardown(),
                        value = compute();

                    if (listData) {
                        return "<" + tag + can.view.hook(function(el, parentNode) {
                            live.list(el, listData.list, listData.renderer, self, parentNode);
                        }) + "></" + tag + ">";
                    }

                    // If we had no observes just return the value returned by func.
                    if (!compute.hasDependencies || typeof value === "function") {
                        unbind();
                        return ((escape || status !== 0) && escape !== 2 ? contentEscape : contentText)(value, status === 0 && tag);
                    }

                    // the property (instead of innerHTML elements) to adjust. For
                    // example options should use textContent
                    var contentProp = elements.tagToContentPropMap[tagName];


                    // The magic tag is outside or between tags.
                    if (status === 0 && !contentProp) {
                        // Return an element tag with a hookup in place of the content
                        return "<" + tag + can.view.hook(
                            escape ?
                            // If we are escaping, replace the parentNode with 
                            // a text node who's value is `func`'s return value.

                            function(el, parentNode) {
                                live.text(el, compute, parentNode);
                                unbind();
                            } :
                            // If we are not escaping, replace the parentNode with a
                            // documentFragment created as with `func`'s return value.

                            function(el, parentNode) {
                                live.html(el, compute, parentNode);
                                unbind();
                                //children have to be properly nested HTML for buildFragment to work properly
                            }) + ">" + tagChildren(tag) + "</" + tag + ">";
                        // In a tag, but not in an attribute
                    } else if (status === 1) {
                        // remember the old attr name
                        pendingHookups.push(function(el) {
                            live.attributes(el, compute, compute());
                            unbind();
                        });
                        return compute();
                    } else if (escape === 2) { // In a special attribute like src or style

                        var attributeName = status;
                        pendingHookups.push(function(el) {
                            live.specialAttribute(el, attributeName, compute);
                            unbind();
                        })
                        return compute();
                    } else { // In an attribute...
                        var attributeName = status === 0 ? contentProp : status;
                        // if the magic tag is inside the element, like `<option><% TAG %></option>`,
                        // we add this hookup to the last element (ex: `option`'s) hookups.
                        // Otherwise, the magic tag is in an attribute, just add to the current element's
                        // hookups.
                        (status === 0 ? lastHookups : pendingHookups).push(function(el) {
                            live.attribute(el, attributeName, compute);
                            unbind();
                        });
                        return live.attributePlaceholder;
                    }
                }
            });

        return can;
    })(__m18, __m20, __m22, __m9);

    // ## can/view/mustache/mustache.js
    var __m16 = (function(can) {

        // # mustache.js
        // `can.Mustache`: The Mustache templating engine.
        // See the [Transformation](#section-29) section within *Scanning Helpers* for a detailed explanation 
        // of the runtime render code design. The majority of the Mustache engine implementation 
        // occurs within the *Transformation* scanning helper.

        // ## Initialization
        // Define the view extension.
        can.view.ext = ".mustache";

        // ### Setup internal helper variables and functions.
        // An alias for the context variable used for tracking a stack of contexts.
        // This is also used for passing to helper functions to maintain proper context.
        var SCOPE = 'scope',
            // An alias for the variable used for the hash object that can be passed
            // to helpers via `options.hash`.
            HASH = '___h4sh',
            // An alias for the most used context stacking call.
            CONTEXT_OBJ = '{scope:' + SCOPE + ',options:options}',
            // argument names used to start the function (used by scanner and steal)
            ARG_NAMES = SCOPE + ",options",

            // matches arguments inside a {{ }}
            argumentsRegExp = /((([^\s]+?=)?('.*?'|".*?"))|.*?)\s/g,

            // matches a literal number, string, null or regexp
            literalNumberStringBooleanRegExp = /^(('.*?'|".*?"|[0-9]+\.?[0-9]*|true|false|null|undefined)|((.+?)=(('.*?'|".*?"|[0-9]+\.?[0-9]*|true|false)|(.+))))$/,

            // returns an object literal that we can use to look up a value in the current scope
            makeLookupLiteral = function(type) {
                return '{get:"' + type.replace(/"/g, '\\"') + '"}'
            },
            // returns if the object is a lookup
            isLookup = function(obj) {
                return obj && typeof obj.get == "string"
            },


            isObserveLike = function(obj) {
                return obj instanceof can.Map || (obj && !! obj._get);
            },


            isArrayLike = function(obj) {
                return obj && obj.splice && typeof obj.length == 'number';
            },
            // used to make sure .fn and .inverse are always called with a Scope like object
            makeConvertToScopes = function(orignal, scope, options) {
                return function(updatedScope, updatedOptions) {
                    if (updatedScope != null && !(updatedScope instanceof can.view.Scope)) {
                        updatedScope = scope.add(updatedScope)
                    }
                    if (updatedOptions != null && !(updatedOptions instanceof OptionsScope)) {
                        updatedOptions = options.add(updatedOptions)
                    }
                    return orignal(updatedScope, updatedOptions || options)
                }
            }


            // ## Mustache

        Mustache = function(options, helpers) {
            // Support calling Mustache without the constructor.
            // This returns a function that renders the template.
            if (this.constructor != Mustache) {
                var mustache = new Mustache(options);
                return function(data, options) {
                    return mustache.render(data, options);
                };
            }

            // If we get a `function` directly, it probably is coming from
            // a `steal`-packaged view.
            if (typeof options == "function") {
                this.template = {
                    fn: options
                };
                return;
            }

            // Set options on self.
            can.extend(this, options);
            this.template = this.scanner.scan(this.text, this.name);
        };


        // Put Mustache on the `can` object.
        can.Mustache = window.Mustache = Mustache;


        Mustache.prototype.

        render = function(data, options) {
            if (!(data instanceof can.view.Scope)) {
                data = new can.view.Scope(data || {});
            }
            if (!(options instanceof OptionsScope)) {
                options = new OptionsScope(options || {})
            }
            options = options || {};

            return this.template.fn.call(data, data, options);
        };

        can.extend(Mustache.prototype, {
                // Share a singleton scanner for parsing templates.
                scanner: new can.view.Scanner({
                        // A hash of strings for the scanner to inject at certain points.
                        text: {
                            // This is the logic to inject at the beginning of a rendered template. 
                            // This includes initializing the `context` stack.
                            start: "", //"var "+SCOPE+"= this instanceof can.view.Scope? this : new can.view.Scope(this);\n",
                            scope: SCOPE,
                            options: ",options: options",
                            argNames: ARG_NAMES
                        },

                        // An ordered token registry for the scanner.
                        // This needs to be ordered by priority to prevent token parsing errors.
                        // Each token follows the following structure:
                        //		[
                        //			// Which key in the token map to match.
                        //			"tokenMapName",
                        //			// A simple token to match, like "{{".
                        //			"token",
                        //			// Optional. A complex (regexp) token to match that 
                        //			// overrides the simple token.
                        //			"[\\s\\t]*{{",
                        //			// Optional. A function that executes advanced 
                        //			// manipulation of the matched content. This is 
                        //			// rarely used.
                        //			function(content){   
                        //				return content;
                        //			}
                        //		]
                        tokens: [

                            // Return unescaped
                            ["returnLeft", "{{{", "{{[{&]"],
                            // Full line comments
                            ["commentFull", "{{!}}", "^[\\s\\t]*{{!.+?}}\\n"],

                            // Inline comments
                            ["commentLeft", "{{!", "(\\n[\\s\\t]*{{!|{{!)"],

                            // Full line escapes
                            // This is used for detecting lines with only whitespace and an escaped tag
                            ["escapeFull", "{{}}", "(^[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}$)",
                                function(content) {
                                    return {
                                        before: /^\n.+?\n$/.test(content) ? '\n' : '',
                                        content: content.match(/\{\{(.+?)\}\}/)[1] || ''
                                    };
                                }
                            ],
                            // Return escaped
                            ["escapeLeft", "{{"],
                            // Close return unescaped
                            ["returnRight", "}}}"],
                            // Close tag
                            ["right", "}}"]
                        ],

                        // ## Scanning Helpers
                        // This is an array of helpers that transform content that is within escaped tags like `{{token}}`. These helpers are solely for the scanning phase; they are unrelated to Mustache/Handlebars helpers which execute at render time. Each helper has a definition like the following:
                        //		{
                        //			// The content pattern to match in order to execute.
                        //			// Only the first matching helper is executed.
                        //			name: /pattern to match/,
                        //			// The function to transform the content with.
                        //			// @param {String} content   The content to transform.
                        //			// @param {Object} cmd       Scanner helper data.
                        //			//                           {
                        //			//                             insert: "insert command",
                        //			//                             tagName: "div",
                        //			//                             status: 0
                        //			//                           }
                        //			fn: function(content, cmd) {
                        //				return 'for text injection' || 
                        //					{ raw: 'to bypass text injection' };
                        //			}
                        //		}
                        helpers: [
                            // ### Partials
                            // Partials begin with a greater than sign, like {{> box}}.
                            // Partials are rendered at runtime (as opposed to compile time), 
                            // so recursive partials are possible. Just avoid infinite loops.
                            // For example, this template and partial:
                            // 		base.mustache:
                            // 			<h2>Names</h2>
                            // 			{{#names}}
                            // 				{{> user}}
                            // 			{{/names}}
                            // 		user.mustache:
                            // 			<strong>{{name}}</strong>
                            {
                                name: /^>[\s]*\w*/,
                                fn: function(content, cmd) {
                                    // Get the template name and call back into the render method,
                                    // passing the name and the current context.
                                    var templateName = can.trim(content.replace(/^>\s?/, '')).replace(/["|']/g, "");
                                    return "can.Mustache.renderPartial('" + templateName + "'," + ARG_NAMES + ")";
                                }
                            },

                            // ### Data Hookup
                            // This will attach the data property of `this` to the element
                            // its found on using the first argument as the data attribute
                            // key.
                            // For example:
                            //		<li id="nameli" {{ data 'name' }}></li>
                            // then later you can access it like:
                            //		can.$('#nameli').data('name');

                            {
                                name: /^\s*data\s/,
                                fn: function(content, cmd) {
                                    var attr = content.match(/["|'](.*)["|']/)[1];
                                    // return a function which calls `can.data` on the element
                                    // with the attribute name with the current context.
                                    return "can.proxy(function(__){" +
                                    // "var context = this[this.length-1];" +
                                    // "context = context." + STACKED + " ? context[context.length-2] : context; console.warn(this, context);" +
                                    "can.data(can.$(__),'" + attr + "', this.attr('.')); }, " + SCOPE + ")";
                                }
                            }, {
                                name: /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
                                fn: function(content) {
                                    var quickFunc = /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
                                        parts = content.match(quickFunc);

                                    //find 
                                    return "can.proxy(function(__){var " + parts[1] + "=can.$(__);with(" + SCOPE + ".attr('.')){" + parts[2] + "}}, this);";
                                }
                            },
                            // ### Transformation (default)
                            // This transforms all content to its interpolated equivalent,
                            // including calls to the corresponding helpers as applicable. 
                            // This outputs the render code for almost all cases.
                            // #### Definitions
                            // * `context` - This is the object that the current rendering context operates within. 
                            //		Each nested template adds a new `context` to the context stack.
                            // * `stack` - Mustache supports nested sections, 
                            //		each of which add their own context to a stack of contexts.
                            //		Whenever a token gets interpolated, it will check for a match against the 
                            //		last context in the stack, then iterate through the rest of the stack checking for matches.
                            //		The first match is the one that gets returned.
                            // * `Mustache.txt` - This serializes a collection of logic, optionally contained within a section.
                            //		If this is a simple interpolation, only the interpolation lookup will be passed.
                            //		If this is a section, then an `options` object populated by the truthy (`options.fn`) and 
                            //		falsey (`options.inverse`) encapsulated functions will also be passed. This section handling 
                            //		exists to support the runtime context nesting that Mustache supports.
                            // * `Mustache.get` - This resolves an interpolation reference given a stack of contexts.
                            // * `options` - An object containing methods for executing the inner contents of sections or helpers.  
                            //		`options.fn` - Contains the inner template logic for a truthy section.  
                            //		`options.inverse` - Contains the inner template logic for a falsey section.  
                            //		`options.hash` - Contains the merged hash object argument for custom helpers.
                            // #### Design
                            // This covers the design of the render code that the transformation helper generates.
                            // ##### Pseudocode
                            // A detailed explanation is provided in the following sections, but here is some brief pseudocode
                            // that gives a high level overview of what the generated render code does (with a template similar to  
                            // `"{{#a}}{{b.c.d.e.name}}{{/a}}" == "Phil"`).
                            // *Initialize the render code.*
                            // 		view = []
                            // 		context = []
                            // 		stack = fn { context.concat([this]) }
                            // *Render the root section.*
                            // 		view.push( "string" )
                            // 		view.push( can.view.txt(
                            // *Render the nested section with `can.Mustache.txt`.*
                            // 			txt( 
                            // *Add the current context to the stack.*
                            // 				stack(), 
                            // *Flag this for truthy section mode.*
                            // 				"#",
                            // *Interpolate and check the `a` variable for truthyness using the stack with `can.Mustache.get`.*
                            // 				get( "a", stack() ),
                            // *Include the nested section's inner logic.
                            // The stack argument is usually the parent section's copy of the stack, 
                            // but it can be an override context that was passed by a custom helper.
                            // Sections can nest `0..n` times -- **NESTCEPTION**.*
                            // 				{ fn: fn(stack) {
                            // *Render the nested section (everything between the `{{#a}}` and `{{/a}}` tokens).*
                            // 					view = []
                            // 					view.push( "string" )
                            // 					view.push(
                            // *Add the current context to the stack.*
                            // 						stack(),
                            // *Flag this as interpolation-only mode.*
                            // 						null,
                            // *Interpolate the `b.c.d.e.name` variable using the stack.*
                            // 						get( "b.c.d.e.name", stack() ),
                            // 					)
                            // 					view.push( "string" )
                            // *Return the result for the nested section.*
                            // 					return view.join()
                            // 				}}
                            // 			)
                            // 		))
                            // 		view.push( "string" )
                            // *Return the result for the root section, which includes all nested sections.*
                            // 		return view.join()
                            // ##### Initialization
                            // Each rendered template is started with the following initialization code:
                            // 		var ___v1ew = [];
                            // 		var ___c0nt3xt = [];
                            // 		___c0nt3xt.__sc0pe = true;
                            // 		var __sc0pe = function(context, self) {
                            // 			var s;
                            // 			if (arguments.length == 1 && context) {
                            // 				s = !context.__sc0pe ? [context] : context;
                            // 			} else {
                            // 				s = context && context.__sc0pe 
                            //					? context.concat([self]) 
                            //					: __sc0pe(context).concat([self]);
                            // 			}
                            // 			return (s.__sc0pe = true) && s;
                            // 		};
                            // The `___v1ew` is the the array used to serialize the view.
                            // The `___c0nt3xt` is a stacking array of contexts that slices and expands with each nested section.
                            // The `__sc0pe` function is used to more easily update the context stack in certain situations.
                            // Usually, the stack function simply adds a new context (`self`/`this`) to a context stack. 
                            // However, custom helpers will occasionally pass override contexts that need their own context stack.
                            // ##### Sections
                            // Each section, `{{#section}} content {{/section}}`, within a Mustache template generates a section 
                            // context in the resulting render code. The template itself is treated like a root section, with the 
                            // same execution logic as any others. Each section can have `0..n` nested sections within it.
                            // Here's an example of a template without any descendent sections.  
                            // Given the template: `"{{a.b.c.d.e.name}}" == "Phil"`  
                            // Would output the following render code:
                            //		___v1ew.push("\"");
                            //		___v1ew.push(can.view.txt(1, '', 0, this, function() {
                            // 			return can.Mustache.txt(__sc0pe(___c0nt3xt, this), null, 
                            //				can.Mustache.get("a.b.c.d.e.name", 
                            //					__sc0pe(___c0nt3xt, this))
                            //			);
                            //		}));
                            //		___v1ew.push("\" == \"Phil\"");
                            // The simple strings will get appended to the view. Any interpolated references (like `{{a.b.c.d.e.name}}`) 
                            // will be pushed onto the view via `can.view.txt` in order to support live binding.
                            // The function passed to `can.view.txt` will call `can.Mustache.txt`, which serializes the object data by doing 
                            // a context lookup with `can.Mustache.get`.
                            // `can.Mustache.txt`'s first argument is a copy of the context stack with the local context `this` added to it.
                            // This stack will grow larger as sections nest.
                            // The second argument is for the section type. This will be `"#"` for truthy sections, `"^"` for falsey, 
                            // or `null` if it is an interpolation instead of a section.
                            // The third argument is the interpolated value retrieved with `can.Mustache.get`, which will perform the 
                            // context lookup and return the approriate string or object.
                            // Any additional arguments, if they exist, are used for passing arguments to custom helpers.
                            // For nested sections, the last argument is an `options` object that contains the nested section's logic.
                            // Here's an example of a template with a single nested section.  
                            // Given the template: `"{{#a}}{{b.c.d.e.name}}{{/a}}" == "Phil"`  
                            // Would output the following render code:
                            //		___v1ew.push("\"");
                            // 		___v1ew.push(can.view.txt(0, '', 0, this, function() {
                            // 			return can.Mustache.txt(__sc0pe(___c0nt3xt, this), "#", 
                            //				can.Mustache.get("a", __sc0pe(___c0nt3xt, this)), 
                            //					[{
                            // 					_: function() {
                            // 						return ___v1ew.join("");
                            // 					}
                            // 				}, {
                            // 					fn: function(___c0nt3xt) {
                            // 						var ___v1ew = [];
                            // 						___v1ew.push(can.view.txt(1, '', 0, this, 
                            //								function() {
                            //  								return can.Mustache.txt(
                            // 									__sc0pe(___c0nt3xt, this), 
                            // 									null, 
                            // 									can.Mustache.get("b.c.d.e.name", 
                            // 										__sc0pe(___c0nt3xt, this))
                            // 								);
                            // 							}
                            // 						));
                            // 						return ___v1ew.join("");
                            // 					}
                            // 				}]
                            //			)
                            // 		}));
                            //		___v1ew.push("\" == \"Phil\"");
                            // This is specified as a truthy section via the `"#"` argument. The last argument includes an array of helper methods used with `options`.
                            // These act similarly to custom helpers: `options.fn` will be called for truthy sections, `options.inverse` will be called for falsey sections.
                            // The `options._` function only exists as a dummy function to make generating the section nesting easier (a section may have a `fn`, `inverse`,
                            // or both, but there isn't any way to determine that at compilation time).
                            // Within the `fn` function is the section's render context, which in this case will render anything between the `{{#a}}` and `{{/a}}` tokens.
                            // This function has `___c0nt3xt` as an argument because custom helpers can pass their own override contexts. For any case where custom helpers
                            // aren't used, `___c0nt3xt` will be equivalent to the `__sc0pe(___c0nt3xt, this)` stack created by its parent section. The `inverse` function
                            // works similarly, except that it is added when `{{^a}}` and `{{else}}` are used. `var ___v1ew = []` is specified in `fn` and `inverse` to 
                            // ensure that live binding in nested sections works properly.
                            // All of these nested sections will combine to return a compiled string that functions similar to EJS in its uses of `can.view.txt`.
                            // #### Implementation
                            {
                                name: /^.*$/,
                                fn: function(content, cmd) {
                                    var mode = false,
                                        result = [];

                                    // Trim the content so we don't have any trailing whitespace.
                                    content = can.trim(content);

                                    // Determine what the active mode is.
                                    // * `#` - Truthy section
                                    // * `^` - Falsey section
                                    // * `/` - Close the prior section
                                    // * `else` - Inverted section (only exists within a truthy/falsey section)
                                    if (content.length && (mode = content.match(/^([#^/]|else$)/))) {
                                        mode = mode[0];
                                        switch (mode) {

                                            // Open a new section.
                                            case '#':

                                            case '^':
                                                if (cmd.specialAttribute) {
                                                    result.push(cmd.insert + 'can.view.onlytxt(this,function(){ return ');
                                                } else {
                                                    result.push(cmd.insert + 'can.view.txt(0,\'' + cmd.tagName + '\',' + cmd.status + ',this,function(){ return ');
                                                }
                                                break;
                                                // Close the prior section.

                                            case '/':
                                                return {
                                                    raw: 'return ___v1ew.join("");}}])}));'
                                                };
                                                break;
                                        }

                                        // Trim the mode off of the content.
                                        content = content.substring(1);
                                    }

                                    // `else` helpers are special and should be skipped since they don't 
                                    // have any logic aside from kicking off an `inverse` function.
                                    if (mode != 'else') {
                                        var args = [],
                                            i = 0,
                                            hashing = false,
                                            arg, split, m;

                                        // Start the content render block.
                                        result.push('can.Mustache.txt(\n' + CONTEXT_OBJ + ',\n' + (mode ? '"' + mode + '"' : 'null') + ',');

                                        // Parse the helper arguments.
                                        // This needs uses this method instead of a split(/\s/) so that 
                                        // strings with spaces can be correctly parsed.
                                        var args = [],
                                            hashes = [];

                                        (can.trim(content) + ' ').replace(argumentsRegExp, function(whole, arg) {

                                            // Check for special helper arguments (string/number/boolean/hashes).
                                            if (i && (m = arg.match(literalNumberStringBooleanRegExp))) {
                                                // Found a native type like string/number/boolean.
                                                if (m[2]) {
                                                    args.push(m[0]);
                                                }
                                                // Found a hash object.
                                                else {
                                                    // Addd to the hash object.

                                                    hashes.push(m[4] + ":" + (m[6] ? m[6] : makeLookupLiteral(m[5])))
                                                }
                                            }
                                            // Otherwise output a normal interpolation reference.
                                            else {
                                                args.push(makeLookupLiteral(arg));
                                            }
                                            i++;
                                        });

                                        result.push(args.join(","));
                                        if (hashes.length) {
                                            result.push(",{" + HASH + ":{" + hashes.join(",") + "}}")
                                        }


                                    }

                                    // Create an option object for sections of code.
                                    mode && mode != 'else' && result.push(',[\n\n');
                                    switch (mode) {
                                        // Truthy section
                                        case '#':
                                            result.push('{fn:function(' + ARG_NAMES + '){var ___v1ew = [];');
                                            break;
                                            // If/else section
                                            // Falsey section

                                        case 'else':
                                            result.push('return ___v1ew.join("");}},\n{inverse:function(' + ARG_NAMES + '){\nvar ___v1ew = [];');
                                            break;
                                        case '^':
                                            result.push('{inverse:function(' + ARG_NAMES + '){\nvar ___v1ew = [];');
                                            break;

                                            // Not a section, no mode
                                        default:
                                            result.push(')');
                                            break;
                                    }

                                    // Return a raw result if there was a section, otherwise return the default string.
                                    result = result.join('');
                                    return mode ? {
                                        raw: result
                                    } : result;
                                }
                            }
                        ]
                    })
            });

        // Add in default scanner helpers first.
        // We could probably do this differently if we didn't 'break' on every match.
        var helpers = can.view.Scanner.prototype.helpers;
        for (var i = 0; i < helpers.length; i++) {
            Mustache.prototype.scanner.helpers.unshift(helpers[i]);
        };


        Mustache.txt = function(scopeAndOptions, mode, name) {
            var scope = scopeAndOptions.scope,
                options = scopeAndOptions.options,
                args = [],
                helperOptions = {
                    fn: function() {},
                    inverse: function() {}
                },
                hash,
                context = scope.attr(".");

            // convert lookup values to actual values in name, arguments, and hash
            for (var i = 3; i < arguments.length; i++) {
                var arg = arguments[i]
                if (mode && can.isArray(arg)) {
                    // merge into options
                    helperOptions = can.extend.apply(can, [helperOptions].concat(arg))
                } else if (arg && arg[HASH]) {
                    hash = arg[HASH];
                    // get values on hash
                    for (var prop in hash) {
                        if (isLookup(hash[prop])) {
                            hash[prop] = Mustache.get(hash[prop].get, scopeAndOptions)
                        }
                    }
                } else if (arg && isLookup(arg)) {
                    args.push(Mustache.get(arg.get, scopeAndOptions, false, true));
                } else {
                    args.push(arg)
                }
            }

            if (isLookup(name)) {
                name = Mustache.get(name.get, scopeAndOptions, args.length, false)
            }

            // overwrite fn and inverse to always convert to scopes
            helperOptions.fn = makeConvertToScopes(helperOptions.fn, scope, options);
            helperOptions.inverse = makeConvertToScopes(helperOptions.inverse, scope, options)

            // Check for a registered helper or a helper-like function.
            if (helper = (Mustache.getHelper(name, options) || (can.isFunction(name) && !name.isComputed && !name.isObserveMethod && {
                            fn: name
                        }))) {
                // Add additional data to be used by helper functions

                can.extend(helperOptions, {
                        context: context,
                        scope: scope,
                        contexts: scope,
                        hash: hash
                    })

                args.push(helperOptions)
                // Call the helper.
                return helper.fn.apply(context, args) || '';
            }


            if (can.isFunction(name)) {
                if (name.isComputed) {
                    name = name();
                } else if (name.isObserveMethod) {
                    name = name(context, scope);
                }
            }

            // An array of arguments to check for truthyness when evaluating sections.
            var validArgs = args.length ? args : [name],
                // Whether the arguments meet the condition of the section.
                valid = true,
                result = [],
                i, helper, argIsObserve, arg;
            // Validate the arguments based on the section mode.
            if (mode) {
                for (i = 0; i < validArgs.length; i++) {
                    arg = validArgs[i];
                    argIsObserve = typeof arg !== 'undefined' && isObserveLike(arg);
                    // Array-like objects are falsey if their length = 0.
                    if (isArrayLike(arg)) {
                        // Use .attr to trigger binding on empty lists returned from function
                        if (mode == '#') {
                            valid = valid && !! (argIsObserve ? arg.attr('length') : arg.length);
                        } else if (mode == '^') {
                            valid = valid && !(argIsObserve ? arg.attr('length') : arg.length);
                        }
                    }
                    // Otherwise just check if it is truthy or not.
                    else {
                        valid = mode == '#' ? valid && !! arg : mode == '^' ? valid && !arg : valid;
                    }
                }
            }

            // Otherwise interpolate like normal.
            if (valid) {
                switch (mode) {
                    // Truthy section.
                    case '#':
                        // Iterate over arrays
                        if (isArrayLike(name)) {
                            var isObserveList = isObserveLike(name);

                            // Add the reference to the list in the contexts.
                            for (i = 0; i < name.length; i++) {
                                result.push(helperOptions.fn(name[i] || ''));

                                // Ensure that live update works on observable lists
                                isObserveList && name.attr('' + i);
                            }
                            return result.join('');
                        }
                        // Normal case.
                        else {
                            return helperOptions.fn(name || {}) || '';
                        }
                        break;
                        // Falsey section.
                    case '^':
                        return helperOptions.inverse(name || {}) || '';
                        break;
                    default:
                        // Add + '' to convert things like numbers to strings.
                        // This can cause issues if you are trying to
                        // eval on the length but this is the more
                        // common case.
                        return '' + (name !== undefined ? name : '');
                        break;
                }
            }

            return '';
        };


        Mustache.get = function(ref, scopeAndOptions, isHelper, isArgument) {

            if (isHelper) {
                // highest priority to registered helpers
                if (Mustache.getHelper(ref, scopeAndOptions.options)) {
                    return ref
                }
                // Support helper-like functions as anonymous helpers
                // Check if there is a method directly in the "top" context
                if (scopeAndOptions.scope && can.isFunction(scopeAndOptions.scope.attr('.')[ref])) {
                    return scopeAndOptions.scope.attr('.')[ref];
                }

            }

            var options = scopeAndOptions.options || {};


            var data = scopeAndOptions.scope.get(ref);

            // use value over helper only if within top scope

            if (Mustache.getHelper(ref, options) && data.scope != scopeAndOptions.scope) {
                return ref
            }

            // special behaviors if an argument
            if (isArgument) {
                if (can.isFunction(data.value)) {
                    if (data.value.isComputed) {
                        return data.value
                    } else {
                        return function() {
                            return data.value.apply(data.parent, arguments);
                        };
                    }
                } else if (isObserveLike(data.parent)) {
                    return data.parent.compute(data.name);
                }
            }
            // Invoke the length to ensure that Observe.List events fire.
            data.value && isObserveLike(data.value) && isArrayLike(data.value) && data.value.attr('length')
            //	return data.value;

            // If it's a function on an observe's prototype
            if (can.isFunction(data.value) && isObserveLike(data.parent) && data.parent.constructor.prototype[data.name] === data.value) {
                // make sure the value is a function that calls the value
                var val = can.proxy(data.value, data.parent);
                // mark val as method
                val.isObserveMethod = true;
                return val;
            }
            // Add support for observes
            else if (data.parent && isObserveLike(data.parent)) {
                return data.parent.compute(data.name);
            } else if (can.isFunction(data.value)) {
                return data.value.call(data.parent)
            }

            return data.value;
        };


        Mustache.resolve = function(value, lastValue, name, isArgument) {
            if (lastValue && can.isFunction(lastValue[name]) && isArgument) {
                if (lastValue[name].isComputed) {
                    return lastValue[name];
                }
                // Don't execute functions if they are parameters for a helper and are not a can.compute
                // Need to bind it to the original context so that that information doesn't get lost by the helper
                return function() {
                    return lastValue[name].apply(lastValue, arguments);
                };
            }
            // Support attributes on compute objects
            else if (lastValue && can.isFunction(lastValue) && lastValue.isComputed) {
                return lastValue()[name];
            }
            // Support functions stored in objects.
            else if (lastValue && can.isFunction(lastValue[name])) {
                return lastValue[name]();
            }
            // Invoke the length to ensure that Observe.List events fire.
            else if (isObserveLike(value) && isArrayLike(value) && value.attr('length')) {
                return value;
            }
            // Add support for observes
            else if (lastValue && isObserveLike(lastValue)) {
                return lastValue.compute(name);
            } else if (can.isFunction(value)) {
                return value();
            } else {
                return value;
            }
        };



        var OptionsScope = can.view.Scope.extend({
                init: function(data, parent) {
                    if (!data.helpers && !data.partials) {
                        data = {
                            helpers: data
                        }
                    }
                    can.view.Scope.prototype.init.apply(this, arguments)
                }
            })


        // ## Helpers
        // Helpers are functions that can be called from within a template.
        // These helpers differ from the scanner helpers in that they execute
        // at runtime instead of during compilation.
        // Custom helpers can be added via `can.Mustache.registerHelper`,
        // but there are also some built-in helpers included by default.
        // Most of the built-in helpers are little more than aliases to actions 
        // that the base version of Mustache simply implies based on the 
        // passed in object.
        // Built-in helpers:
        // * `data` - `data` is a special helper that is implemented via scanning helpers. 
        //		It hooks up the active element to the active data object: `<div {{data "key"}} />`
        // * `if` - Renders a truthy section: `{{#if var}} render {{/if}}`
        // * `unless` - Renders a falsey section: `{{#unless var}} render {{/unless}}`
        // * `each` - Renders an array: `{{#each array}} render {{this}} {{/each}}`
        // * `with` - Opens a context section: `{{#with var}} render {{/with}}`
        Mustache._helpers = {};

        Mustache.registerHelper = function(name, fn) {
            this._helpers[name] = {
                name: name,
                fn: fn
            };
        };


        Mustache.getHelper = function(name, options) {
            var helper = options.attr("helpers." + name)
            return helper ? {
                fn: helper
            } : this._helpers[name];
        };


        Mustache.render = function(partial, context, options) {
            // Make sure the partial being passed in
            // isn't a variable like { partial: "foo.mustache" }
            if (!can.view.cached[partial] && context.attr('partial')) {
                partial = context.attr('partial');
            }

            // Call into `can.view.render` passing the
            // partial and context.
            return can.view.render(partial, context);
        };

        Mustache.renderPartial = function(partialName, scope, options) {
            var partial = options.attr("partials." + partialName)
            if (partial) {
                return partial.render ? partial.render(scope, options) :
                    partial(scope, options);
            } else {
                return can.Mustache.render(partialName, scope, options);
            }
        };

        // The built-in Mustache helpers.
        can.each({
                // Implements the `if` built-in helper.

                'if': function(expr, options) {
                    if ( !! Mustache.resolve(expr)) {
                        return options.fn(options.contexts || this);
                    } else {
                        return options.inverse(options.contexts || this);
                    }
                },
                // Implements the `unless` built-in helper.

                'unless': function(expr, options) {
                    if (!Mustache.resolve(expr)) {
                        return options.fn(options.contexts || this);
                    }
                },

                // Implements the `each` built-in helper.

                'each': function(expr, options) {
                    expr = Mustache.resolve(expr);
                    if ( !! expr && isArrayLike(expr)) {
                        if (isObserveLike(expr) && typeof expr.attr('length') !== 'undefined') {
                            return can.view.lists && can.view.lists(expr, function(item) {
                                return options.fn(item);
                            });
                        } else {
                            var result = [];
                            for (var i = 0; i < expr.length; i++) {
                                result.push(options.fn(expr[i]));
                            }
                            return result.join('');
                        }
                    }
                },
                // Implements the `with` built-in helper.

                'with': function(expr, options) {
                    var ctx = expr;
                    expr = Mustache.resolve(expr);
                    if ( !! expr) {
                        return options.fn(ctx);
                    }
                }


            }, function(fn, name) {
                Mustache.registerHelper(name, fn);
            });

        // ## Registration
        // Registers Mustache with can.view.
        can.view.register({
                suffix: "mustache",

                contentType: "x-mustache-template",

                // Returns a `function` that renders the view.
                script: function(id, src) {
                    return "can.Mustache(function(" + ARG_NAMES + ") { " + new Mustache({
                            text: src,
                            name: id
                        }).template.out + " })";
                },

                renderer: function(id, text) {
                    return Mustache({
                            text: text,
                            name: id
                        });
                }
            });

        return can;
    })(__m2, __m17, __m18, __m19, __m15, __m21);

    // ## can/view/bindings/bindings.js
    var __m24 = (function(can) {




        can.view.Scanner.attribute("can-value", function(data, el) {

            var attr = el.getAttribute("can-value"),
                value = data.scope.compute(attr);

            if (el.nodeName.toLowerCase() === "input") {
                if (el.type === "checkbox") {
                    if (el.hasAttribute("can-true-value")) {
                        var trueValue = data.scope.compute(el.getAttribute("can-true-value"))
                    } else {
                        var trueValue = can.compute(true)
                    }
                    if (el.hasAttribute("can-false-value")) {
                        var falseValue = data.scope.compute(el.getAttribute("can-false-value"))
                    } else {
                        var falseValue = can.compute(false)
                    }
                }

                if (el.type === "checkbox" || el.type === "radio") {
                    new Checked(el, {
                            value: value,
                            trueValue: trueValue,
                            falseValue: falseValue
                        });
                    return;
                }
            }

            new Value(el, {
                    value: value
                })
        });

        var special = {
            enter: function(data, el, original) {
                return {
                    event: "keyup",
                    handler: function(ev) {
                        if (ev.keyCode == 13) {
                            return original.call(this, ev)
                        }
                    }
                }
            }
        }


        can.view.Scanner.attribute(/can-[\w\.]+/, function(data, el) {

            var event = data.attr.substr("can-".length),
                attr = el.getAttribute(data.attr),
                scopeData = data.scope.get(attr),
                handler = function(ev) {

                    return scopeData.value.call(scopeData.parent, data.scope.attr("."), can.$(this), ev)
                };

            if (special[event]) {
                var specialData = special[event](data, el, handler);
                handler = specialData.handler;
                event = specialData.event;
            }

            can.bind.call(el, event, handler);
            // not all libraries automatically remove bindings
            can.bind.call(el, "removed", function() {
                can.unbind.call(el, event, handler);
            })

        });


        var Value = can.Control.extend({
                init: function() {
                    if (this.element[0].nodeName.toUpperCase() === "SELECT") {
                        // need to wait until end of turn ...
                        setTimeout($.proxy(this.set, this), 1)
                    } else {
                        this.set()
                    }

                },
                "{value} change": "set",
                set: function() {
                    this.element[0].value = this.options.value()
                },
                "change": function() {
                    this.options.value(this.element[0].value)
                }
            })

        var Checked = can.Control.extend({
                init: function() {
                    this.isCheckebox = (this.element[0].type.toLowerCase() == "checkbox");
                    this.check()
                },
                "{value} change": "check",
                "{trueValue} change": "check",
                "{falseValue} change": "check",
                check: function() {
                    if (this.isCheckebox) {
                        var value = this.options.value(),
                            trueValue = this.options.trueValue() || true,
                            falseValue = this.options.falseValue() || false;

                        this.element[0].checked = (value == trueValue)
                    } else {
                        if (this.options.value() === this.element[0].value) {
                            this.element[0].checked = true //.prop("checked", true)
                        } else {
                            this.element[0].checked = false //.prop("checked", false)
                        }
                    }


                },
                "change": function() {

                    if (this.isCheckebox) {
                        this.options.value(this.element[0].checked ? this.options.trueValue() : this.options.falseValue());
                    } else {
                        if (this.element[0].checked) {
                            this.options.value(this.element[0].value);
                        }
                    }

                }
            });

    })(__m2, __m16, __m7);

    // ## can/component/component.js
    var __m1 = (function(can) {

        var ignoreAttributesRegExp = /data-view-id|class|id/i

        var Component = can.Component = can.Construct.extend(

            {
                setup: function() {
                    can.Construct.setup.apply(this, arguments);

                    if (can.Component) {
                        var self = this;
                        this.Control = can.Control.extend({
                                _lookup: function(options) {
                                    return [options.scope, options, window]
                                }
                            }, can.extend({
                                    setup: function(el, options) {
                                        var res = can.Control.prototype.setup.call(this, el, options)
                                        this.scope = options.scope;
                                        // call on() whenever scope changes
                                        var self = this;
                                        this.on(this.scope, "change", function() {
                                            self.on();
                                            self.on(this.scope, "change", arguments.callee);
                                        });
                                        return res;
                                    }
                                }, this.prototype.events));

                        var attributeScopeMappings = {};
                        // go through scope and get attribute ones
                        can.each(this.prototype.scope, function(val, prop) {
                            if (val === "@") {
                                attributeScopeMappings[prop] = prop;
                            }
                        })
                        this.attributeScopeMappings = attributeScopeMappings;

                        // setup inheritance right away
                        if (!this.prototype.scope || typeof this.prototype.scope === "object") {
                            this.Map = can.Map.extend(this.prototype.scope || {});
                        }




                        if (this.prototype.template) {
                            if (typeof this.prototype.template == "function") {
                                var temp = this.prototype.template
                                this.renderer = function() {
                                    return can.view.frag(temp.apply(null, arguments))
                                }
                            } else {
                                this.renderer = can.view.mustache(this.prototype.template);
                            }
                        }



                        can.view.Scanner.tag(this.prototype.tag, function(el, options) {
                            new self(el, options)
                        });
                    }

                }
            }, {

                setup: function(el, hookupOptions) {
                    // Setup values passed to component
                    var initalScopeData = {},
                        component = this;

                    // scope prototype properties marked with an "@" are added here
                    can.each(this.constructor.attributeScopeMappings, function(val, prop) {
                        initalScopeData[prop] = el.getAttribute(val)
                    })

                    // get the value in the scope for each attribute
                    // the hookup should probably happen after?
                    can.each(can.makeArray(el.attributes), function(node, index) {

                        var name = node.nodeName.toLowerCase(),
                            value = node.value;

                        // ignore attributes already in ScopeMappings
                        if (component.constructor.attributeScopeMappings[name] || ignoreAttributesRegExp.test(name)) {
                            return;
                        }

                        // get the value from the current scope
                        var scopeValue = hookupOptions.scope.attr(value);
                        if (can.isFunction(scopeValue) && !scopeValue.isComputed) {

                            var data = hookupOptions.scope.get(value)

                            scopeValue = data.value.call(data.parent)

                        }
                        initalScopeData[name] = scopeValue;

                        // if this is something that we can auto-update, lets do that
                        var compute = hookupOptions.scope.compute(value),
                            handler = function(ev, newVal) {
                                componentScope.attr(name, newVal)
                            }
                            // compute only returned if bindable
                        if (compute) {
                            compute.bind("change", handler);
                            can.bind.call(el, "removed", function() {
                                compute.unbind("change", handler);
                            })
                        }
                    })

                    var componentScope
                    // save the scope
                    if (this.constructor.Map) {
                        componentScope = new this.constructor.Map(initalScopeData);
                    } else if (can.isFunction(this.scope)) {
                        var scopeResult = this.scope(initalScopeData, hookupOptions.scope, el);
                        // if the function returns a can.Map, use that as the scope
                        if (scopeResult instanceof can.Map) {
                            componentScope = scopeResult
                        } else if (typeof scopeResult == "function" && typeof scopeResult.extend == "function") {
                            componentScope = new scopeResult(initalScopeData);
                        } else {
                            componentScope = new(can.Map.extend(scopeResult))(initalScopeData);
                        }

                    }

                    this.scope = componentScope;
                    can.data(can.$(el), "scope", this.scope)

                    // create a real Scope object out of the scope property
                    var renderedScope = hookupOptions.scope.add(this.scope),

                        // setup helpers to callback with `this` as the component
                        helpers = this.helpers || {};
                    can.each(helpers, function(val, prop) {
                        if (can.isFunction(val)) {
                            helpers[prop] = function() {
                                return val.apply(componentScope, arguments)
                            }
                        }
                    });

                    // create a control to listen to events
                    this._control = new this.constructor.Control(el, {
                            scope: this.scope
                        });

                    // if this component has a template (that we've already converted to a renderer)
                    if (this.constructor.renderer) {
                        // add content to tags
                        if (!helpers._tags) {
                            helpers._tags = {};
                        }

                        // we need be alerted to when a <content> element is rendered so we can put the original contents of the widget in its place
                        helpers._tags.content = function(el, rendererOptions) {
                            // first check if there was content within the custom tag
                            // otherwise, render what was within <content>, the default code
                            var subtemplate = hookupOptions.subtemplate || rendererOptions.subtemplate
                            if (subtemplate) {
                                var frag = can.view.frag(subtemplate(renderedScope, rendererOptions.options.add(helpers)));
                                can.insertBefore(el.parentNode, frag, el);
                                can.remove(can.$(el));
                            }
                        }
                        // render the component's template
                        var frag = this.constructor.renderer(renderedScope, helpers);
                    } else {
                        // otherwise render the contents between the 
                        var frag = can.view.frag(hookupOptions.subtemplate ? hookupOptions.subtemplate(renderedScope, hookupOptions.options.add(helpers)) : "");
                    }
                    can.appendChild(el, frag);
                }
            })

        if (window.$ && $.fn) {
            $.fn.scope = function(attr) {
                if (attr) {
                    return this.data("scope").attr(attr)
                } else {
                    return this.data("scope")
                }
            }
        }


        can.scope = function(el, attr) {
            var el = can.$(el);
            if (attr) {
                return can.data(el, "scope").attr(attr)
            } else {
                return can.data(el, "scope")
            }
        }

        return Component;
    })(__m2, __m7, __m10, __m16, __m24);

    // ## can/model/model.js
    var __m25 = (function(can) {

        // ## model.js  
        // `can.Model`  
        // _A `can.Map` that connects to a RESTful interface._
        // Generic deferred piping function

        var pipe = function(def, model, func) {
            var d = new can.Deferred();
            def.then(function() {
                var args = can.makeArray(arguments),
                    success = true;
                try {
                    args[0] = model[func](args[0]);
                } catch (e) {
                    success = false;
                    d.rejectWith(d, [e].concat(args));
                }
                if (success) {
                    d.resolveWith(d, args);
                }
            }, function() {
                d.rejectWith(this, arguments);
            });

            if (typeof def.abort === 'function') {
                d.abort = function() {
                    return def.abort();
                }
            }

            return d;
        },
            modelNum = 0,
            ignoreHookup = /change.observe\d+/,
            getId = function(inst) {
                // Instead of using attr, use __get for performance.
                // Need to set reading
                can.__reading && can.__reading(inst, inst.constructor.id)
                return inst.__get(inst.constructor.id);
            },
            // Ajax `options` generator function
            ajax = function(ajaxOb, data, type, dataType, success, error) {

                var params = {};

                // If we get a string, handle it.
                if (typeof ajaxOb == "string") {
                    // If there's a space, it's probably the type.
                    var parts = ajaxOb.split(/\s+/);
                    params.url = parts.pop();
                    if (parts.length) {
                        params.type = parts.pop();
                    }
                } else {
                    can.extend(params, ajaxOb);
                }

                // If we are a non-array object, copy to a new attrs.
                params.data = typeof data == "object" && !can.isArray(data) ?
                    can.extend(params.data || {}, data) : data;

                // Get the url with any templated values filled out.
                params.url = can.sub(params.url, params.data, true);

                return can.ajax(can.extend({
                            type: type || "post",
                            dataType: dataType || "json",
                            success: success,
                            error: error
                        }, params));
            },
            makeRequest = function(self, type, success, error, method) {
                var args;
                // if we pass an array as `self` it it means we are coming from
                // the queued request, and we're passing already serialized data
                // self's signature will be: [self, serializedData]
                if (can.isArray(self)) {
                    args = self[1];
                    self = self[0];
                } else {
                    args = self.serialize();
                }
                args = [args];
                var deferred,
                    // The model.
                    model = self.constructor,
                    jqXHR;

                // `update` and `destroy` need the `id`.
                if (type !== 'create') {
                    args.unshift(getId(self));
                }


                jqXHR = model[type].apply(model, args);

                deferred = jqXHR.pipe(function(data) {
                    self[method || type + "d"](data, jqXHR);
                    return self;
                });

                // Hook up `abort`
                if (jqXHR.abort) {
                    deferred.abort = function() {
                        jqXHR.abort();
                    };
                }

                deferred.then(success, error);
                return deferred;
            },
            initializers = {
                // makes a models function that looks up the data in a particular property
                models: function(prop) {
                    return function(instancesRawData, oldList) {
                        // until "end of turn", increment reqs counter so instances will be added to the store
                        can.Model._reqs++;
                        if (!instancesRawData) {
                            return;
                        }

                        if (instancesRawData instanceof this.List) {
                            return instancesRawData;
                        }

                        // Get the list type.
                        var self = this,
                            tmp = [],
                            res = oldList instanceof can.List ? oldList : new(self.List || ML),
                            // Did we get an `array`?
                            arr = can.isArray(instancesRawData),

                            // Did we get a model list?
                            ml = (instancesRawData instanceof ML),

                            // Get the raw `array` of objects.
                            raw = arr ?

                            // If an `array`, return the `array`.
                            instancesRawData :

                            // Otherwise if a model list.
                            (ml ?

                                // Get the raw objects from the list.
                                instancesRawData.serialize() :

                                // Get the object's data.
                                can.getObject(prop || "data", instancesRawData)),
                            i = 0;

                        if (typeof raw === 'undefined') {
                            throw new Error('Could not get any raw data while converting using .models');
                        }



                        if (res.length) {
                            res.splice(0);
                        }

                        can.each(raw, function(rawPart) {
                            tmp.push(self.model(rawPart));
                        });

                        // We only want one change event so push everything at once
                        res.push.apply(res, tmp);

                        if (!arr) { // Push other stuff onto `array`.
                            can.each(instancesRawData, function(val, prop) {
                                if (prop !== 'data') {
                                    res.attr(prop, val);
                                }
                            })
                        }
                        // at "end of turn", clean up the store
                        setTimeout(can.proxy(this._clean, this), 1);
                        return res;
                    }
                },
                model: function(prop) {
                    return function(attributes) {
                        if (!attributes) {
                            return;
                        }
                        if (typeof attributes.serialize === 'function') {
                            attributes = attributes.serialize();
                        }
                        if (prop) {
                            attributes = can.getObject(prop || "data", attributes);
                        }

                        var id = attributes[this.id],
                            model = (id || id === 0) && this.store[id] ?
                                this.store[id].attr(attributes, this.removeAttr || false) : new this(attributes);

                        return model;
                    }
                }
            }


            // This object describes how to make an ajax request for each ajax method.  
            // The available properties are:
            //		`url` - The default url to use as indicated as a property on the model.
            //		`type` - The default http request type
            //		`data` - A method that takes the `arguments` and returns `data` used for ajax.

        ajaxMethods = {

            create: {
                url: "_shortName",
                type: "post"
            },

            update: {
                data: function(id, attrs) {
                    attrs = attrs || {};
                    var identity = this.id;
                    if (attrs[identity] && attrs[identity] !== id) {
                        attrs["new" + can.capitalize(id)] = attrs[identity];
                        delete attrs[identity];
                    }
                    attrs[identity] = id;
                    return attrs;
                },
                type: "put"
            },

            destroy: {
                type: "delete",
                data: function(id, attrs) {
                    attrs = attrs || {};
                    attrs.id = attrs[this.id] = id;
                    return attrs;
                }
            },

            findAll: {
                url: "_shortName"
            },

            findOne: {}
        },
        // Makes an ajax request `function` from a string.
        //		`ajaxMethod` - The `ajaxMethod` object defined above.
        //		`str` - The string the user provided. Ex: `findAll: "/recipes.json"`.
        ajaxMaker = function(ajaxMethod, str) {
            // Return a `function` that serves as the ajax method.
            return function(data) {
                // If the ajax method has it's own way of getting `data`, use that.
                data = ajaxMethod.data ?
                    ajaxMethod.data.apply(this, arguments) :
                // Otherwise use the data passed in.
                data;
                // Return the ajax method with `data` and the `type` provided.
                return ajax(str || this[ajaxMethod.url || "_url"], data, ajaxMethod.type || "get")
            }
        }



        can.Model = can.Map({
                fullName: "can.Model",
                _reqs: 0,

                setup: function(base) {
                    // create store here if someone wants to use model without inheriting from it
                    this.store = {};
                    can.Map.setup.apply(this, arguments);
                    // Set default list as model list
                    if (!can.Model) {
                        return;
                    }
                    this.List = ML({
                            Map: this
                        }, {});
                    var self = this,
                        clean = can.proxy(this._clean, self);


                    // go through ajax methods and set them up
                    can.each(ajaxMethods, function(method, name) {
                        // if an ajax method is not a function, it's either
                        // a string url like findAll: "/recipes" or an
                        // ajax options object like {url: "/recipes"}
                        if (!can.isFunction(self[name])) {
                            // use ajaxMaker to convert that into a function
                            // that returns a deferred with the data
                            self[name] = ajaxMaker(method, self[name]);
                        }
                        // check if there's a make function like makeFindAll
                        // these take deferred function and can do special
                        // behavior with it (like look up data in a store)
                        if (self["make" + can.capitalize(name)]) {
                            // pass the deferred method to the make method to get back
                            // the "findAll" method.
                            var newMethod = self["make" + can.capitalize(name)](self[name]);
                            can.Construct._overwrite(self, base, name, function() {
                                // increment the numer of requests
                                can.Model._reqs++;
                                var def = newMethod.apply(this, arguments);
                                var then = def.then(clean, clean);
                                then.abort = def.abort;

                                // attach abort to our then and return it
                                return then;
                            })
                        }
                    });
                    can.each(initializers, function(makeInitializer, name) {
                        if (typeof self[name] === "string") {
                            can.Construct._overwrite(self, base, name, makeInitializer(self[name]))
                        }
                    })
                    if (self.fullName == "can.Model" || !self.fullName) {
                        self.fullName = "Model" + (++modelNum);
                    }
                    // Add ajax converters.
                    can.Model._reqs = 0;
                    this._url = this._shortName + "/{" + this.id + "}"
                },
                _ajax: ajaxMaker,
                _makeRequest: makeRequest,
                _clean: function() {
                    can.Model._reqs--;
                    if (!can.Model._reqs) {
                        for (var id in this.store) {
                            if (!this.store[id]._bindings) {
                                delete this.store[id];
                            }
                        }
                    }
                    return arguments[0];
                },

                models: initializers.models("data"),

                model: initializers.model()
            },


            {
                setup: function(attrs) {
                    // try to add things as early as possible to the store (#457)
                    // we add things to the store before any properties are even set
                    var id = attrs && attrs[this.constructor.id];
                    if (can.Model._reqs && id != null) {
                        this.constructor.store[id] = this;
                    }
                    can.Map.prototype.setup.apply(this, arguments)
                },

                isNew: function() {
                    var id = getId(this);
                    return !(id || id === 0); // If `null` or `undefined`
                },

                save: function(success, error) {
                    return makeRequest(this, this.isNew() ? 'create' : 'update', success, error);
                },

                destroy: function(success, error) {
                    if (this.isNew()) {
                        var self = this;
                        var def = can.Deferred();
                        def.then(success, error);
                        return def.done(function(data) {
                            self.destroyed(data)
                        }).resolve(self);
                    }
                    return makeRequest(this, 'destroy', success, error, 'destroyed');
                },

                _bindsetup: function() {
                    this.constructor.store[this.__get(this.constructor.id)] = this;
                    return can.Map.prototype._bindsetup.apply(this, arguments);
                },

                _bindteardown: function() {
                    delete this.constructor.store[getId(this)];
                    return can.Map.prototype._bindteardown.apply(this, arguments)
                },
                // Change `id`.
                ___set: function(prop, val) {
                    can.Map.prototype.___set.call(this, prop, val)
                    // If we add an `id`, move it to the store.
                    if (prop === this.constructor.id && this._bindings) {
                        this.constructor.store[getId(this)] = this;
                    }
                }
            });

        can.each({

                makeFindAll: "models",

                makeFindOne: "model",
                makeCreate: "model",
                makeUpdate: "model"
            }, function(method, name) {
                can.Model[name] = function(oldMethod) {
                    return function() {
                        var args = can.makeArray(arguments),
                            oldArgs = can.isFunction(args[1]) ? args.splice(0, 1) : args.splice(0, 2),
                            def = pipe(oldMethod.apply(this, oldArgs), this, method);
                        def.then(args[0], args[1]);
                        // return the original promise
                        return def;
                    };
                };
            });

        can.each([

                "created",

                "updated",

                "destroyed"
            ], function(funcName) {
                can.Model.prototype[funcName] = function(attrs) {
                    var stub,
                        constructor = this.constructor;

                    // Update attributes if attributes have been passed
                    stub = attrs && typeof attrs == 'object' && this.attr(attrs.attr ? attrs.attr() : attrs);

                    // triggers change event that bubble's like
                    // handler( 'change','1.destroyed' ). This is used
                    // to remove items on destroyed from Model Lists.
                    // but there should be a better way.
                    can.trigger(this, "change", funcName)


                    // Call event on the instance's Class
                    can.trigger(constructor, funcName, this);
                };
            });

        // Model lists are just like `Map.List` except that when their items are 
        // destroyed, it automatically gets removed from the list.

        var ML = can.Model.List = can.List({
                setup: function(params) {
                    if (can.isPlainObject(params) && !can.isArray(params)) {
                        can.List.prototype.setup.apply(this);
                        this.replace(this.constructor.Map.findAll(params))
                    } else {
                        can.List.prototype.setup.apply(this, arguments);
                    }
                },
                _changes: function(ev, attr) {
                    can.List.prototype._changes.apply(this, arguments);
                    if (/\w+\.destroyed/.test(attr)) {
                        var index = this.indexOf(ev.target);
                        if (index != -1) {
                            this.splice(index, 1);
                        }
                    }
                }
            })

        return can.Model;
    })(__m2, __m11, __m14);

    // ## can/util/string/deparam/deparam.js
    var __m27 = (function(can) {

        // ## deparam.js  
        // `can.deparam`  
        // _Takes a string of name value pairs and returns a Object literal that represents those params._
        var digitTest = /^\d+$/,
            keyBreaker = /([^\[\]]+)|(\[\])/g,
            paramTest = /([^?#]*)(#.*)?$/,
            prep = function(str) {
                return decodeURIComponent(str.replace(/\+/g, " "));
            };


        can.extend(can, {
                deparam: function(params) {

                    var data = {},
                        pairs, lastPart;

                    if (params && paramTest.test(params)) {

                        pairs = params.split('&'),

                        can.each(pairs, function(pair) {

                            var parts = pair.split('='),
                                key = prep(parts.shift()),
                                value = prep(parts.join("=")),
                                current = data;

                            if (key) {
                                parts = key.match(keyBreaker);

                                for (var j = 0, l = parts.length - 1; j < l; j++) {
                                    if (!current[parts[j]]) {
                                        // If what we are pointing to looks like an `array`
                                        current[parts[j]] = digitTest.test(parts[j + 1]) || parts[j + 1] == "[]" ? [] : {};
                                    }
                                    current = current[parts[j]];
                                }
                                lastPart = parts.pop();
                                if (lastPart == "[]") {
                                    current.push(value);
                                } else {
                                    current[lastPart] = value;
                                }
                            }
                        });
                    }
                    return data;
                }
            });
        return can;
    })(__m2, __m9);

    // ## can/route/route.js
    var __m26 = (function(can) {

        // ## route.js  
        // `can.route`  
        // _Helps manage browser history (and client state) by synchronizing the 
        // `window.location.hash` with a `can.Map`._  
        // Helper methods used for matching routes.
        var
        // `RegExp` used to match route variables of the type ':name'.
        // Any word character or a period is matched.
        matcher = /\:([\w\.]+)/g,
            // Regular expression for identifying &amp;key=value lists.
            paramsMatcher = /^(?:&[^=]+=[^&]*)+/,
            // Converts a JS Object into a list of parameters that can be 
            // inserted into an html element tag.
            makeProps = function(props) {
                var tags = [];
                can.each(props, function(val, name) {
                    tags.push((name === 'className' ? 'class' : name) + '="' +
                        (name === "href" ? val : can.esc(val)) + '"');
                });
                return tags.join(" ");
            },
            // Checks if a route matches the data provided. If any route variable
            // is not present in the data, the route does not match. If all route
            // variables are present in the data, the number of matches is returned 
            // to allow discerning between general and more specific routes. 
            matchesData = function(route, data) {
                var count = 0,
                    i = 0,
                    defaults = {};
                // look at default values, if they match ...
                for (var name in route.defaults) {
                    if (route.defaults[name] === data[name]) {
                        // mark as matched
                        defaults[name] = 1;
                        count++;
                    }
                }
                for (; i < route.names.length; i++) {
                    if (!data.hasOwnProperty(route.names[i])) {
                        return -1;
                    }
                    if (!defaults[route.names[i]]) {
                        count++;
                    }

                }

                return count;
            },
            onready = !0,
            location = window.location,
            wrapQuote = function(str) {
                return (str + '').replace(/([.?*+\^$\[\]\\(){}|\-])/g, "\\$1");
            },
            each = can.each,
            extend = can.extend,
            // Helper for convert any object (or value) to stringified object (or value)
            stringify = function(obj) {
                // Object is array, plain object, Map or List
                if (obj && typeof obj === "object") {
                    // Get native object or array from Map or List
                    if (obj instanceof can.Map) {
                        obj = obj.attr()
                        // Clone object to prevent change original values
                    } else {
                        obj = can.isFunction(obj.slice) ? obj.slice() : can.extend({}, obj)
                    }
                    // Convert each object property or array item into stringified new
                    can.each(obj, function(val, prop) {
                        obj[prop] = stringify(val)
                    })
                    // Object supports toString function
                } else if (obj !== undefined && obj !== null && can.isFunction(obj.toString)) {
                    obj = obj.toString()
                }

                return obj
            },
            removeBackslash = function(str) {
                return str.replace(/\\/g, "")
            },
            // A ~~throttled~~ debounced function called multiple times will only fire once the
            // timer runs down. Each call resets the timer.
            timer,
            // Intermediate storage for `can.route.data`.
            curParams,
            // The last hash caused by a data change
            lastHash,
            // Are data changes pending that haven't yet updated the hash
            changingData,
            // If the `can.route.data` changes, update the hash.
            // Using `.serialize()` retrieves the raw data contained in the `observable`.
            // This function is ~~throttled~~ debounced so it only updates once even if multiple values changed.
            // This might be able to use batchNum and avoid this.
            onRouteDataChange = function(ev, attr, how, newval) {
                // indicate that data is changing
                changingData = 1;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    // indicate that the hash is set to look like the data
                    changingData = 0;
                    var serialized = can.route.data.serialize(),
                        path = can.route.param(serialized, true);
                    can.route._call("setURL", path);

                    lastHash = path
                }, 10);
            };

        can.route = function(url, defaults) {
            // if route ends with a / and url starts with a /, remove the leading / of the url
            var root = can.route._call("root");

            if (root.lastIndexOf("/") == root.length - 1 &&
                url.indexOf("/") === 0) {
                url = url.substr(1);
            }


            defaults = defaults || {};
            // Extract the variable names and replace with `RegExp` that will match
            // an atual URL with values.
            var names = [],
                res,
                test = "",
                lastIndex = matcher.lastIndex = 0,
                next,
                querySeparator = can.route._call("querySeparator");

            // res will be something like [":foo","foo"]
            while (res = matcher.exec(url)) {
                names.push(res[1]);
                test += removeBackslash(url.substring(lastIndex, matcher.lastIndex - res[0].length));
                next = "\\" + (removeBackslash(url.substr(matcher.lastIndex, 1)) || querySeparator);
                // a name without a default value HAS to have a value
                // a name that has a default value can be empty
                // The `\\` is for string-escaping giving single `\` for `RegExp` escaping.
                test += "([^" + next + "]" + (defaults[res[1]] ? "*" : "+") + ")";
                lastIndex = matcher.lastIndex;
            }
            test += url.substr(lastIndex).replace("\\", "")
            // Add route in a form that can be easily figured out.
            can.route.routes[url] = {
                // A regular expression that will match the route when variable values 
                // are present; i.e. for `:page/:type` the `RegExp` is `/([\w\.]*)/([\w\.]*)/` which
                // will match for any value of `:page` and `:type` (word chars or period).
                test: new RegExp("^" + test + "($|" + wrapQuote(querySeparator) + ")"),
                // The original URL, same as the index for this entry in routes.
                route: url,
                // An `array` of all the variable names in this route.
                names: names,
                // Default values provided for the variables.
                defaults: defaults,
                // The number of parts in the URL separated by `/`.
                length: url.split('/').length
            };
            return can.route;
        };


        extend(can.route, {


                param: function(data, _setRoute) {
                    // Check if the provided data keys match the names in any routes;
                    // Get the one with the most matches.
                    var route,
                        // Need to have at least 1 match.
                        matches = 0,
                        matchCount,
                        routeName = data.route,
                        propCount = 0;

                    delete data.route;

                    each(data, function() {
                        propCount++;
                    });
                    // Otherwise find route.
                    each(can.route.routes, function(temp, name) {
                        // best route is the first with all defaults matching


                        matchCount = matchesData(temp, data);
                        if (matchCount > matches) {
                            route = temp;
                            matches = matchCount;
                        }
                        if (matchCount >= propCount) {
                            return false;
                        }
                    });
                    // If we have a route name in our `can.route` data, and it's
                    // just as good as what currently matches, use that
                    if (can.route.routes[routeName] && matchesData(can.route.routes[routeName], data) === matches) {
                        route = can.route.routes[routeName];
                    }
                    // If this is match...
                    if (route) {
                        var cpy = extend({}, data),
                            // Create the url by replacing the var names with the provided data.
                            // If the default value is found an empty string is inserted.
                            res = route.route.replace(matcher, function(whole, name) {
                                delete cpy[name];
                                return data[name] === route.defaults[name] ? "" : encodeURIComponent(data[name]);
                            }).replace("\\", ""),
                            after;
                        // Remove matching default values
                        each(route.defaults, function(val, name) {
                            if (cpy[name] === val) {
                                delete cpy[name];
                            }
                        });

                        // The remaining elements of data are added as 
                        // `&amp;` separated parameters to the url.
                        after = can.param(cpy);
                        // if we are paraming for setting the hash
                        // we also want to make sure the route value is updated
                        if (_setRoute) {
                            can.route.attr('route', route.route);
                        }
                        return res + (after ? can.route._call("querySeparator") + after : "");
                    }
                    // If no route was found, there is no hash URL, only paramters.
                    return can.isEmptyObject(data) ? "" : can.route._call("querySeparator") + can.param(data);
                },

                deparam: function(url) {

                    // remove the url
                    var root = can.route._call("root");
                    if (root.lastIndexOf("/") == root.length - 1 &&
                        url.indexOf("/") === 0) {
                        url = url.substr(1);
                    }

                    // See if the url matches any routes by testing it against the `route.test` `RegExp`.
                    // By comparing the URL length the most specialized route that matches is used.
                    var route = {
                        length: -1
                    },
                        querySeparator = can.route._call("querySeparator"),
                        paramsMatcher = can.route._call("paramsMatcher");

                    each(can.route.routes, function(temp, name) {
                        if (temp.test.test(url) && temp.length > route.length) {
                            route = temp;
                        }
                    });
                    // If a route was matched.
                    if (route.length > -1) {

                        var // Since `RegExp` backreferences are used in `route.test` (parens)
                        // the parts will contain the full matched string and each variable (back-referenced) value.
                        parts = url.match(route.test),
                            // Start will contain the full matched string; parts contain the variable values.
                            start = parts.shift(),
                            // The remainder will be the `&amp;key=value` list at the end of the URL.
                            remainder = url.substr(start.length - (parts[parts.length - 1] === querySeparator ? 1 : 0)),
                            // If there is a remainder and it contains a `&amp;key=value` list deparam it.
                            obj = (remainder && paramsMatcher.test(remainder)) ? can.deparam(remainder.slice(1)) : {};

                        // Add the default values for this route.
                        obj = extend(true, {}, route.defaults, obj);
                        // Overwrite each of the default values in `obj` with those in 
                        // parts if that part is not empty.
                        each(parts, function(part, i) {
                            if (part && part !== querySeparator) {
                                obj[route.names[i]] = decodeURIComponent(part);
                            }
                        });
                        obj.route = route.route;
                        return obj;
                    }
                    // If no route was matched, it is parsed as a `&amp;key=value` list.
                    if (url.charAt(0) !== querySeparator) {
                        url = querySeparator + url;
                    }
                    return paramsMatcher.test(url) ? can.deparam(url.slice(1)) : {};
                },

                data: new can.Map({}),

                routes: {},

                ready: function(val) {
                    if (val !== true) {
                        can.route._setup();
                        can.route.setState();
                    }
                    return can.route;
                },

                url: function(options, merge) {

                    if (merge) {
                        options = can.extend({}, can.route.deparam(can.route._call("matchingPartOfURL")), options);
                    }
                    return can.route._call("root") + can.route.param(options);
                },

                link: function(name, options, props, merge) {
                    return "<a " + makeProps(
                        extend({
                                href: can.route.url(options, merge)
                            }, props)) + ">" + name + "</a>";
                },

                current: function(options) {
                    return this._call("matchingPartOfURL") === can.route.param(options);
                },
                bindings: {
                    hashchange: {
                        paramsMatcher: paramsMatcher,
                        querySeparator: "&",
                        bind: function() {
                            can.bind.call(window, 'hashchange', setState);
                        },
                        unbind: function() {
                            can.unbind.call(window, 'hashchange', setState);
                        },
                        // Gets the part of the url we are determinging the route from.
                        // For hashbased routing, it's everything after the #, for
                        // pushState it's configurable
                        matchingPartOfURL: function() {
                            return location.href.split(/#!?/)[1] || "";
                        },
                        // gets called with the serialized can.route data after a route has changed
                        // returns what the url has been updated to (for matching purposes)
                        setURL: function(path) {
                            location.hash = "#!" + path;
                            return path;
                        },
                        root: "#!"
                    }
                },
                defaultBinding: "hashchange",
                currentBinding: null,
                // ready calls setup
                // setup binds and listens to data changes
                // bind listens to whatever you should be listening to
                // data changes tries to set the path

                // we need to be able to
                // easily kick off calling setState
                // 	teardown whatever is there
                //  turn on a particular binding

                // called when the route is ready
                _setup: function() {
                    if (!can.route.currentBinding) {
                        can.route._call("bind");
                        can.route.bind("change", onRouteDataChange);
                        can.route.currentBinding = can.route.defaultBinding;
                    }
                },
                _teardown: function() {
                    if (can.route.currentBinding) {
                        can.route._call("unbind");
                        can.route.unbind("change", onRouteDataChange);
                        can.route.currentBinding = null;
                    }
                    clearTimeout(timer);
                    changingData = 0;
                },
                // a helper to get stuff from the current or default bindings
                _call: function() {
                    var args = can.makeArray(arguments),
                        prop = args.shift(),
                        binding = can.route.bindings[can.route.currentBinding || can.route.defaultBinding]
                        method = binding[prop];
                    if (typeof method === "function") {
                        return method.apply(binding, args)
                    } else {
                        return method;
                    }
                }
            });


        // The functions in the following list applied to `can.route` (e.g. `can.route.attr('...')`) will
        // instead act on the `can.route.data` observe.
        each(['bind', 'unbind', 'on', 'off', 'delegate', 'undelegate', 'removeAttr', 'compute', '_get', '__get'], function(name) {
            can.route[name] = function() {
                // `delegate` and `undelegate` require
                // the `can/map/delegate` plugin
                if (!can.route.data[name]) {
                    return;
                }

                return can.route.data[name].apply(can.route.data, arguments);
            }
        })

        // Because everything in hashbang is in fact a string this will automaticaly convert new values to string. Works with single value, or deep hashes.
        // Main motivation for this is to prevent double route event call for same value.
        // Example (the problem):
        // When you load page with hashbang like #!&some_number=2 and bind 'some_number' on routes.
        // It will fire event with adding of "2" (string) to 'some_number' property
        // But when you after this set can.route.attr({some_number: 2}) or can.route.attr('some_number', 2). it fires another event with change of 'some_number' from "2" (string) to 2 (integer)
        // This wont happen again with this normalization
        can.route.attr = function(attr, val) {
            var type = typeof attr,
                newArguments;

            // Reading
            if (val === undefined) {
                newArguments = arguments;
                // Sets object
            } else if (type !== "string" && type !== "number") {
                newArguments = [stringify(attr), val];
                // Sets key - value
            } else {
                newArguments = [attr, stringify(val)];
            }

            return can.route.data.attr.apply(can.route.data, newArguments)
        }

        var // Deparameterizes the portion of the hash of interest and assign the
        // values to the `can.route.data` removing existing values no longer in the hash.
        // setState is called typically by hashchange which fires asynchronously
        // So it's possible that someone started changing the data before the 
        // hashchange event fired.  For this reason, it will not set the route data
        // if the data is changing or the hash already matches the hash that was set.
        setState = can.route.setState = function() {
            var hash = can.route._call("matchingPartOfURL");
            curParams = can.route.deparam(hash);

            // if the hash data is currently changing, or
            // the hash is what we set it to anyway, do NOT change the hash
            if (!changingData || hash !== lastHash) {
                can.route.attr(curParams, true);
            }
        };





        return can.route;
    })(__m2, __m11, __m27);

    // ## can/control/route/route.js
    var __m28 = (function(can) {

        // ## control/route.js  
        // _Controller route integration._

        can.Control.processors.route = function(el, event, selector, funcName, controller) {
            selector = selector || "";
            if (!can.route.routes[selector]) {
                can.route(selector);
            }
            var batchNum,
                check = function(ev, attr, how) {
                    if (can.route.attr('route') === (selector) &&
                        (ev.batchNum === undefined || ev.batchNum !== batchNum)) {

                        batchNum = ev.batchNum;

                        var d = can.route.attr();
                        delete d.route;
                        if (can.isFunction(controller[funcName])) {
                            controller[funcName](d);
                        } else {
                            controller[controller[funcName]](d);
                        }

                    }
                };
            can.route.bind('change', check);
            return function() {
                can.route.unbind('change', check);
            };
        };

        return can;
    })(__m2, __m26, __m7);

    // ## can/view/ejs/ejs.js
    var __m29 = (function(can) {
        // ## ejs.js
        // `can.EJS`  
        // _Embedded JavaScript Templates._

        // Helper methods.
        var extend = can.extend,
            EJS = function(options) {
                // Supports calling EJS without the constructor
                // This returns a function that renders the template.
                if (this.constructor != EJS) {
                    var ejs = new EJS(options);
                    return function(data, helpers) {
                        return ejs.render(data, helpers);
                    };
                }
                // If we get a `function` directly, it probably is coming from
                // a `steal`-packaged view.
                if (typeof options == "function") {
                    this.template = {
                        fn: options
                    };
                    return;
                }
                // Set options on self.
                extend(this, options);
                this.template = this.scanner.scan(this.text, this.name);
            };

        can.EJS = EJS;


        EJS.prototype.

        render = function(object, extraHelpers) {
            object = object || {};
            return this.template.fn.call(object, object, new EJS.Helpers(object, extraHelpers || {}));
        };

        extend(EJS.prototype, {

                scanner: new can.view.Scanner({
                        text: {
                            outStart: 'with(_VIEW) { with (_CONTEXT) {',
                            outEnd: "}}",
                            argNames: '_CONTEXT,_VIEW'
                        },

                        tokens: [
                            ["templateLeft", "<%%"], // Template
                            ["templateRight", "%>"], // Right Template
                            ["returnLeft", "<%=="], // Return Unescaped
                            ["escapeLeft", "<%="], // Return Escaped
                            ["commentLeft", "<%#"], // Comment
                            ["left", "<%"], // Run --- this is hack for now
                            ["right", "%>"], // Right -> All have same FOR Mustache ...
                            ["returnRight", "%>"]
                        ],
                        helpers: [

                            {
                                name: /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
                                fn: function(content) {
                                    var quickFunc = /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
                                        parts = content.match(quickFunc);

                                    return "can.proxy(function(__){var " + parts[1] + "=can.$(__);" + parts[2] + "}, this);";
                                }
                            }
                        ],

                        transform: function(source) {
                            return source.replace(/<%([\s\S]+?)%>/gm, function(whole, part) {
                                var brackets = [],
                                    foundBracketPair,
                                    i;

                                // Look for brackets (for removing self-contained blocks)
                                part.replace(/[{}]/gm, function(bracket, offset) {
                                    brackets.push([bracket, offset]);
                                });

                                // Remove bracket pairs from the list of replacements
                                do {
                                    foundBracketPair = false;
                                    for (i = brackets.length - 2; i >= 0; i--) {
                                        if (brackets[i][0] == '{' && brackets[i + 1][0] == '}') {
                                            brackets.splice(i, 2);
                                            foundBracketPair = true;
                                            break;
                                        }
                                    }
                                } while (foundBracketPair);

                                // Unmatched brackets found, inject EJS tags
                                if (brackets.length >= 2) {
                                    var result = ['<%'],
                                        bracket,
                                        last = 0;
                                    for (i = 0; bracket = brackets[i]; i++) {
                                        result.push(part.substring(last, last = bracket[1]));
                                        if ((bracket[0] == '{' && i < brackets.length - 1) || (bracket[0] == '}' && i > 0)) {
                                            result.push(bracket[0] == '{' ? '{ %><% ' : ' %><% }');
                                        } else {
                                            result.push(bracket[0]);
                                        }
                                        ++last;
                                    }
                                    result.push(part.substring(last), '%>');
                                    return result.join('');
                                }
                                // Otherwise return the original
                                else {
                                    return '<%' + part + '%>';
                                }
                            });
                        }
                    })
            });

        EJS.Helpers = function(data, extras) {
            this._data = data;
            this._extras = extras;
            extend(this, extras);
        };


        EJS.Helpers.prototype = {
            // TODO Deprecated!!
            list: function(list, cb) {

                can.each(list, function(item, i) {
                    cb(item, i, list)
                })
            },
            each: function(list, cb) {
                // Normal arrays don't get live updated
                if (can.isArray(list)) {
                    this.list(list, cb);
                } else {
                    can.view.lists(list, cb);
                }
            }
        };

        // Options for `steal`'s build.
        can.view.register({
                suffix: "ejs",
                // returns a `function` that renders the view.
                script: function(id, src) {
                    return "can.EJS(function(_CONTEXT,_VIEW) { " + new EJS({
                            text: src,
                            name: id
                        }).template.out + " })";
                },
                renderer: function(id, text) {
                    return EJS({
                            text: text,
                            name: id
                        });
                }
            });

        return can;
    })(__m2, __m18, __m9, __m15, __m19, __m21);

    // ## can/route/pushstate/pushstate.js
    var __m30 = (function(can) {
        "use strict";

        if (window.history && history.pushState) {
            can.route.bindings.pushstate = {

                root: "/",
                paramsMatcher: /^\?(?:[^=]+=[^&]*&)*[^=]+=[^&]*/,
                querySeparator: '?',
                bind: function() {
                    // intercept routable links
                    can.delegate.call(can.$(document.documentElement), 'a', 'click', anchorClickFix);

                    // popstate only fires on back/forward.
                    // To detect when someone calls push/replaceState, we need to wrap each method.
                    can.each(['pushState', 'replaceState'], function(method) {
                        originalMethods[method] = window.history[method];
                        window.history[method] = function(state) {
                            var result = originalMethods[method].apply(window.history, arguments);
                            can.route.setState();
                            return result;
                        };
                    });

                    // Bind to popstate for back/forward
                    can.bind.call(window, 'popstate', can.route.setState);
                },
                unbind: function() {
                    can.undelegate.call(can.$(document.documentElement), 'click', 'a', anchorClickFix);

                    can.each(['pushState', 'replaceState'], function(method) {
                        window.history[method] = originalMethods[method];
                    });
                    can.unbind.call(window, 'popstate', can.route.setState);
                },
                matchingPartOfURL: function() {
                    var root = cleanRoot(),
                        loc = (location.pathname + location.search),
                        index = loc.indexOf(root);

                    return loc.substr(index + root.length);
                },
                setURL: function(path) {
                    // keep hash if not in path, but in 
                    if (includeHash && path.indexOf("#") == -1 && window.location.hash) {
                        path += window.location.hash
                    }
                    window.history.pushState(null, null, can.route._call("root") + path);
                }
            }


            var anchorClickFix = function(e) {
                if (!(e.isDefaultPrevented ? e.isDefaultPrevented() : e.defaultPrevented === true)) {
                    // YUI calls back events triggered with this as a wrapped object
                    var node = this._node || this;
                    // Fix for ie showing blank host, but blank host means current host.
                    var linksHost = node.host || window.location.host;
                    // if link is within the same domain
                    if (window.location.host == linksHost) {
                        var curParams = can.route.deparam(node.pathname + node.search);
                        // if a route matches
                        if (curParams.route) {
                            // make it possible to have a link with a hash
                            includeHash = true;
                            // update the data
                            window.history.pushState(null, null, node.href);
                            // test if you can preventDefault
                            // our tests can't call .click() b/c this
                            // freezes phantom
                            e.preventDefault && e.preventDefault();
                        }
                    }
                }
            },
                cleanRoot = function() {
                    var domain = location.protocol + "//" + location.host,
                        root = can.route._call("root"),
                        index = root.indexOf(domain);
                    if (index == 0) {
                        return can.route.root.substr(domain.length)
                    }
                    return root
                },
                // a collection of methods on history that we are overwriting
                originalMethods = {},
                // used to tell setURL to include the hash because 
                // we clicked on a link
                includeHash = false;

            can.route.defaultBinding = "pushstate";

        }

        return can;
    })(__m2, __m26);

    // ## can/util/object/object.js
    var __m33 = (function(can) {

        var isArray = can.isArray,
            // essentially returns an object that has all the must have comparisons ...
            // must haves, do not return true when provided undefined
            cleanSet = function(obj, compares) {
                var copy = can.extend({}, obj);
                for (var prop in copy) {
                    var compare = compares[prop] === undefined ? compares["*"] : compares[prop];
                    if (same(copy[prop], undefined, compare)) {
                        delete copy[prop]
                    }
                }
                return copy;
            },
            propCount = function(obj) {
                var count = 0;
                for (var prop in obj) count++;
                return count;
            };

        can.Object = {};

        var same = can.Object.same = function(a, b, compares, aParent, bParent, deep) {
            var aType = typeof a,
                aArray = isArray(a),
                comparesType = typeof compares,
                compare;

            if (comparesType == 'string' || compares === null) {
                compares = compareMethods[compares];
                comparesType = 'function'
            }
            if (comparesType == 'function') {
                return compares(a, b, aParent, bParent)
            }
            compares = compares || {};

            if (a instanceof Date) {
                return a === b;
            }
            if (deep === -1) {
                return aType === 'object' || a === b;
            }
            if (aType !== typeof b || aArray !== isArray(b)) {
                return false;
            }
            if (a === b) {
                return true;
            }
            if (aArray) {
                if (a.length !== b.length) {
                    return false;
                }
                for (var i = 0; i < a.length; i++) {
                    compare = compares[i] === undefined ? compares["*"] : compares[i]
                    if (!same(a[i], b[i], a, b, compare)) {
                        return false;
                    }
                };
                return true;
            } else if (aType === "object" || aType === 'function') {
                var bCopy = can.extend({}, b);
                for (var prop in a) {
                    compare = compares[prop] === undefined ? compares["*"] : compares[prop];
                    if (!same(a[prop], b[prop], compare, a, b, deep === false ? -1 : undefined)) {
                        return false;
                    }
                    delete bCopy[prop];
                }
                // go through bCopy props ... if there is no compare .. return false
                for (prop in bCopy) {
                    if (compares[prop] === undefined || !same(undefined, b[prop], compares[prop], a, b, deep === false ? -1 : undefined)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        };

        can.Object.subsets = function(checkSet, sets, compares) {
            var len = sets.length,
                subsets = [],
                checkPropCount = propCount(checkSet),
                setLength;

            for (var i = 0; i < len; i++) {
                //check this subset
                var set = sets[i];
                if (can.Object.subset(checkSet, set, compares)) {
                    subsets.push(set)
                }
            }
            return subsets;
        };

        can.Object.subset = function(subset, set, compares) {
            // go through set {type: 'folder'} and make sure every property
            // is in subset {type: 'folder', parentId :5}
            // then make sure that set has fewer properties
            // make sure we are only checking 'important' properties
            // in subset (ones that have to have a value)

            var setPropCount = 0,
                compares = compares || {};

            for (var prop in set) {

                if (!same(subset[prop], set[prop], compares[prop], subset, set)) {
                    return false;
                }
            }
            return true;
        }

        var compareMethods = {
            "null": function() {
                return true;
            },
            i: function(a, b) {
                return ("" + a).toLowerCase() == ("" + b).toLowerCase()
            }
        }

        return can.Object;

    })(__m2);

    // ## can/map/backup/backup.js
    var __m32 = (function(can) {
        var flatProps = function(a) {
            var obj = {};
            for (var prop in a) {
                if (typeof a[prop] !== 'object' || a[prop] === null || a[prop] instanceof Date) {
                    obj[prop] = a[prop]
                }
            }
            return obj;
        };

        can.extend(can.Map.prototype, {


                backup: function() {
                    this._backupStore = this._attrs();
                    return this;
                },


                isDirty: function(checkAssociations) {
                    return this._backupStore && !can.Object.same(this._attrs(),
                        this._backupStore,
                        undefined,
                        undefined,
                        undefined, !! checkAssociations);
                },


                restore: function(restoreAssociations) {
                    var props = restoreAssociations ? this._backupStore : flatProps(this._backupStore)

                    if (this.isDirty(restoreAssociations)) {
                        this._attrs(props);
                    }

                    return this;
                }

            })

        return can.Map;
    })(__m2, __m11, __m33);

    // ## can/model/queue/queue.js
    var __m31 = (function(can) {

        var cleanAttrs = function(changedAttrs, attrs) {
            var newAttrs = can.extend(true, {}, attrs),
                attr, current, path;
            if (changedAttrs) {
                // go through the attributes returned from the server
                // and remove those that were changed during the current
                // request batch
                for (var i = 0; i < changedAttrs.length; i++) {
                    current = newAttrs;
                    path = changedAttrs[i].split('.');
                    while (path.length > 1) {
                        current = current && current[path.shift()];
                    }
                    current && delete current[path.shift()];
                }
            }
            return newAttrs;
        },
            queueRequests = function(success, error, method, callback) {
                this._changedAttrs = this._changedAttrs || [];

                var def = new can.Deferred,
                    self = this,
                    attrs = this.attr(),
                    queue = this._requestQueue,
                    changedAttrs = this._changedAttrs,
                    reqFn, index;

                reqFn = (function(self, type, success, error) {
                    // Function that performs actual request
                    return function() {
                        // pass already serialized attributes because we want to 
                        // save model in state it was when request was queued, not
                        // when request is ran
                        return self.constructor._makeRequest([self, attrs], type || (self.isNew() ? 'create' : 'update'), success, error, callback)
                    }
                })(this, method, function() {
                    // resolve deferred with results from the request
                    def.resolveWith(self, arguments);
                    // remove current deferred from the queue 
                    queue.splice(0, 1);
                    if (queue.length > 0) {
                        // replace queued wrapper function with deferred
                        // returned from the makeRequest function so we 
                        // can access it's `abort` function
                        queue[0] = queue[0]();
                    } else {
                        // clean up changed attrs since there is no more requests in the queue
                        changedAttrs.splice(0);
                    }

                }, function() {
                    // reject deferred with results from the request
                    def.rejectWith(self, arguments);
                    // since we failed remove all pending requests from the queue
                    queue.splice(0);
                    // clean up changed attrs since there is no more requests in the queue
                    changedAttrs.splice(0);
                })

                // Add our fn to the queue
                index = queue.push(reqFn) - 1;

                // If there is only one request in the queue, run
                // it immediately.
                if (queue.length === 1) {
                    // replace queued wrapper function with deferred
                    // returned from the makeRequest function so we 
                    // can access it's `abort` function
                    queue[0] = queue[0]();
                }

                def.abort = function() {
                    var abort;
                    // check if this request is running, if it's not
                    // just remove it from the queue
                    // also all subsequent requests should be removed too
                    abort = queue[index].abort && queue[index].abort();
                    // remove aborted request and any requests after it
                    queue.splice(index);
                    // if there is no more requests in the queue clean up
                    // the changed attributes array
                    if (queue.length === 0) {
                        changedAttrs.splice(0);
                    }
                    return abort;
                }
                // deferred will be resolved with original success and
                // error functions
                def.then(success, error);

                return def;
            },
            _changes = can.Model.prototype._changes,
            destroyFn = can.Model.prototype.destroy,
            setupFn = can.Model.prototype.setup;

        can.each(["created", "updated", "destroyed"], function(fn) {
            var prototypeFn = can.Model.prototype[fn];

            can.Model.prototype[fn] = function(attrs) {
                if (attrs && typeof attrs == 'object') {
                    attrs = attrs.attr ? attrs.attr() : attrs;
                    // Create backup of last good known state returned
                    // from the server. This allows users to restore it
                    // if API returns error
                    this._backupStore = attrs;
                    attrs = cleanAttrs(this._changedAttrs || [], attrs);
                }
                // call the original function with the cleaned up attributes
                prototypeFn.call(this, attrs);
            }
        })

        can.extend(can.Model.prototype, {
                setup: function() {
                    setupFn.apply(this, arguments);
                    this._requestQueue = new can.List;
                },
                _changes: function(ev, attr, how, newVal, oldVal) {
                    // record changes if there is a request running
                    this._changedAttrs && this._changedAttrs.push(attr);
                    _changes.apply(this, arguments);
                },
                hasQueuedRequests: function() {
                    return this._requestQueue.attr('length') > 1;
                },
                // call queued save request
                save: function() {
                    return queueRequests.apply(this, arguments);
                },
                destroy: function(success, error) {
                    if (this.isNew()) {
                        // if it's a new instance, call default destroy method
                        return destroyFn.call(this, success, error);
                    }
                    return queueRequests.call(this, success, error, 'destroy', 'destroyed');
                }
            })

        return can;
    })(__m2, __m25, __m32);

    // ## can/construct/super/super.js
    var __m34 = (function(can, Construct) {

        // tests if we can get super in .toString()
        var isFunction = can.isFunction,

            fnTest = /xyz/.test(function() {
                xyz;
            }) ? /\b_super\b/ : /.*/;

        // overwrites a single property so it can still call super
        can.Construct._overwrite = function(addTo, base, name, val) {
            // Check if we're overwriting an existing function
            addTo[name] = isFunction(val) &&
                isFunction(base[name]) &&
                fnTest.test(val) ? (function(name, fn) {
                    return function() {
                        var tmp = this._super,
                            ret;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = base[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        ret = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    };
                })(name, val) : val;
        }

        // overwrites an object with methods, sets up _super
        //   newProps - new properties
        //   oldProps - where the old properties might be
        //   addTo - what we are adding to
        can.Construct._inherit = function(newProps, oldProps, addTo) {
            addTo = addTo || newProps
            for (var name in newProps) {
                can.Construct._overwrite(addTo, oldProps, name, newProps[name]);
            }
        }

        return can;
    })(__m2, __m8);

    // ## can/construct/proxy/proxy.js
    var __m35 = (function(can, Construct) {
        var isFunction = can.isFunction,
            isArray = can.isArray,
            makeArray = can.makeArray,

            proxy = function(funcs) {

                //args that should be curried
                var args = makeArray(arguments),
                    self;

                // get the functions to callback
                funcs = args.shift();

                // if there is only one function, make funcs into an array
                if (!isArray(funcs)) {
                    funcs = [funcs];
                }

                // keep a reference to us in self
                self = this;


                return function class_cb() {
                    // add the arguments after the curried args
                    var cur = args.concat(makeArray(arguments)),
                        isString,
                        length = funcs.length,
                        f = 0,
                        func;

                    // go through each function to call back
                    for (; f < length; f++) {
                        func = funcs[f];
                        if (!func) {
                            continue;
                        }

                        // set called with the name of the function on self (this is how this.view works)
                        isString = typeof func == "string";

                        // call the function
                        cur = (isString ? self[func] : func).apply(self, cur || []);

                        // pass the result to the next function (if there is a next function)
                        if (f < length - 1) {
                            cur = !isArray(cur) || cur._use_call ? [cur] : cur
                        }
                    }
                    return cur;
                }
            }
        can.Construct.proxy = can.Construct.prototype.proxy = proxy;
        // this corrects the case where can/control loads after can/construct/proxy, so static props don't have proxy
        var correctedClasses = [can.Map, can.Control, can.Model],
            i = 0;
        for (; i < correctedClasses.length; i++) {
            if (correctedClasses[i]) {
                correctedClasses[i].proxy = proxy;
            }
        }
        return can;
    })(__m2, __m8);

    // ## can/map/delegate/delegate.js
    var __m36 = (function(can) {



        // ** - 'this' will be the deepest item changed
        // * - 'this' will be any changes within *, but * will be the 
        //     this returned

        // tells if the parts part of a delegate matches the broken up props of the event
        // gives the prop to use as 'this'
        // - parts - the attribute name of the delegate split in parts ['foo','*']
        // - props - the split props of the event that happened ['foo','bar','0']
        // - returns - the attribute to delegate too ('foo.bar'), or null if not a match 
        var delegateMatches = function(parts, props) {
            //check props parts are the same or 
            var len = parts.length,
                i = 0,
                // keeps the matched props we will use
                matchedProps = [],
                prop;

            // if the event matches
            for (i; i < len; i++) {
                prop = props[i]
                // if no more props (but we should be matching them)
                // return null
                if (typeof prop !== 'string') {
                    return null;
                } else
                // if we have a "**", match everything
                if (parts[i] == "**") {
                    return props.join(".");
                } else
                // a match, but we want to delegate to "*"
                if (parts[i] == "*") {
                    // only do this if there is nothing after ...
                    matchedProps.push(prop);
                } else if (prop === parts[i]) {
                    matchedProps.push(prop);
                } else {
                    return null;
                }
            }
            return matchedProps.join(".");
        },
            // gets a change event and tries to figure out which
            // delegates to call
            delegateHandler = function(event, prop, how, newVal, oldVal) {
                // pre-split properties to save some regexp time
                var props = prop.split("."),
                    delegates = (this._observe_delegates || []).slice(0),
                    delegate,
                    attr,
                    matchedAttr,
                    hasMatch,
                    valuesEqual;
                event.attr = prop;
                event.lastAttr = props[props.length - 1];

                // for each delegate
                for (var i = 0; delegate = delegates[i++];) {

                    // if there is a batchNum, this means that this
                    // event is part of a series of events caused by a single 
                    // attrs call.  We don't want to issue the same event
                    // multiple times
                    // setting the batchNum happens later
                    if ((event.batchNum && delegate.batchNum === event.batchNum) || delegate.undelegated) {
                        continue;
                    }

                    // reset match and values tests
                    hasMatch = undefined;
                    valuesEqual = true;

                    // yeah, all this under here has to be redone v

                    // for each attr in a delegate
                    for (var a = 0; a < delegate.attrs.length; a++) {

                        attr = delegate.attrs[a];

                        // check if it is a match
                        if (matchedAttr = delegateMatches(attr.parts, props)) {
                            hasMatch = matchedAttr;
                        }
                        // if it has a value, make sure it's the right value
                        // if it's set, we should probably check that it has a 
                        // value no matter what
                        if (attr.value && valuesEqual) {
                            valuesEqual = attr.value === "" + this.attr(attr.attr)
                        } else if (valuesEqual && delegate.attrs.length > 1) {
                            // if there are multiple attributes, each has to at
                            // least have some value
                            valuesEqual = this.attr(attr.attr) !== undefined
                        }
                    }


                    // if there is a match and valuesEqual ... call back
                    if (hasMatch && valuesEqual) {
                        // how to get to the changed property from the delegate
                        var from = prop.replace(hasMatch + ".", "");

                        // if this event is part of a batch, set it on the delegate
                        // to only send one event
                        if (event.batchNum) {
                            delegate.batchNum = event.batchNum
                        }

                        // if we listen to change, fire those with the same attrs
                        // TODO: the attrs should probably be using from
                        if (delegate.event === 'change') {
                            arguments[1] = from;
                            event.curAttr = hasMatch;
                            delegate.callback.apply(this.attr(hasMatch), can.makeArray(arguments));
                        } else if (delegate.event === how) {

                            // if it's a match, callback with the location of the match
                            delegate.callback.apply(this.attr(hasMatch), [event, newVal, oldVal, from]);
                        } else if (delegate.event === 'set' &&
                            how == 'add') {
                            // if we are listening to set, we should also listen to add
                            delegate.callback.apply(this.attr(hasMatch), [event, newVal, oldVal, from]);
                        }
                    }

                }
            };

        can.extend(can.Map.prototype, {

                delegate: function(selector, event, handler) {
                    selector = can.trim(selector);
                    var delegates = this._observe_delegates || (this._observe_delegates = []),
                        attrs = [],
                        selectorRegex = /([^\s=,]+)(?:=("[^",]*"|'[^',]*'|[^\s"',]*))?(,?)\s*/g,
                        matches;

                    // parse each property in the selector
                    while (matches = selectorRegex.exec(selector)) {
                        // we need to do a little doctoring to make up for the quotes.
                        if (matches[2] && can.inArray(matches[2].substr(0, 1), ['"', "'"]) >= 0) {
                            matches[2] = matches[2].substr(1, -1);
                        }

                        attrs.push({
                                // the attribute name
                                attr: matches[1],
                                // the attribute name, pre-split for speed
                                parts: matches[1].split('.'),
                                // the value associated with this property (if there was one given)
                                value: matches[2],
                                // whether this selector combines with the one after it with AND or OR
                                or: matches[3] === ','
                            });
                    }

                    // delegates has pre-processed info about the event
                    delegates.push({
                            // the attrs name for unbinding
                            selector: selector,
                            // an object of attribute names and values {type: 'recipe',id: undefined}
                            // undefined means a value was not defined
                            attrs: attrs,
                            callback: handler,
                            event: event
                        });
                    if (delegates.length === 1) {
                        this.bind("change", delegateHandler)
                    }
                    return this;
                },

                undelegate: function(selector, event, handler) {
                    selector = selector && can.trim(selector);

                    var i = 0,
                        delegates = this._observe_delegates || [],
                        delegateOb;
                    if (selector) {
                        while (i < delegates.length) {
                            delegateOb = delegates[i];
                            if (delegateOb.callback === handler ||
                                (!handler && delegateOb.selector === selector)) {
                                delegateOb.undelegated = true;
                                delegates.splice(i, 1)
                            } else {
                                i++;
                            }
                        }
                    } else {
                        // remove all delegates
                        delegates = [];
                    }
                    if (!delegates.length) {
                        //can.removeData(this, "_observe_delegates");
                        this.unbind("change", delegateHandler)
                    }
                    return this;
                }
            });
        // add helpers for testing .. 
        can.Map.prototype.delegate.matches = delegateMatches;
        return can.Map;
    })(__m2, __m11);

    // ## can/map/attributes/attributes.js
    var __m38 = (function(can, Map) {
        can.each([can.Map, can.Model], function(clss) {
            // in some cases model might not be defined quite yet.
            if (clss === undefined) {
                return;
            }
            var isObject = function(obj) {
                return typeof obj === 'object' && obj !== null && obj;
            };

            can.extend(clss, {

                    attributes: {},


                    convert: {
                        "date": function(str) {
                            var type = typeof str;
                            if (type === "string") {
                                str = Date.parse(str);
                                return isNaN(str) ? null : new Date(str);
                            } else if (type === 'number') {
                                return new Date(str)
                            } else {
                                return str
                            }
                        },
                        "number": function(val) {
                            return parseFloat(val);
                        },
                        "boolean": function(val) {
                            if (val === 'false' || val === '0' || !val) {
                                return false;
                            }
                            return true;
                        },
                        "default": function(val, oldVal, error, type) {
                            // Convert can.Model types using .model and .models
                            if (can.Map.prototype.isPrototypeOf(type.prototype) &&
                                typeof type.model === 'function' && typeof type.models === 'function') {
                                return type[can.isArray(val) ? 'models' : 'model'](val);
                            }

                            if (can.Map.prototype.isPrototypeOf(type.prototype)) {
                                if (can.isArray(val) && typeof type.List === 'function') {
                                    return new type.List(val);
                                }
                                return new type(val);
                            }

                            if (typeof type === 'function') {
                                return type(val, oldVal);
                            }

                            var construct = can.getObject(type),
                                context = window,
                                realType;

                            // if type has a . we need to look it up
                            if (type.indexOf(".") >= 0) {
                                // get everything before the last .
                                realType = type.substring(0, type.lastIndexOf("."));
                                // get the object before the last .
                                context = can.getObject(realType);
                            }
                            return typeof construct == "function" ? construct.call(context, val, oldVal) : val;
                        }
                    },

                    serialize: {
                        "default": function(val, type) {
                            return isObject(val) && val.serialize ? val.serialize() : val;
                        },
                        "date": function(val) {
                            return val && val.getTime()
                        }
                    }
                });

            // overwrite setup to do this stuff
            var oldSetup = clss.setup;


            clss.setup = function(superClass, stat, proto) {
                var self = this;
                oldSetup.call(self, superClass, stat, proto);

                can.each(["attributes"], function(name) {
                    if (!self[name] || superClass[name] === self[name]) {
                        self[name] = {};
                    }
                });

                can.each(["convert", "serialize"], function(name) {
                    if (superClass[name] != self[name]) {
                        self[name] = can.extend({}, superClass[name], self[name]);
                    }
                });
            };
        });

        can.Map.prototype.__convert = function(prop, value) {
            // check if there is a

            var Class = this.constructor,
                oldVal = this.attr(prop),
                type, converter;

            if (Class.attributes) {
                // the type of the attribute
                type = Class.attributes[prop];
                converter = Class.convert[type] || Class.convert['default'];
            }

            return value === null || !type ?
            // just use the value
            value :
            // otherwise, pass to the converter
            converter.call(Class, value, oldVal, function() {}, type);
        };

        can.Map.prototype.serialize = function(attrName, stack) {
            var where = {},
                Class = this.constructor,
                attrs = {};

            stack = can.isArray(stack) ? stack : [];
            stack.push(this._cid);

            if (attrName !== undefined) {
                attrs[attrName] = this[attrName];
            } else {
                attrs = this.__get();
            }

            can.each(attrs, function(val, name) {
                var type, converter;

                // If this is an observe, check that it wasn't serialized earlier in the stack.
                if (val instanceof can.Map && can.inArray(val._cid, stack) > -1) {
                    // Since this object has already been serialized once,
                    // just reference the id (or undefined if it doesn't exist).
                    where[name] = val.attr('id');
                } else {
                    type = Class.attributes ? Class.attributes[name] : 0;
                    converter = Class.serialize ? Class.serialize[type] : 0;

                    // if the value is an object, and has a attrs or serialize function
                    where[name] = val && typeof val.serialize == 'function' ?
                    // call attrs or serialize to get the original data back
                    val.serialize(undefined, stack) :
                    // otherwise if we have  a converter
                    converter ?
                    // use the converter
                    converter(val, type) :
                    // or return the val
                    val;
                }
            });

            return attrName != undefined ? where[attrName] : where;
        };
        return can.Map;
    })(__m2, __m11);

    // ## can/map/setter/setter.js
    var __m37 = (function(can) {

        can.classize = function(s, join) {
            // this can be moved out ..
            // used for getter setter
            var parts = s.split(can.undHash),
                i = 0;
            for (; i < parts.length; i++) {
                parts[i] = can.capitalize(parts[i]);
            }

            return parts.join(join || '');
        }

        var classize = can.classize,
            proto = can.Map.prototype,
            old = proto.__set;

        proto.__set = function(prop, value, current, success, error) {
            // check if there's a setter
            var cap = classize(prop),
                setName = "set" + cap,
                errorCallback = function(errors) {
                    var stub = error && error.call(self, errors);

                    // if 'setter' is on the page it will trigger
                    // the error itself and we dont want to trigger
                    // the event twice. :)
                    if (stub !== false) {
                        can.trigger(self, "error", [prop, errors], true);
                    }

                    return false;
                },
                self = this;

            // if we have a setter
            if (this[setName] &&
                // call the setter, if returned value is undefined,
                // this means the setter is async so we 
                // do not call update property and return right away
                (value = this[setName](value, function(value) {
                            old.call(self, prop, value, current, success, errorCallback)
                        },
                        errorCallback)) === undefined) {
                return;
            }

            old.call(self, prop, value, current, success, errorCallback);

            return this;
        };
        return can.Map;
    })(__m2, __m38);

    // ## can/map/validations/validations.js
    var __m39 = (function(can) {
        //validations object is by property.  You can have validations that
        //span properties, but this way we know which ones to run.
        //  proc should return true if there's an error or the error message
        var validate = function(attrNames, options, proc) {
            // normalize argumetns
            if (!proc) {
                proc = options;
                options = {};
            }

            options = options || {};
            attrNames = typeof attrNames == 'string' ? [attrNames] : can.makeArray(attrNames);

            // run testIf if it exists
            if (options.testIf && !options.testIf.call(this)) {
                return;
            }

            var self = this;
            can.each(attrNames, function(attrName) {
                // Add a test function for each attribute
                if (!self.validations[attrName]) {
                    self.validations[attrName] = [];
                }

                self.validations[attrName].push(function(newVal) {
                    // if options has a message return that, otherwise, return the error
                    var res = proc.call(this, newVal, attrName);
                    return res === undefined ? undefined : (options.message || res);
                })
            });
        };

        var old = can.Map.prototype.__set;
        can.Map.prototype.__set = function(prop, value, current, success, error) {
            var self = this,
                validations = self.constructor.validations,
                errorCallback = function(errors) {
                    var stub = error && error.call(self, errors);

                    // if 'setter' is on the page it will trigger
                    // the error itself and we dont want to trigger
                    // the event twice. :)
                    if (stub !== false) {
                        can.trigger(self, "error", [prop, errors], true);
                    }

                    return false;
                };

            old.call(self, prop, value, current, success, errorCallback);

            if (validations && validations[prop]) {
                var errors = self.errors(prop);
                errors && errorCallback(errors)
            }

            return this;
        }

        can.each([can.Map, can.Model], function(clss) {
            // in some cases model might not be defined quite yet.
            if (clss === undefined) {
                return;
            }
            var oldSetup = clss.setup;


            can.extend(clss, {
                    setup: function(superClass) {
                        oldSetup.apply(this, arguments);
                        if (!this.validations || superClass.validations === this.validations) {
                            this.validations = {};
                        }
                    },

                    validate: validate,


                    validationMessages: {
                        format: "is invalid",
                        inclusion: "is not a valid option (perhaps out of range)",
                        lengthShort: "is too short",
                        lengthLong: "is too long",
                        presence: "can't be empty",
                        range: "is out of range",
                        numericality: "must be a number"
                    },


                    validateFormatOf: function(attrNames, regexp, options) {
                        validate.call(this, attrNames, options, function(value) {
                            if ((typeof value !== 'undefined' && value !== null && value !== '') && String(value).match(regexp) == null) {
                                return this.constructor.validationMessages.format;
                            }
                        });
                    },


                    validateInclusionOf: function(attrNames, inArray, options) {
                        validate.call(this, attrNames, options, function(value) {
                            if (typeof value == 'undefined') {
                                return;
                            }

                            for (var i = 0; i < inArray.length; i++) {
                                if (inArray[i] == value) {
                                    return;
                                }
                            }

                            return this.constructor.validationMessages.inclusion;
                        });
                    },


                    validateLengthOf: function(attrNames, min, max, options) {
                        validate.call(this, attrNames, options, function(value) {
                            if (((typeof value === 'undefined' || value === null) && min > 0) ||
                                (typeof value !== 'undefined' && value !== null && value.length < min)) {
                                return this.constructor.validationMessages.lengthShort + " (min=" + min + ")";
                            } else if (typeof value != 'undefined' && value !== null && value.length > max) {
                                return this.constructor.validationMessages.lengthLong + " (max=" + max + ")";
                            }
                        });
                    },


                    validatePresenceOf: function(attrNames, options) {
                        validate.call(this, attrNames, options, function(value) {
                            if (typeof value == 'undefined' || value === "" || value === null) {
                                return this.constructor.validationMessages.presence;
                            }
                        });
                    },


                    validateRangeOf: function(attrNames, low, hi, options) {
                        validate.call(this, attrNames, options, function(value) {
                            if (((typeof value == 'undefined' || value === null) && low > 0) ||
                                (typeof value !== 'undefined' && value !== null && (value < low || value > hi))) {
                                return this.constructor.validationMessages.range + " [" + low + "," + hi + "]";
                            }
                        });
                    },


                    validatesNumericalityOf: function(attrNames) {
                        validate.call(this, attrNames, function(value) {
                            var res = !isNaN(parseFloat(value)) && isFinite(value);
                            if (!res) {
                                return this.constructor.validationMessages.numericality;
                            }
                        });
                    }
                });
        });


        can.extend(can.Map.prototype, {

                errors: function(attrs, newVal) {
                    // convert attrs to an array
                    if (attrs) {
                        attrs = can.isArray(attrs) ? attrs : [attrs];
                    }

                    var errors = {},
                        self = this,
                        attr,
                        // helper function that adds error messages to errors object
                        // attr - the name of the attribute
                        // funcs - the validation functions
                        addErrors = function(attr, funcs) {
                            can.each(funcs, function(func) {
                                var res = func.call(self, isTest ? (self.__convert ?
                                        self.__convert(attr, newVal) :
                                        newVal) : self.attr(attr));
                                if (res) {
                                    if (!errors[attr]) {
                                        errors[attr] = [];
                                    }
                                    errors[attr].push(res);
                                }

                            });
                        },
                        validations = this.constructor.validations,
                        isTest = attrs && attrs.length === 1 && arguments.length === 2;

                    // go through each attribute or validation and
                    // add any errors
                    can.each(attrs || validations || {}, function(funcs, attr) {
                        // if we are iterating through an array, use funcs
                        // as the attr name
                        if (typeof attr == 'number') {
                            attr = funcs;
                            funcs = validations[attr];
                        }
                        // add errors to the
                        addErrors(attr, funcs || []);
                    });

                    // return errors as long as we have one
                    return can.isEmptyObject(errors) ? null : isTest ? errors[attrs[0]] : errors;
                }
            });
        return can.Map;
    })(__m2, __m38);

    // ## can/map/list/list.js
    var __m40 = (function(can) {
        can.extend(can.List.prototype, {
                filter: function(callback) {
                    // The filtered list
                    var filtered = new this.constructor();
                    var self = this;
                    // Creates the binder for a single element at a given index
                    var generator = function(element, index) {
                        // The event handler that updates the filtered list
                        var binder = function(ev, val) {
                            var index = filtered.indexOf(element);
                            // Remove it from the list if it exists but the new value is false
                            if (!val && index !== -1) {
                                filtered.splice(index, 1);
                            }

                            // Add it to the list if it isn't in there and the new value is true
                            if (val && index === -1) {
                                filtered.push(element);
                            }
                        };

                        // a can.compute that executes the callback
                        var compute = can.compute(function() {
                            return callback(element, self.indexOf(element), self);
                        });

                        // Update the filtered list on any compute change
                        compute.bind('change', binder);
                        // Call binder explicitly for the initial list
                        binder(null, compute());
                    };

                    // We also want to know when something gets added to our original list
                    this.bind('add', function(ev, data, index) {
                        can.each(data, function(element, i) {
                            // Call the generator for each newly added element
                            // The index is the start index + the loop index
                            generator(element, index + i);
                        });
                    });

                    // Removed items should be removed from both lists
                    this.bind('remove', function(ev, data, index) {
                        can.each(data, function(element, i) {
                            var index = filtered.indexOf(element);
                            if (index !== -1) {
                                filtered.splice(index, 1);
                            }
                        });
                    });

                    // Run the generator for each list element
                    this.forEach(generator);

                    return filtered;
                },

                map: function(callback) {
                    var mapped = new can.List();
                    var self = this;
                    // Again, lets run a generator function
                    var generator = function(element, index) {
                        // The can.compute for the mapping
                        var compute = can.compute(function() {
                            return callback(element, index, self);
                        });

                        compute.bind('change', function(ev, val) {
                            // On change, replace the current value with the new one
                            mapped.splice(index, 1, val);
                        });

                        mapped.splice(index, 0, compute());
                    }

                    this.forEach(generator);

                    // We also want to know when something gets added to our original list
                    this.bind('add', function(ev, data, index) {
                        can.each(data, function(element, i) {
                            // Call the generator for each newly added element
                            // The index is the start index + the loop index
                            generator(element, index + i);
                        });
                    });

                    this.bind('remove', function(ev, data, index) {
                        // The indices in the mapped list are the same so lets just splice it out
                        mapped.splice(index, data.length);
                    })

                    return mapped;
                }


            });

        return can.List;
    })(__m2, __m11, __m14, __m15);

    // ## can/control/plugin/plugin.js
    var __m41 = (function($, can) {
        //used to determine if a control instance is one of controllers
        //controllers can be strings or classes
        var i,
            isAControllerOf = function(instance, controllers) {
                var name = instance.constructor.pluginName || instance.constructor._shortName;
                for (i = 0; i < controllers.length; i++) {
                    if (typeof controllers[i] == 'string' ? name == controllers[i] : instance instanceof controllers[i]) {
                        return true;
                    }
                }
                return false;
            },
            makeArray = can.makeArray,
            old = can.Control.setup;

        can.Control.setup = function() {
            // if you didn't provide a name, or are control, don't do anything
            if (this !== can.Control) {


                var pluginName = this.pluginName || this._fullName;

                // create jQuery plugin
                if (pluginName !== 'can_control') {
                    this.plugin(pluginName);
                }

                old.apply(this, arguments);
            }
        };

        $.fn.extend({


                controls: function() {
                    var controllerNames = makeArray(arguments),
                        instances = [],
                        controls, c, cname;
                    //check if arguments
                    this.each(function() {

                        controls = can.$(this).data("controls");
                        if (!controls) {
                            return;
                        }
                        for (var i = 0; i < controls.length; i++) {
                            c = controls[i];
                            if (!controllerNames.length || isAControllerOf(c, controllerNames)) {
                                instances.push(c);
                            }
                        }
                    });
                    return instances;
                },


                control: function(control) {
                    return this.controls.apply(this, arguments)[0];
                }
            });

        can.Control.plugin = function(pluginname) {
            var control = this;

            if (!$.fn[pluginname]) {
                $.fn[pluginname] = function(options) {

                    var args = makeArray(arguments), //if the arg is a method on this control
                        isMethod = typeof options == "string" && $.isFunction(control.prototype[options]),
                        meth = args[0],
                        returns;
                    this.each(function() {
                        //check if created
                        var plugin = can.$(this).control(control);

                        if (plugin) {
                            if (isMethod) {
                                // call a method on the control with the remaining args
                                returns = plugin[meth].apply(plugin, args.slice(1));
                            } else {
                                // call the plugin's update method
                                plugin.update.apply(plugin, args);
                            }
                        } else {
                            //create a new control instance
                            control.newInstance.apply(control, [this].concat(args));
                        }
                    });
                    return returns !== undefined ? returns : this;
                };
            }
        }

        can.Control.prototype.update = function(options) {
            can.extend(this.options, options);
            this.on();
        };

        return can;
    })(jQuery, __m2, __m7);

    // ## can/view/modifiers/modifiers.js
    var __m42 = (function($, can) {
        //---- ADD jQUERY HELPERS -----
        //converts jquery functions to use views	
        var convert, modify, isTemplate, isHTML, isDOM, getCallback,
            // text and val cannot produce an element, so don't run hookups on them
            noHookup = {
                'val': true,
                'text': true
            };

        convert = function(func_name) {
            // save the old jQuery helper
            var old = $.fn[func_name];

            // replace it with our new helper
            $.fn[func_name] = function() {

                var args = can.makeArray(arguments),
                    callbackNum,
                    callback,
                    self = this,
                    result;

                // if the first arg is a deferred
                // wait until it finishes, and call
                // modify with the result
                if (can.isDeferred(args[0])) {
                    args[0].done(function(res) {
                        modify.call(self, [res], old);
                    })
                    return this;
                }
                //check if a template
                else if (isTemplate(args)) {

                    // if we should operate async
                    if ((callbackNum = getCallback(args))) {
                        callback = args[callbackNum];
                        args[callbackNum] = function(result) {
                            modify.call(self, [result], old);
                            callback.call(self, result);
                        };
                        can.view.apply(can.view, args);
                        return this;
                    }
                    // call view with args (there might be deferreds)
                    result = can.view.apply(can.view, args);

                    // if we got a string back
                    if (!can.isDeferred(result)) {
                        // we are going to call the old method with that string
                        args = [result];
                    } else {
                        // if there is a deferred, wait until it is done before calling modify
                        result.done(function(res) {
                            modify.call(self, [res], old);
                        })
                        return this;
                    }
                }
                return noHookup[func_name] ? old.apply(this, args) :
                    modify.call(this, args, old);
            };
        };

        // modifies the content of the element
        // but also will run any hookup
        modify = function(args, old) {
            var res, stub, hooks;

            //check if there are new hookups
            for (var hasHookups in can.view.hookups) {
                break;
            }

            //if there are hookups, turn into a frag
            // and insert that
            // by using a frag, the element can be recursively hooked up
            // before insterion
            if (hasHookups && args[0] && isHTML(args[0])) {
                args[0] = can.view.frag(args[0]).childNodes;
            }

            //then insert into DOM
            res = old.apply(this, args);

            return res;
        };

        // returns true or false if the args indicate a template is being used
        // $('#foo').html('/path/to/template.ejs',{data})
        // in general, we want to make sure the first arg is a string
        // and the second arg is data
        isTemplate = function(args) {
            // save the second arg type
            var secArgType = typeof args[1];

            // the first arg is a string
            return typeof args[0] == "string" &&
            // the second arg is an object or function
            (secArgType == 'object' || secArgType == 'function') &&
            // but it is not a dom element
            !isDOM(args[1]);
        };
        // returns true if the arg is a jQuery object or HTMLElement
        isDOM = function(arg) {
            return arg.nodeType || (arg[0] && arg[0].nodeType)
        };
        // returns whether the argument is some sort of HTML data
        isHTML = function(arg) {
            if (isDOM(arg)) {
                // if jQuery object or DOM node we're good
                return true;
            } else if (typeof arg === "string") {
                // if string, do a quick sanity check that we're HTML
                arg = can.trim(arg);
                return arg.substr(0, 1) === "<" && arg.substr(arg.length - 1, 1) === ">" && arg.length >= 3;
            } else {
                // don't know what you are
                return false;
            }
        };

        //returns the callback arg number if there is one (for async view use)
        getCallback = function(args) {
            return typeof args[3] === 'function' ? 3 : typeof args[2] === 'function' && 2;
        };


        $.fn.hookup = function() {
            can.view.frag(this);
            return this;
        };

        can.each([

                "prepend",

                "append",

                "after",

                "before",

                "text",

                "html",

                "replaceWith", "val"
            ], function(func) {
                convert(func);
            });

        return can;
    })(jQuery, __m18);

    // ## can/util/fixture/fixture.js
    var __m43 = (function(can) {

        // Get the URL from old Steal root, new Steal config or can.fixture.rootUrl
        var getUrl = function(url) {
            if (typeof steal !== 'undefined') {
                if (can.isFunction(steal.config)) {
                    return steal.config().root.mapJoin(url).toString();
                }
                return steal.root.join(url).toString();
            }
            return (can.fixture.rootUrl || '') + url;
        }

        var updateSettings = function(settings, originalOptions) {
            if (!can.fixture.on) {
                return;
            }

            //simple wrapper for logging
            var _logger = function(type, arr) {
                if (console.log.apply) {
                    Function.prototype.call.apply(console[type], [console].concat(arr));
                    // console[type].apply(console, arr)
                } else {
                    console[type](arr)
                }
            },
                log = function() {
                    if (typeof steal !== 'undefined' && steal.dev) {
                        steal.dev.log('fixture INFO: ' + Array.prototype.slice.call(arguments).join(' '));
                    }
                }

                // We always need the type which can also be called method, default to GET
            settings.type = settings.type || settings.method || 'GET';

            // add the fixture option if programmed in
            var data = overwrite(settings);

            // if we don't have a fixture, do nothing
            if (!settings.fixture) {
                if (window.location.protocol === "file:") {
                    log("ajax request to " + settings.url + ", no fixture found");
                }
                return;
            }

            //if referencing something else, update the fixture option
            if (typeof settings.fixture === "string" && can.fixture[settings.fixture]) {
                settings.fixture = can.fixture[settings.fixture];
            }

            // if a string, we just point to the right url
            if (typeof settings.fixture == "string") {
                var url = settings.fixture;

                if (/^\/\//.test(url)) {
                    // this lets us use rootUrl w/o having steal...
                    url = getUrl(settings.fixture.substr(2));
                }

                if (data) {
                    // Template static fixture URLs
                    url = can.sub(url, data);
                }

                delete settings.fixture;



                settings.url = url;
                settings.data = null;
                settings.type = "GET";
                if (!settings.error) {
                    settings.error = function(xhr, error, message) {
                        throw "fixtures.js Error " + error + " " + message;
                    };
                }
            } else {


                //it's a function ... add the fixture datatype so our fixture transport handles it
                // TODO: make everything go here for timing and other fun stuff
                // add to settings data from fixture ...
                settings.dataTypes && settings.dataTypes.splice(0, 0, "fixture");

                if (data && originalOptions) {
                    can.extend(originalOptions.data, data)
                }
            }
        },
            // A helper function that takes what's called with response
            // and moves some common args around to make it easier to call
            extractResponse = function(status, statusText, responses, headers) {
                // if we get response(RESPONSES, HEADERS)
                if (typeof status != "number") {
                    headers = statusText;
                    responses = status;
                    statusText = "success"
                    status = 200;
                }
                // if we get response(200, RESPONSES, HEADERS)
                if (typeof statusText != "string") {
                    headers = responses;
                    responses = statusText;
                    statusText = "success";
                }
                if (status >= 400 && status <= 599) {
                    this.dataType = "text"
                }
                return [status, statusText, extractResponses(this, responses), headers];
            },
            // If we get data instead of responses,
            // make sure we provide a response type that matches the first datatype (typically json)
            extractResponses = function(settings, responses) {
                var next = settings.dataTypes ? settings.dataTypes[0] : (settings.dataType || 'json');
                if (!responses || !responses[next]) {
                    var tmp = {}
                    tmp[next] = responses;
                    responses = tmp;
                }
                return responses;
            };

        //used to check urls
        // check if jQuery
        if (can.ajaxPrefilter && can.ajaxTransport) {

            // the pre-filter needs to re-route the url
            can.ajaxPrefilter(updateSettings);

            can.ajaxTransport("fixture", function(s, original) {
                // remove the fixture from the datatype
                s.dataTypes.shift();

                //we'll return the result of the next data type
                var timeout, stopped = false;

                return {
                    send: function(headers, callback) {
                        // we'll immediately wait the delay time for all fixtures
                        timeout = setTimeout(function() {
                            // if the user wants to call success on their own, we allow it ...
                            var success = function() {
                                if (stopped === false) {
                                    callback.apply(null, extractResponse.apply(s, arguments));
                                }
                            },
                                // get the result form the fixture
                                result = s.fixture(original, success, headers, s);
                            if (result !== undefined) {
                                // make sure the result has the right dataType
                                callback(200, "success", extractResponses(s, result), {});
                            }
                        }, can.fixture.delay);
                    },
                    abort: function() {
                        stopped = true;
                        clearTimeout(timeout)
                    }
                };
            });
        } else {
            var AJAX = can.ajax;
            can.ajax = function(settings) {
                updateSettings(settings, settings);
                if (settings.fixture) {
                    var timeout, d = new can.Deferred(),
                        stopped = false;

                    //TODO this should work with response
                    d.getResponseHeader = function() {}

                    // call success and fail
                    d.then(settings.success, settings.fail);

                    // abort should stop the timeout and calling success
                    d.abort = function() {
                        clearTimeout(timeout);
                        stopped = true;
                        d.reject(d)
                    }
                    // set a timeout that simulates making a request ....
                    timeout = setTimeout(function() {
                        // if the user wants to call success on their own, we allow it ...
                        var success = function() {
                            var response = extractResponse.apply(settings, arguments),
                                status = response[0];

                            if ((status >= 200 && status < 300 || status === 304) && stopped === false) {
                                d.resolve(response[2][settings.dataType])
                            } else {
                                // TODO probably resolve better
                                d.reject(d, 'error', response[1]);
                            }
                        },
                            // get the result form the fixture
                            result = settings.fixture(settings, success, settings.headers, settings);
                        if (result !== undefined) {
                            d.resolve(result)
                        }
                    }, can.fixture.delay);

                    return d;
                } else {
                    return AJAX(settings);
                }
            }
        }

        var typeTest = /^(script|json|text|jsonp)$/,
            // a list of 'overwrite' settings object
            overwrites = [],
            // returns the index of an overwrite function
            find = function(settings, exact) {
                for (var i = 0; i < overwrites.length; i++) {
                    if ($fixture._similar(settings, overwrites[i], exact)) {
                        return i;
                    }
                }
                return -1;
            },
            // overwrites the settings fixture if an overwrite matches
            overwrite = function(settings) {
                var index = find(settings);
                if (index > -1) {
                    settings.fixture = overwrites[index].fixture;
                    return $fixture._getData(overwrites[index].url, settings.url)
                }

            },
            // Makes an attempt to guess where the id is at in the url and returns it.
            getId = function(settings) {
                var id = settings.data.id;

                if (id === undefined && typeof settings.data === "number") {
                    id = settings.data;
                }



                if (id === undefined) {
                    settings.url.replace(/\/(\d+)(\/|$|\.)/g, function(all, num) {
                        id = num;
                    });
                }

                if (id === undefined) {
                    id = settings.url.replace(/\/(\w+)(\/|$|\.)/g, function(all, num) {
                        if (num != 'update') {
                            id = num;
                        }
                    })
                }

                if (id === undefined) { // if still not set, guess a random number
                    id = Math.round(Math.random() * 1000)
                }

                return id;
            };

        var $fixture = can.fixture = function(settings, fixture) {
            // if we provide a fixture ...
            if (fixture !== undefined) {
                if (typeof settings == 'string') {
                    // handle url strings
                    var matches = settings.match(/(GET|POST|PUT|DELETE) (.+)/i);
                    if (!matches) {
                        settings = {
                            url: settings
                        };
                    } else {
                        settings = {
                            url: matches[2],
                            type: matches[1]
                        };
                    }

                }

                //handle removing.  An exact match if fixture was provided, otherwise, anything similar
                var index = find(settings, !! fixture);
                if (index > -1) {
                    overwrites.splice(index, 1)
                }
                if (fixture == null) {
                    return
                }
                settings.fixture = fixture;
                overwrites.push(settings)
            } else {
                can.each(settings, function(fixture, url) {
                    $fixture(url, fixture);
                })
            }
        };
        var replacer = can.replacer;

        can.extend(can.fixture, {
                // given ajax settings, find an overwrite
                _similar: function(settings, overwrite, exact) {
                    if (exact) {
                        return can.Object.same(settings, overwrite, {
                                fixture: null
                            })
                    } else {
                        return can.Object.subset(settings, overwrite, can.fixture._compare)
                    }
                },
                _compare: {
                    url: function(a, b) {
                        return !!$fixture._getData(b, a)
                    },
                    fixture: null,
                    type: "i"
                },
                // gets data from a url like "/todo/{id}" given "todo/5"
                _getData: function(fixtureUrl, url) {
                    var order = [],
                        fixtureUrlAdjusted = fixtureUrl.replace('.', '\\.').replace('?', '\\?'),
                        res = new RegExp(fixtureUrlAdjusted.replace(replacer, function(whole, part) {
                                    order.push(part)
                                    return "([^\/]+)"
                                }) + "$").exec(url),
                        data = {};

                    if (!res) {
                        return null;
                    }
                    res.shift();
                    can.each(order, function(name) {
                        data[name] = res.shift()
                    })
                    return data;
                },

                store: function(types, count, make, filter) {

                    var items = [], // TODO: change this to a hash
                        currentId = 0,
                        findOne = function(id) {
                            for (var i = 0; i < items.length; i++) {
                                if (id == items[i].id) {
                                    return items[i];
                                }
                            }
                        },
                        methods = {};

                    if (typeof types === "string") {
                        types = [types + "s", types]
                    } else if (!can.isArray(types)) {
                        filter = make;
                        make = count;
                        count = types;
                    }

                    // make all items
                    can.extend(methods, {

                            findAll: function(request) {
                                request = request || {}
                                //copy array of items
                                var retArr = items.slice(0);
                                request.data = request.data || {};
                                //sort using order
                                //order looks like ["age ASC","gender DESC"]
                                can.each((request.data.order || []).slice(0).reverse(), function(name) {
                                    var split = name.split(" ");
                                    retArr = retArr.sort(function(a, b) {
                                        if (split[1].toUpperCase() !== "ASC") {
                                            if (a[split[0]] < b[split[0]]) {
                                                return 1;
                                            } else if (a[split[0]] == b[split[0]]) {
                                                return 0
                                            } else {
                                                return -1;
                                            }
                                        } else {
                                            if (a[split[0]] < b[split[0]]) {
                                                return -1;
                                            } else if (a[split[0]] == b[split[0]]) {
                                                return 0
                                            } else {
                                                return 1;
                                            }
                                        }
                                    });
                                });

                                //group is just like a sort
                                can.each((request.data.group || []).slice(0).reverse(), function(name) {
                                    var split = name.split(" ");
                                    retArr = retArr.sort(function(a, b) {
                                        return a[split[0]] > b[split[0]];
                                    });
                                });

                                var offset = parseInt(request.data.offset, 10) || 0,
                                    limit = parseInt(request.data.limit, 10) || (items.length - offset),
                                    i = 0;

                                //filter results if someone added an attr like parentId
                                for (var param in request.data) {
                                    i = 0;
                                    if (request.data[param] !== undefined && // don't do this if the value of the param is null (ignore it)
                                        (param.indexOf("Id") != -1 || param.indexOf("_id") != -1)) {
                                        while (i < retArr.length) {
                                            if (request.data[param] != retArr[i][param]) {
                                                retArr.splice(i, 1);
                                            } else {
                                                i++;
                                            }
                                        }
                                    }
                                }

                                if (filter) {
                                    i = 0;
                                    while (i < retArr.length) {
                                        if (!filter(retArr[i], request)) {
                                            retArr.splice(i, 1);
                                        } else {
                                            i++;
                                        }
                                    }
                                }

                                //return data spliced with limit and offset
                                return {
                                    "count": retArr.length,
                                    "limit": request.data.limit,
                                    "offset": request.data.offset,
                                    "data": retArr.slice(offset, offset + limit)
                                };
                            },

                            findOne: function(request, response) {
                                var item = findOne(getId(request));
                                response(item ? item : undefined);
                            },

                            update: function(request, response) {
                                var id = getId(request);

                                // TODO: make it work with non-linear ids ..
                                can.extend(findOne(id), request.data);
                                response({
                                        id: getId(request)
                                    }, {
                                        location: request.url || "/" + getId(request)
                                    });
                            },

                            destroy: function(request) {
                                var id = getId(request);
                                for (var i = 0; i < items.length; i++) {
                                    if (items[i].id == id) {
                                        items.splice(i, 1);
                                        break;
                                    }
                                }

                                // TODO: make it work with non-linear ids ..
                                can.extend(findOne(id) || {}, request.data);
                                return {};
                            },

                            create: function(settings, response) {
                                var item = make(items.length, items);

                                can.extend(item, settings.data);

                                if (!item.id) {
                                    item.id = currentId++;
                                }

                                items.push(item);
                                response({
                                        id: item.id
                                    }, {
                                        location: settings.url + "/" + item.id
                                    })
                            }
                        });

                    var reset = function() {
                        items = [];
                        for (var i = 0; i < (count); i++) {
                            //call back provided make
                            var item = make(i, items);

                            if (!item.id) {
                                item.id = i;
                            }
                            currentId = Math.max(item.id + 1, currentId + 1) || items.length;
                            items.push(item);
                        }
                        if (can.isArray(types)) {
                            can.fixture["~" + types[0]] = items;
                            can.fixture["-" + types[0]] = methods.findAll;
                            can.fixture["-" + types[1]] = methods.findOne;
                            can.fixture["-" + types[1] + "Update"] = methods.update;
                            can.fixture["-" + types[1] + "Destroy"] = methods.destroy;
                            can.fixture["-" + types[1] + "Create"] = methods.create;
                        }

                    }
                    reset()
                    // if we have types given add them to can.fixture


                    return can.extend({
                            getId: getId,

                            find: function(settings) {
                                return findOne(getId(settings));
                            },

                            reset: reset
                        }, methods);
                },

                rand: function(arr, min, max) {
                    if (typeof arr == 'number') {
                        if (typeof min == 'number') {
                            return arr + Math.floor(Math.random() * (min - arr));
                        } else {
                            return Math.floor(Math.random() * arr);
                        }

                    }
                    var rand = arguments.callee;
                    // get a random set
                    if (min === undefined) {
                        return rand(arr, rand(arr.length + 1))
                    }
                    // get a random selection of arr
                    var res = [];
                    arr = arr.slice(0);
                    // set max
                    if (!max) {
                        max = min;
                    }
                    //random max
                    max = min + Math.round(rand(max - min))
                    for (var i = 0; i < max; i++) {
                        res.push(arr.splice(rand(arr.length), 1)[0])
                    }
                    return res;
                },

                xhr: function(xhr) {
                    return can.extend({}, {
                            abort: can.noop,
                            getAllResponseHeaders: function() {
                                return "";
                            },
                            getResponseHeader: function() {
                                return "";
                            },
                            open: can.noop,
                            overrideMimeType: can.noop,
                            readyState: 4,
                            responseText: "",
                            responseXML: null,
                            send: can.noop,
                            setRequestHeader: can.noop,
                            status: 200,
                            statusText: "OK"
                        }, xhr);
                },

                on: true
            });

        can.fixture.delay = 200;


        can.fixture.rootUrl = getUrl('');

        can.fixture["-handleFunction"] = function(settings) {
            if (typeof settings.fixture === "string" && can.fixture[settings.fixture]) {
                settings.fixture = can.fixture[settings.fixture];
            }
            if (typeof settings.fixture == "function") {
                setTimeout(function() {
                    if (settings.success) {
                        settings.success.apply(null, settings.fixture(settings, "success"));
                    }
                    if (settings.complete) {
                        settings.complete.apply(null, settings.fixture(settings, "complete"));
                    }
                }, can.fixture.delay);
                return true;
            }
            return false;
        };

        //Expose this for fixture debugging
        can.fixture.overwrites = overwrites;
        can.fixture.make = can.fixture.store;
        return can.fixture;
    })(__m2, __m9, __m33);

    window['can'] = __m4;
})();