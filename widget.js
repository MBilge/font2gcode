/* global requirejs cprequire cpdefine chilipeppr THREE */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
    }
});

cprequire_test(["inline:com-zipwhip-widget-font2gcode"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    // Please note that if you are working on multiple widgets at the same time
    // you may need to use the ?forcerefresh=true technique in the URL of
    // your test widget to force the underlying chilipeppr.load() statements
    // to referesh the cache. For example, if you are working on an Add-On
    // widget to the Eagle BRD widget, but also working on the Eagle BRD widget
    // at the same time you will have to make ample use of this technique to
    // get changes to load correctly. If you keep wondering why you're not seeing
    // your changes, try ?forcerefresh=true as a get parameter in your URL.

    console.log("test running of " + myWidget.id);

    
    
    // load 3dviewer
    // have to tweak our own widget to get it above the 3dviewer
    $('#' + myWidget.id).css('position', 'relative');
    //$('#' + myWidget.id).css('background', 'none');
    $('#' + myWidget.id).css('width', '320px');
    $('body').prepend('<div id="3dviewer"></div>');
    chilipeppr.load(
      "#3dviewer",
      "http://raw.githubusercontent.com/chilipeppr/widget-3dviewer/master/auto-generated-widget.html",
      function() {
        cprequire(['inline:com-chilipeppr-widget-3dviewer'], function (threed) {
            threed.init({
                doMyOwnDragDrop: false
            });
            
            // hide toolbar for room
            $('#com-chilipeppr-widget-3dviewer .panel-heading').addClass("hidden");
            
            // only init eagle widget once 3d is loaded
            // init my widget
            myWidget.init();
        });
    });

    // load flash message
    $('body').prepend('<div id="testDivForFlashMessageWidget"></div>');
    chilipeppr.load(
        "#testDivForFlashMessageWidget",
        "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        }
    );
    
    $('#' + myWidget.id).css('margin', '20px');
    $('title').html(myWidget.name);
    // $('#' + myWidget.id).css('background', 'none');

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-zipwhip-widget-font2gcode", ["chilipeppr_ready", /* other dependencies here */ ], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-zipwhip-widget-font2gcode", // Make the id the same as the cpdefine id
        name: "Widget / Font2Gcode", // The descriptive name of your widget.
        desc: "This widget lets you type text, render it into the 3D viewer, and then generate the gcode for the font. If you want to mill/laser/print text this is a great way to do it programmatically.",
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            //'/onExampleGenerate': 'Example: Publish this signal when we go to generate gcode.'
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
            "/com-chilipeppr-widget-3dviewer/request3dObject" : "This gives us back the 3d object from the 3d viewer so we can add Three.js objects to it."
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
            "/com-chilipeppr-widget-3dviewer/recv3dObject" : "By subscribing to this we get the callback when we /request3dObject and thus we can grab the reference to the 3d object from the 3d viewer and do things like addScene() to it with our Three.js objects."
        },
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function() {
            console.log("I am being initted. Thanks.");

            this.setupUiFromLocalStorage();

            this.init3d();
            
            this.btnSetup();
            this.forkSetup();

            console.log("I am done being initted.");
        },
        /**
         * Try to get a reference to the 3D viewer.
         */
        init3d: function () {
            this.get3dObj();
            if (this.obj3d == null) {
                console.log("loading 3d scene failed, try again in 1 second");
                var attempts = 1;
                var that = this;
                setTimeout(function () {
                    that.get3dObj();
                    if (that.obj3d == null) {
                        attempts++;
                        setTimeout(function () {
                            that.get3dObj();
                            if (that.obj3d == null) {
                                console.log("giving up on trying to get 3d");
                            } else {
                                console.log("succeeded on getting 3d after attempts:", attempts);
                                that.onInit3dSuccess();
                            }
                        }, 5000);
                    } else {
                        console.log("succeeded on getting 3d after attempts:", attempts);
                        that.onInit3dSuccess();
                    }
                }, 1000);
            } else {
                this.onInit3dSuccess();
            }

        },
        /**
         * Call this method from init to setup all the buttons when this widget
         * is first loaded. This basically attaches click events to your 
         * buttons. It also turns on all the bootstrap popovers by scanning
         * the entire DOM of the widget.
         */
        btnSetup: function() {

            // Chevron hide/show body
            var that = this;
            $('#' + this.id + ' .hidebody').click(function(evt) {
                console.log("hide/unhide body");
                if ($('#' + that.id + ' .panel-body').hasClass('hidden')) {
                    // it's hidden, unhide
                    that.showBody(evt);
                }
                else {
                    // hide
                    that.hideBody(evt);
                }
            });

            // Ask bootstrap to scan all the buttons in the widget to turn
            // on popover menus
            $('#' + this.id + ' .btn').popover({
                delay: 1000,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: 'body'
            });

            // Init Say Hello Button on Main Toolbar
            // We are inlining an anonymous method as the callback here
            // as opposed to a full callback method in the Hello Word 2
            // example further below. Notice we have to use "that" so 
            // that the this is set correctly inside the anonymous method
            $('#' + this.id + ' .btn-sayhello').click(function() {
                console.log("saying hello");
                // Make sure popover is immediately hidden
                $('#' + that.id + ' .btn-sayhello').popover("hide");
                // Show a flash msg
                chilipeppr.publish(
                    "/com-chilipeppr-elem-flashmsg/flashmsg",
                    "Hello Title",
                    "Hello World from widget " + that.id,
                    1000
                );
            });

            // Init Hello World 2 button on Tab 1. Notice the use
            // of the slick .bind(this) technique to correctly set "this"
            // when the callback is called
            $('#' + this.id + ' .btn-helloworld2').click(this.onHelloBtnClick.bind(this));

            // render
            $('#' + this.id + ' .btn-render').click(this.onRender.bind(this));

            // on change
            $('#' + this.id + ' input').change(this.onChange.bind(this));
            $('#' + this.id + ' select').change(this.onChange.bind(this));
        },
        isChanging: false,
        onChange: function() {
            if (this.isChanging) {
                console.warn("another change is in process");
                return;
            } else {
                this.isChanging = true;
                var that = this;
                this.onRender(function() {
                    that.isChanging = false;
                });
            }
        },
        onRender: function(callback) {
            
            // remove text3d from the 3d viewer
            this.sceneRemoveMySceneGroup();
            
            // need this to force garbage collection cuz three.js
            // hangs onto geometry
            this.sceneDisposeMySceneGroup();
            
            // get the user settings from the UI
            this.getSettings();
            
            var that = this;
            
            // actually render the text
            this.drawText(function() {
                
                that.generateGcode();
                
                if (callback) callback();
            });    
        },
        getSettings: function() {
            // get text
            this.options["text"] = $('#' + this.id + ' .input-text').val();
            this.options["height"] = $('#' + this.id + ' .input-height').val();
            this.options["fontName"] = $('#' + this.id + ' .input-font').val();
            this.options["fontWeight"] =  $('#' + this.id + ' input[name=com-chilipeppr-widget-font2gcode-fontweight]:checked').val();
            this.options["align"] = $('#' + this.id + ' input[name=com-chilipeppr-widget-font2gcode-align]:checked').val();
            this.options["holes"] = $('#' + this.id + ' .input-holes').is(":checked");
            this.options["cut"] = $('#' + this.id + ' input[name=com-chilipeppr-widget-font2gcode-cut]:checked').val();
            this.options["dashPercent"] = $('#' + this.id + ' .input-dashPercent').val();
            this.options["mode"] = $('#' + this.id + ' input[name=com-chilipeppr-widget-font2gcode-mode]:checked').val();
            this.options["laseron"] = $('#' + this.id + ' input[name=com-chilipeppr-widget-font2gcode-laseron]:checked').val();
            this.options["feedrate"] = $('#' + this.id + ' .input-feedrate').val();
            console.log("settings:", this.options);    
            
            if (this.options.mode == "laser") {
                 $('#' + this.id + ' .mode-laser').removeClass("hidden");
                 
            } else {
                $('#' + this.id + ' .mode-laser').addClass("hidden");
            }
            
            this.saveOptionsLocalStorage();
        },
        /**
         * Iterate over the text3d that was generated and create
         * Gcode to mill/cut the three.js object.
         */
        generateGcode: function() {
            
            var g = "(Gcode generated by ChiliPeppr Font2Gcode Widget)\n";
            g += "(Text: " + this.mySceneGroup.userData.text  + ")\n";
            g += "G21 (mm)\n";
            
            // get the THREE.Group() that is the txt3d
            var grp = this.mySceneGroup;
            var txtGrp = this.mySceneGroup.children[0];

            var that = this;
            grp.traverse( function(child) {
                if (child.type == "Line") {
                    // let's create gcode for all points in line
                    for (var i in child.geometry.vertices) {
                        var localPt = child.geometry.vertices[i];
                        var worldPt = grp.localToWorld(localPt);
                        if (i == 0) {
                            // first point in line where we start lasering
                            // move to poing
                            g += "G0 X" + worldPt.x.toFixed(3) + 
                                " Y" + worldPt.y.toFixed(3) + "\n";
                            // set feedrate for subsequent G1 moves
                            //g += "F" + that.options.feedrate + "\n";
                        }
                        else {
                            g += that.options.laseron + " (laser on)\n";
                            g += "G1 F" + that.options.feedrate + 
                                " X" + worldPt.x.toFixed(3) + 
                                " Y" + worldPt.y.toFixed(3) + "\n";
                        }
                    }
                    
                    // turn off laser at end of line
                    if (that.options.laseron == "M3")
                        g += "M6 (laser off)\n";
                    else
                        g += "M9 (laser off)\n";
                }
            });
            
            
            
            console.log("gcode:", g);
            $('#' + this.id + " .gcode").val(g);
        },
        /**
         * Draw the text to the 3D viewer based on the user settings
         * in the widget.
         */
        drawText: function(callback) {
            console.log("doing drawText");
            
            var that = this;
            
            //var txt = "313-554-7502";
            var txt = this.options.text;
            var settings = {
                size: this.options.height,
                fontName: this.options.fontName,
                fontWeight:  this.options.fontWeight, //"regular", //"bold",
                holes: this.options.holes, //true, // don't generate hole paths cuz they'll get cut pointlessly
                align: this.options.align, // "center", // left or center
                dashed: this.options.cut == "dashed" ? true : false,
                dashPercent: this.options.dashPercent,
            };
            
            this.createText(txt, settings, function(txt3d) {
                console.log("text is created. txt3d:", txt3d);
                txt3d.userData["text"] = txt;
                txt3d.userData["settings"] = settings;
                that.mySceneGroup = txt3d;
                that.sceneReAddMySceneGroup();
                //chilipeppr.publish('/com-chilipeppr-widget-3dviewer/viewextents' );
                if (callback) callback();
            })
        },
        /**
         * Create text in Three.js.<br>
         * Params: createText(text, options)<br>
         *   text - The text you want to render<br>
         *   options - a set of options to tweak the rendering<br><pre>
         *      {
         *        fontName : String. helvetiker, optimer, gentilis, droid sans, droid serif
         *        fontWeight: String. regular, bold
                  size: Float. Size of the text.
                  align: String. "left", "center"
                  holes: Boolean. Whether to generate hole paths or not, like middle of a zero.
                  dashed: Boolean. If true then every other line is rendered in wireframe, rather than solid lines.
                  curveSegments: Integer. Number of points on the curves. Default is 12.
                }</pre>
        **/
        createText: function(text, options, callback) {
            
            // taken from http://threejs.org/examples/webgl_geometry_text.html
            var fontMap = {

				"helvetiker": 0,
				"optimer": 1,
				"gentilis": 2,
				"droid/droid_sans": 3,
				"droid/droid_serif": 4

			};

			var weightMap = {

				"regular": 0,
				"bold": 1

			};
            
            // figure out defaults and overrides
            var opts = {

                font: null,
                
				size: options.size ? options.size : 20,
				height: options.height ? options.height : 10,
				curveSegments: options.curveSegments ? options.curveSegments : 4,

                holes: options.holes ? true : false,
                align: options.align ? options.align : "left",
                dashed: options.dashed ? options.dashed : false,
                dashPercent : options.dashPercent ? options.dashPercent : 20,
				// bevelThickness: options.bevelThickness ? options.bevelThickness : 2,
				// bevelSize: options.bevelSize ? options.bevelSize : 1.5,
				// bevelEnabled: options.bevelEnabled ? options.bevelEnabled : false,

                // mirror: options.mirror ? options.mirror : false,
                
				//material: 0,
				//extrudeMaterial: 1

			}
			//console.log("opts:", opts);
            
            var fontOpts = {
                fontName : options.fontName ? options.fontName : "helvetiker",
                fontWeight : options.fontWeight ? options.fontWeight : "regular",
            }
            //console.log("fontOpts:", fontOpts);
            
            this.loadFont(fontOpts, function(font) {
                    
                // we have our font loaded, now we can render
                opts.font = font;
                
                var group = new THREE.Group();
    			//group.position.y = 100;
                
                //console.log("final opts to render text with:", opts);
    			//var textGeo = new THREE.TextGeometry( text, opts );
    			
    			//var font = opts.font;

            	if ( font instanceof THREE.Font === false ) {
            
            		console.error( 'THREE.TextGeometry: font parameter is not an instance of THREE.Font.' );
            		//return new THREE.Geometry();
                    return;
            	}
            
            	var shapes = font.generateShapes( text, opts.size, opts.curveSegments );
                //console.log("shapes:", shapes);
                //var textGeo = new THREE.ShapeGeometry( shapes );
                //console.log("textGeo:", textGeo);
                
                var material = new THREE.LineBasicMaterial({
                	color: 0x0000ff
                });

                var textGroup = new THREE.Group();
                
                // if the user chose dashed, how big should the dashes
                // be cuz we sample the shape at that percent to create
                // a point
				var percentOfFontHeight = opts.dashPercent;

                // loop thru each shape and generate a line object
                for (var i in shapes) {
                    
                    var shape = shapes[i];
                    //console.log("shape:", shape, "length:", shape.getLength());
                    
                    var charGroup = new THREE.Group();
                    
                    // lines
    				shape.autoClose = true;
    				var points = shape.createPointsGeometry();
    				//console.log("points:", points);
    				
    				if (opts.dashed) {
    				    
    				    // figure out how many points to generate
    				    var ptCnt = shape.getLength() / (opts.size / percentOfFontHeight);
    				    //console.log("ptCnt:", ptCnt);
    				    shape.autoClose = false;
    				    var spacedPoints = shape.createSpacedPointsGeometry( ptCnt );
    				    console.log("spacedPoints", spacedPoints);
    				    
    				    // we need to generate a ton of lines
    				    // rather than one ongoing line
    				    var isFirst = true;
    				    var mypointsGeo = new THREE.Geometry();
    				        
    				    for (var iv in spacedPoints.vertices) {
    				        var pt = spacedPoints.vertices[iv];
    				        //console.log("pt:", pt, "isFirst:", isFirst, "mypointsGeo:", mypointsGeo);
    				        
    				        if (isFirst) {
    				            // first point, start the line
    				            mypointsGeo = new THREE.Geometry(); // reset array to empty
    				            mypointsGeo.vertices[0] = pt;
        				        isFirst = false;
    				        } else {
    				            // is second point, finish the line
    				            mypointsGeo.vertices[1] = pt;
    				            var line = new THREE.Line( mypointsGeo, material );
    				            charGroup.add( line );
    				            isFirst = true;
    				        }
    				        //console.log("working on point:", pt);
    				    }
    				    //charGroup.add( line );
    				    
    				    var particles = new THREE.Points( spacedPoints, new THREE.PointsMaterial( { color: 0xff0000, size: opts.size / 10 } ) );
    				    particles.position.z = 1;
    				    //charGroup.add(particles);
    				    
    				} else {
        				// solid line
        				var line = new THREE.Line( points, material );
        				charGroup.add( line );
    				}
    				charGroup.userData["character"] = text[i];
    				charGroup.userData["characterIndex"] = i;
    				charGroup.userData["fromText"] = text;
    				
    				
    				// see if there are holes
    				if (opts.holes) {
        				for (var i2 in shape.holes) {
        				    var shape = shape.holes[i2];
        				    shape.autoClose = true;
            				var points = shape.createPointsGeometry();
            				
            				if (opts.dashed) {
            				    // we need to generate a ton of lines
            				    // rather than one ongoing line
            				    //console.log("not implemented dashed holes yet");
            				    
            				    var ptCnt = shape.getLength() / (opts.size / percentOfFontHeight);
            				    //console.log("ptCnt:", ptCnt);
            				    shape.autoClose = false;
            				    var spacedPoints = shape.createSpacedPointsGeometry( ptCnt );
            				    //console.log("spacedPoints", spacedPoints);
            				    
            				    // we need to generate a ton of lines
            				    // rather than one ongoing line
            				    var isFirst = true;
            				    var mypointsGeo = new THREE.Geometry();
            				        
            				    for (var iv in spacedPoints.vertices) {
            				        var pt = spacedPoints.vertices[iv];
            				        //console.log("pt:", pt, "isFirst:", isFirst, "mypointsGeo:", mypointsGeo);
            				        
            				        if (isFirst) {
            				            // first point, start the line
            				            mypointsGeo = new THREE.Geometry(); // reset array to empty
            				            mypointsGeo.vertices[0] = pt;
                				        isFirst = false;
            				        } else {
            				            // is second point, finish the line
            				            mypointsGeo.vertices[1] = pt;
            				            var line = new THREE.Line( mypointsGeo, material );
            				            charGroup.add( line );
            				            isFirst = true;
            				        }
            				        //console.log("working on point:", pt);
            				    }
            				    
            				    var particles = new THREE.Points( spacedPoints, new THREE.PointsMaterial( { color: 0xff0000, size: opts.size / 10 } ) );
            				    particles.position.z = 1;
            				    //charGroup.add(particles);
            				    
            				} else {
            				    // solid line
            				    var line = new THREE.Line( points, material );
                				line.userData["isHole"] = true;
            				    charGroup.add( line );
            				}

        				    //console.log("got hole. generating line.")
        				}
    				}

                    //console.log("charGroup:", charGroup);
    				
    				textGroup.add( charGroup );
                    
                }
				
				if (opts.align == "center") {
    				var bbox = new THREE.Box3().setFromObject(textGroup);
    				
        			var centerOffset = -0.5 * ( bbox.max.x - bbox.min.x );
        
                    // y position of text
                    var hover = 0;
                    
        			textGroup.position.x = centerOffset;
        			textGroup.position.y = hover;
        			textGroup.position.z = 0;
				} else if (opts.align == "right") {
				    var bbox = new THREE.Box3().setFromObject(textGroup);
    				
        			var rightOffset = -1 * ( bbox.max.x - bbox.min.x );
        
                    // y position of text
                    var hover = 0;
                    
        			textGroup.position.x = rightOffset;
        			textGroup.position.y = hover;
        			textGroup.position.z = 0;
				}
				
    			textGroup.rotation.x = 0;
    			textGroup.rotation.y = Math.PI * 2;
                
				//console.log("textGroup:", textGroup);

    			group.add( textGroup );
    
    			// call the user's callback with our final three.js object
    			callback(group);

                    
            });

		},
		fontLoaded: {},
		loadFont: function(fontOpts, callback) {

            //console.log("THREE:", THREE);
			var loader = new THREE.FontLoader();
			// threejs.org/examples/fonts/helvetiker_bold.typeface.js
			// https://i2dcui.appspot.com/js/three/fonts/
			var url = '' +
			    //'https://i2dcui.appspot.com/js/three/fonts/' + 
			    'https://i2dcui.appspot.com/slingshot?url=http://threejs.org/examples/fonts/' +
			    fontOpts.fontName + '_' + 
			    fontOpts.fontWeight + '.typeface.js';

            // see if font is loaded already
            if (url in this.fontLoaded) {
                //console.warn("font already loaded. url:", url);
                callback(this.fontLoaded[url]);
            } else {
				var that = this;

    			console.log("about to get font url:", url);
    			loader.load( url, function ( response ) {
    				var font = response;
    				//console.log("loaded font:", font);
    				that.fontLoaded[url] = font;
    				callback(font);
    				//refreshText();
    			});
            }
		},
		
        onInit3dSuccess: function () {
            console.log("onInit3dSuccess. That means we finally got an object back.");
            this.clear3dViewer();
            
            // open the last file
            //var that = this;
            //setTimeout(function () {
                //that.open();
            //}, 1000);
            //this.drawtexterator();
            //this.drawText();
            this.onRender();
        },
        obj3d: null, // gets the 3dviewer obj stored in here on callback
        obj3dmeta: null, // gets metadata for 3dviewer
        userCallbackForGet3dObj: null,
        get3dObj: function (callback) {
            this.userCallbackForGet3dObj = callback;
            chilipeppr.subscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this, this.get3dObjCallback);
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/request3dObject", "");
            chilipeppr.unsubscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this.get3dObjCallback);
        },
        get3dObjCallback: function (data, meta) {
            console.log("got 3d obj:", data, meta);
            this.obj3d = data;
            this.obj3dmeta = meta;
            if (this.userCallbackForGet3dObj) {
                //setTimeout(this.userCallbackForGet3dObj.bind(this), 200);
                //console.log("going to call callback after getting back the new 3dobj. this.userCallbackForGet3dObj:", this.userCallbackForGet3dObj);
                this.userCallbackForGet3dObj();
                this.userCallbackForGet3dObj = null;
            }
        },
        is3dViewerReady: false,
        clear3dViewer: function () {
            console.log("clearing 3d viewer");
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneclear");
            //if (this.obj3d) this.obj3d.children = [];            
            /*
            this.obj3d.children.forEach(function(obj3d) {
                chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneremove", obj3d);
            });
            */
            this.is3dViewerReady = true;
            
            // this should reset the 3d viewer to resize to high dpi displays
            $(window).trigger("resize");
        },
        mySceneGroup: null,
        sceneReAddMySceneGroup: function() {
            if (this.obj3d && this.mySceneGroup) {
                this.obj3d.add(this.mySceneGroup);
            }
            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneRemoveMySceneGroup: function() {
            if (this.obj3d && this.mySceneGroup) {
                this.obj3d.remove(this.mySceneGroup);
                
            }
            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneDisposeMySceneGroup: function() {
            if (this.mySceneGroup) {
                this.mySceneGroup.traverse( function ( child ) {
                    if (child.geometry !== undefined) {
                        child.geometry.dispose();
                        child.material.dispose();
                    }
                } );    
            }
        },
        /**
         * onHelloBtnClick is an example of a button click event callback
         */
        onHelloBtnClick: function(evt) {
            console.log("saying hello 2 from btn in tab 1");
            chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Hello 2 Title",
                "Hello World 2 from Tab 1 from widget " + this.id,
                2000 /* show for 2 second */
            );
        },
        /**
         * User options are available in this property for reference by your
         * methods. If any change is made on these options, please call
         * saveOptionsLocalStorage()
         */
        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options 
            // object for your own items

            var options = localStorage.getItem(this.id + '-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            }
            else {
                options = {
                    showBody: true,
                    tabShowing: 1,
                    customParam1: null,
                    customParam2: 1.0
                };
            }

            this.options = options;
            console.log("options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-options', optionsStr);
        },
        /**
         * Show the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        showBody: function(evt) {
            $('#' + this.id + ' .panel-body').removeClass('hidden');
            $('#' + this.id + ' .panel-footer').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
        },
        /**
         * Hide the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        hideBody: function(evt) {
            $('#' + this.id + ' .panel-body').addClass('hidden');
            $('#' + this.id + ' .panel-footer').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our 
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         * 
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },

    }
});