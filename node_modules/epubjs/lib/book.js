"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventEmitter = require("event-emitter");

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

var _core = require("./utils/core");

var _url = require("./utils/url");

var _url2 = _interopRequireDefault(_url);

var _path = require("./utils/path");

var _path2 = _interopRequireDefault(_path);

var _spine = require("./spine");

var _spine2 = _interopRequireDefault(_spine);

var _locations = require("./locations");

var _locations2 = _interopRequireDefault(_locations);

var _container = require("./container");

var _container2 = _interopRequireDefault(_container);

var _packaging = require("./packaging");

var _packaging2 = _interopRequireDefault(_packaging);

var _navigation = require("./navigation");

var _navigation2 = _interopRequireDefault(_navigation);

var _resources = require("./resources");

var _resources2 = _interopRequireDefault(_resources);

var _pagelist = require("./pagelist");

var _pagelist2 = _interopRequireDefault(_pagelist);

var _rendition = require("./rendition");

var _rendition2 = _interopRequireDefault(_rendition);

var _archive = require("./archive");

var _archive2 = _interopRequireDefault(_archive);

var _request2 = require("./utils/request");

var _request3 = _interopRequireDefault(_request2);

var _epubcfi = require("./epubcfi");

var _epubcfi2 = _interopRequireDefault(_epubcfi);

var _constants = require("./utils/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CONTAINER_PATH = "META-INF/container.xml";
var EPUBJS_VERSION = "0.3";

var INPUT_TYPE = {
	BINARY: "binary",
	BASE64: "base64",
	EPUB: "epub",
	OPF: "opf",
	MANIFEST: "json",
	DIRECTORY: "directory"
};

/**
 * An Epub representation with methods for the loading, parsing and manipulation
 * of its contents.
 * @class
 * @param {string} [url]
 * @param {object} [options]
 * @param {method} [options.requestMethod] a request function to use instead of the default
 * @param {boolean} [options.requestCredentials=undefined] send the xhr request withCredentials
 * @param {object} [options.requestHeaders=undefined] send the xhr request headers
 * @param {string} [options.encoding=binary] optional to pass 'binary' or base64' for archived Epubs
 * @param {string} [options.replacements=none] use base64, blobUrl, or none for replacing assets in archived Epubs
 * @param {method} [options.canonical] optional function to determine canonical urls for a path
 * @returns {Book}
 * @example new Book("/path/to/book.epub", {})
 * @example new Book({ replacements: "blobUrl" })
 */

var Book = function () {
	function Book(url, options) {
		var _this = this;

		_classCallCheck(this, Book);

		// Allow passing just options to the Book
		if (typeof options === "undefined" && (typeof url === "undefined" ? "undefined" : _typeof(url)) === "object") {
			options = url;
			url = undefined;
		}

		this.settings = (0, _core.extend)(this.settings || {}, {
			requestMethod: undefined,
			requestCredentials: undefined,
			requestHeaders: undefined,
			encoding: undefined,
			replacements: undefined,
			canonical: undefined
		});

		(0, _core.extend)(this.settings, options);

		// Promises
		this.opening = new _core.defer();
		/**
   * @member {promise} opened returns after the book is loaded
   * @memberof Book
   */
		this.opened = this.opening.promise;
		this.isOpen = false;

		this.loading = {
			manifest: new _core.defer(),
			spine: new _core.defer(),
			metadata: new _core.defer(),
			cover: new _core.defer(),
			navigation: new _core.defer(),
			pageList: new _core.defer(),
			resources: new _core.defer()
		};

		this.loaded = {
			manifest: this.loading.manifest.promise,
			spine: this.loading.spine.promise,
			metadata: this.loading.metadata.promise,
			cover: this.loading.cover.promise,
			navigation: this.loading.navigation.promise,
			pageList: this.loading.pageList.promise,
			resources: this.loading.resources.promise
		};

		/**
   * @member {promise} ready returns after the book is loaded and parsed
   * @memberof Book
   * @private
   */
		this.ready = Promise.all([this.loaded.manifest, this.loaded.spine, this.loaded.metadata, this.loaded.cover, this.loaded.navigation, this.loaded.resources]);

		// Queue for methods used before opening
		this.isRendered = false;
		// this._q = queue(this);

		/**
   * @member {method} request
   * @memberof Book
   * @private
   */
		this.request = this.settings.requestMethod || _request3.default;

		/**
   * @member {Spine} spine
   * @memberof Book
   */
		this.spine = new _spine2.default();

		/**
   * @member {Locations} locations
   * @memberof Book
   */
		this.locations = new _locations2.default(this.spine, this.load.bind(this));

		/**
   * @member {Navigation} navigation
   * @memberof Book
   */
		this.navigation = undefined;

		/**
   * @member {PageList} pagelist
   * @memberof Book
   */
		this.pageList = undefined;

		/**
   * @member {Url} url
   * @memberof Book
   * @private
   */
		this.url = undefined;

		/**
   * @member {Path} path
   * @memberof Book
   * @private
   */
		this.path = undefined;

		/**
   * @member {boolean} archived
   * @memberof Book
   * @private
   */
		this.archived = false;

		/**
   * @member {Archive} archive
   * @memberof Book
   * @private
   */
		this.archive = undefined;

		/**
   * @member {Resources} resources
   * @memberof Book
   * @private
   */
		this.resources = undefined;

		/**
   * @member {Rendition} rendition
   * @memberof Book
   * @private
   */
		this.rendition = undefined;

		/**
   * @member {Container} container
   * @memberof Book
   * @private
   */
		this.container = undefined;

		/**
   * @member {Packaging} packaging
   * @memberof Book
   * @private
   */
		this.packaging = undefined;

		// this.toc = undefined;

		if (url) {
			this.open(url).catch(function (error) {
				var err = new Error("Cannot load book at " + url);
				_this.emit(_constants.EVENTS.BOOK.OPEN_FAILED, err);
			});
		}
	}

	/**
  * Open a epub or url
  * @param {string | ArrayBuffer} input Url, Path or ArrayBuffer
  * @param {string} [what="binary", "base64", "epub", "opf", "json", "directory"] force opening as a certain type
  * @returns {Promise} of when the book has been loaded
  * @example book.open("/path/to/book.epub")
  */


	_createClass(Book, [{
		key: "open",
		value: function open(input, what) {
			var opening;
			var type = what || this.determineType(input);

			if (type === INPUT_TYPE.BINARY) {
				this.archived = true;
				this.url = new _url2.default("/", "");
				opening = this.openEpub(input);
			} else if (type === INPUT_TYPE.BASE64) {
				this.archived = true;
				this.url = new _url2.default("/", "");
				opening = this.openEpub(input, type);
			} else if (type === INPUT_TYPE.EPUB) {
				this.archived = true;
				this.url = new _url2.default("/", "");
				opening = this.request(input, "binary").then(this.openEpub.bind(this));
			} else if (type == INPUT_TYPE.OPF) {
				this.url = new _url2.default(input);
				opening = this.openPackaging(this.url.Path.toString());
			} else if (type == INPUT_TYPE.MANIFEST) {
				this.url = new _url2.default(input);
				opening = this.openManifest(this.url.Path.toString());
			} else {
				this.url = new _url2.default(input);
				opening = this.openContainer(CONTAINER_PATH).then(this.openPackaging.bind(this));
			}

			return opening;
		}

		/**
   * Open an archived epub
   * @private
   * @param  {binary} data
   * @param  {string} [encoding]
   * @return {Promise}
   */

	}, {
		key: "openEpub",
		value: function openEpub(data, encoding) {
			var _this2 = this;

			return this.unarchive(data, encoding || this.settings.encoding).then(function () {
				return _this2.openContainer(CONTAINER_PATH);
			}).then(function (packagePath) {
				return _this2.openPackaging(packagePath);
			});
		}

		/**
   * Open the epub container
   * @private
   * @param  {string} url
   * @return {string} packagePath
   */

	}, {
		key: "openContainer",
		value: function openContainer(url) {
			var _this3 = this;

			return this.load(url).then(function (xml) {
				_this3.container = new _container2.default(xml);
				return _this3.resolve(_this3.container.packagePath);
			});
		}

		/**
   * Open the Open Packaging Format Xml
   * @private
   * @param  {string} url
   * @return {Promise}
   */

	}, {
		key: "openPackaging",
		value: function openPackaging(url) {
			var _this4 = this;

			this.path = new _path2.default(url);
			return this.load(url).then(function (xml) {
				_this4.packaging = new _packaging2.default(xml);
				return _this4.unpack(_this4.packaging);
			});
		}

		/**
   * Open the manifest JSON
   * @private
   * @param  {string} url
   * @return {Promise}
   */

	}, {
		key: "openManifest",
		value: function openManifest(url) {
			var _this5 = this;

			this.path = new _path2.default(url);
			return this.load(url).then(function (json) {
				_this5.packaging = new _packaging2.default();
				_this5.packaging.load(json);
				return _this5.unpack(_this5.packaging);
			});
		}

		/**
   * Load a resource from the Book
   * @param  {string} path path to the resource to load
   * @return {Promise}     returns a promise with the requested resource
   */

	}, {
		key: "load",
		value: function load(path) {
			var resolved;

			if (this.archived) {
				resolved = this.resolve(path);
				return this.archive.request(resolved);
			} else {
				resolved = this.resolve(path);
				return this.request(resolved, null, this.settings.requestCredentials, this.settings.requestHeaders);
			}
		}

		/**
   * Resolve a path to it's absolute position in the Book
   * @param  {string} path
   * @param  {boolean} [absolute] force resolving the full URL
   * @return {string}          the resolved path string
   */

	}, {
		key: "resolve",
		value: function resolve(path, absolute) {
			if (!path) {
				return;
			}
			var resolved = path;
			var isAbsolute = path.indexOf("://") > -1;

			if (isAbsolute) {
				return path;
			}

			if (this.path) {
				resolved = this.path.resolve(path);
			}

			if (absolute != false && this.url) {
				resolved = this.url.resolve(resolved);
			}

			return resolved;
		}

		/**
   * Get a canonical link to a path
   * @param  {string} path
   * @return {string} the canonical path string
   */

	}, {
		key: "canonical",
		value: function canonical(path) {
			var url = path;

			if (!path) {
				return "";
			}

			if (this.settings.canonical) {
				url = this.settings.canonical(path);
			} else {
				url = this.resolve(path, true);
			}

			return url;
		}

		/**
   * Determine the type of they input passed to open
   * @private
   * @param  {string} input
   * @return {string}  binary | directory | epub | opf
   */

	}, {
		key: "determineType",
		value: function determineType(input) {
			var url;
			var path;
			var extension;

			if (this.settings.encoding === "base64") {
				return INPUT_TYPE.BASE64;
			}

			if (typeof input != "string") {
				return INPUT_TYPE.BINARY;
			}

			url = new _url2.default(input);
			path = url.path();
			extension = path.extension;

			if (!extension) {
				return INPUT_TYPE.DIRECTORY;
			}

			if (extension === "epub") {
				return INPUT_TYPE.EPUB;
			}

			if (extension === "opf") {
				return INPUT_TYPE.OPF;
			}

			if (extension === "json") {
				return INPUT_TYPE.MANIFEST;
			}
		}

		/**
   * unpack the contents of the Books packageXml
   * @private
   * @param {document} packageXml XML Document
   */

	}, {
		key: "unpack",
		value: function unpack(opf) {
			var _this6 = this;

			this.package = opf;

			this.spine.unpack(this.package, this.resolve.bind(this), this.canonical.bind(this));

			this.resources = new _resources2.default(this.package.manifest, {
				archive: this.archive,
				resolver: this.resolve.bind(this),
				request: this.request.bind(this),
				replacements: this.settings.replacements || (this.archived ? "blobUrl" : "base64")
			});

			this.loadNavigation(this.package).then(function () {
				// this.toc = this.navigation.toc;
				_this6.loading.navigation.resolve(_this6.navigation);
			});

			if (this.package.coverPath) {
				this.cover = this.resolve(this.package.coverPath);
			}
			// Resolve promises
			this.loading.manifest.resolve(this.package.manifest);
			this.loading.metadata.resolve(this.package.metadata);
			this.loading.spine.resolve(this.spine);
			this.loading.cover.resolve(this.cover);
			this.loading.resources.resolve(this.resources);
			this.loading.pageList.resolve(this.pageList);

			this.isOpen = true;

			if (this.archived || this.settings.replacements && this.settings.replacements != "none") {
				this.replacements().then(function () {
					_this6.opening.resolve(_this6);
				}).catch(function (err) {
					console.error(err);
				});
			} else {
				// Resolve book opened promise
				this.opening.resolve(this);
			}
		}

		/**
   * Load Navigation and PageList from package
   * @private
   * @param {document} opf XML Document
   */

	}, {
		key: "loadNavigation",
		value: function loadNavigation(opf) {
			var _this7 = this;

			var navPath = opf.navPath || opf.ncxPath;
			var toc = opf.toc;

			// From json manifest
			if (toc) {
				return new Promise(function (resolve, reject) {
					_this7.navigation = new _navigation2.default(toc);

					if (opf.pageList) {
						_this7.pageList = new _pagelist2.default(opf.pageList); // TODO: handle page lists from Manifest
					}

					resolve(_this7.navigation);
				});
			}

			if (!navPath) {
				return new Promise(function (resolve, reject) {
					_this7.navigation = new _navigation2.default();
					_this7.pageList = new _pagelist2.default();

					resolve(_this7.navigation);
				});
			}

			return this.load(navPath, "xml").then(function (xml) {
				_this7.navigation = new _navigation2.default(xml);
				_this7.pageList = new _pagelist2.default(xml);
				return _this7.navigation;
			});
		}

		/**
   * Gets a Section of the Book from the Spine
   * Alias for `book.spine.get`
   * @param {string} target
   * @return {Section}
   */

	}, {
		key: "section",
		value: function section(target) {
			return this.spine.get(target);
		}

		/**
   * Sugar to render a book to an element
   * @param  {element | string} element element or string to add a rendition to
   * @param  {object} [options]
   * @return {Rendition}
   */

	}, {
		key: "renderTo",
		value: function renderTo(element, options) {
			this.rendition = new _rendition2.default(this, options);
			this.rendition.attachTo(element);

			return this.rendition;
		}

		/**
   * Set if request should use withCredentials
   * @param {boolean} credentials
   */

	}, {
		key: "setRequestCredentials",
		value: function setRequestCredentials(credentials) {
			this.settings.requestCredentials = credentials;
		}

		/**
   * Set headers request should use
   * @param {object} headers
   */

	}, {
		key: "setRequestHeaders",
		value: function setRequestHeaders(headers) {
			this.settings.requestHeaders = headers;
		}

		/**
   * Unarchive a zipped epub
   * @private
   * @param  {binary} input epub data
   * @param  {string} [encoding]
   * @return {Archive}
   */

	}, {
		key: "unarchive",
		value: function unarchive(input, encoding) {
			this.archive = new _archive2.default();
			return this.archive.open(input, encoding);
		}

		/**
   * Get the cover url
   * @return {string} coverUrl
   */

	}, {
		key: "coverUrl",
		value: function coverUrl() {
			var _this8 = this;

			var retrieved = this.loaded.cover.then(function (url) {
				if (_this8.archived) {
					// return this.archive.createUrl(this.cover);
					return _this8.resources.get(_this8.cover);
				} else {
					return _this8.cover;
				}
			});

			return retrieved;
		}

		/**
   * Load replacement urls
   * @private
   * @return {Promise} completed loading urls
   */

	}, {
		key: "replacements",
		value: function replacements() {
			var _this9 = this;

			this.spine.hooks.serialize.register(function (output, section) {
				section.output = _this9.resources.substitute(output, section.url);
			});

			return this.resources.replacements().then(function () {
				return _this9.resources.replaceCss();
			});
		}

		/**
   * Find a DOM Range for a given CFI Range
   * @param  {EpubCFI} cfiRange a epub cfi range
   * @return {Range}
   */

	}, {
		key: "getRange",
		value: function getRange(cfiRange) {
			var cfi = new _epubcfi2.default(cfiRange);
			var item = this.spine.get(cfi.spinePos);
			var _request = this.load.bind(this);
			if (!item) {
				return new Promise(function (resolve, reject) {
					reject("CFI could not be found");
				});
			}
			return item.load(_request).then(function (contents) {
				var range = cfi.toRange(item.document);
				return range;
			});
		}

		/**
   * Generates the Book Key using the identifer in the manifest or other string provided
   * @param  {string} [identifier] to use instead of metadata identifier
   * @return {string} key
   */

	}, {
		key: "key",
		value: function key(identifier) {
			var ident = identifier || this.package.metadata.identifier || this.url.filename;
			return "epubjs:" + EPUBJS_VERSION + ":" + ident;
		}

		/**
   * Destroy the Book and all associated objects
   */

	}, {
		key: "destroy",
		value: function destroy() {
			this.opened = undefined;
			this.loading = undefined;
			this.loaded = undefined;
			this.ready = undefined;

			this.isOpen = false;
			this.isRendered = false;

			this.spine && this.spine.destroy();
			this.locations && this.locations.destroy();
			this.pageList && this.pageList.destroy();
			this.archive && this.archive.destroy();
			this.resources && this.resources.destroy();
			this.container && this.container.destroy();
			this.packaging && this.packaging.destroy();
			this.rendition && this.rendition.destroy();

			this.spine = undefined;
			this.locations = undefined;
			this.pageList = undefined;
			this.archive = undefined;
			this.resources = undefined;
			this.container = undefined;
			this.packaging = undefined;
			this.rendition = undefined;

			this.navigation = undefined;
			this.url = undefined;
			this.path = undefined;
			this.archived = false;
		}
	}]);

	return Book;
}();

//-- Enable binding events to book


(0, _eventEmitter2.default)(Book.prototype);

exports.default = Book;
module.exports = exports["default"];