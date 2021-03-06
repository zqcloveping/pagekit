/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	module.exports = {

	    data: function () {
	        return _.merge({}, window.$data);
	    },

	    created: function () {

	        var sections = [], type = _.kebabCase(this.widget.type), active;

	        _.forIn(this.$options.components, function (component, name) {

	            var options = component.options || {};

	            if (options.section) {
	                sections.push(_.extend({name: name, priority: 0}, options.section));
	            }

	        });

	        sections = _.sortBy(sections.filter(function (section) {

	            active = section.name.match('(.+):(.+)');

	            if (active === null) {
	                return !_.find(sections, {name: type + ':' + section.name});
	            }

	            return active[1] == type;
	        }, this), 'priority');

	        this.$set('sections', sections);

	    },

	    ready: function () {

	        UIkit.tab(this.$$.tab, {connect: this.$$.content});
	        // this.$set('widget.data', _.defaults({}, this.widget.data, this.type.defaults));

	        // set position from get param
	        if (!this.widget.id) {
	            var match = new RegExp('[?&]position=([^&]*)').exec(location.search);
	            this.widget.position = (match && decodeURIComponent(match[1].replace(/\+/g, ' '))) || '';
	        }
	    },

	    computed: {

	        positionOptions: function () {
	            return _.map(this.config.positions, function (position) {
	                return {text: this.$trans(position.label), value: position.name};
	            }, this);
	        }

	    },

	    methods: {

	        save: function (e) {
	            e.preventDefault();

	            this.$broadcast('save', {widget: this.widget});
	            this.$resource('api/site/widget/:id').save({id: this.widget.id}, {widget: this.widget}, function (data) {
	                this.$dispatch('saved');

	                if (!this.widget.id) {
	                    window.history.replaceState({}, '', this.$url.route('admin/site/widget/edit', {id: data.widget.id}));
	                }

	                this.$set('widget', data.widget);

	                this.$notify('Widget saved.');
	            }, function (data) {
	                this.$notify(data, 'danger');
	            });
	        },

	        cancel: function (e) {
	            e.preventDefault();

	            this.$dispatch('cancel');
	        }

	    },

	    mixins: [window.Widgets]

	};

	jQuery(function () {

	    (new Vue(module.exports)).$mount('#widget-edit');

	});


/***/ }
/******/ ]);