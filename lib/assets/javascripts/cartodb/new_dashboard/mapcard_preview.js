/**
 *  MapCard previews
 *
 */
module.exports = cdb.core.View.extend({

  default_options: {
    width: 300,
    height: 170
  },

  initialize: function() {
    _.bindAll(this, "_onImageCallback", "_onError", "_onSuccess");

    _.defaults(this.options, this.default_options);

    this.width   = this.options.width;
    this.height  = this.options.height;
    this.$el     = this.options.el;
    this.vizjson = this.options.vizjson;
  },

  load: function() {
    this._startLoader();

    cdb.Image(this.vizjson, { https: this._isHTTPS() }).size(this.width, this.height).getUrl(this._onImageCallback);

    return this;
  },

  _isHTTPS: function() {
    return location.protocol.indexOf("https") === 0;
  },

  _startLoader: function() {
    this.$el.addClass("is-loading");
  },

  _stopLoader: function() {
    this.$el.removeClass("is-loading");
  },

  loadURL: function(url) {
    var $img = $('<img class="MapCard-preview" src="' + url + '" />');
    this.$el.append($img);
    $img.fadeIn(250);
  },

  _onSuccess: function(url) {
    this._stopLoader();

    this.loadURL(url);

    this.trigger("loaded", url);

  },

  _onError: function(error) {
    this._stopLoader();
    this.$el.addClass("has-error");
    var $error = $('<div class="MapCard-error" />');
    this.$el.append($error);
    $error.fadeIn(250);

    this.trigger("error");
  },

  _loadImage: function(error, url) {
    var self = this;
    var img  = new Image();

    img.onerror = function() {
      self._onError(error);
    };

    img.onload = function() {
      self._onSuccess(url);
    };

    try {
      img.src = url;
    }
    catch(err) {
      this._onError(err);
    }

  },

  _onImageCallback: function(error, url) {
    if (error) {
      this._onError(error);
      return
    }

    this._loadImage(error, url);
  }

});