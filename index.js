
/**
 * Module dependencies.
 */

/**
 * Set or get cookie `name` with `value` and `options` object.
 *
 * @param {String} name
 * @param {String} value
 * @param {Object} options
 * @return {Mixed}
 * @api public
 */

module.exports = function (name, value, options) {
  switch (arguments.length) {
    case 3:
    case 2:
      return set(name, value, options);
    case 1:
      return get(name);
    default:
      return all();
  }
};

/**
 * Set cookie `name` to `value`.
 *
 * @param {String} name
 * @param {String} value
 * @param {Object} options
 * @api private
 */

function set(name, value, options) {
  options = options || {};
  var str = encode(name) + '=' + encode(value);

  if (null == value) options['max-age'] = -1;

  if (options['max-age']) {
    options.expires = new Date(+new Date + options['max-age']);
  }

  if (options.path) str += '; path=' + options.path;
  if (options.domain) str += '; domain=' + options.domain;
  if (options.expires) str += '; expires=' + options.expires.toUTCString();
  if (options.secure) str += '; secure';
  if (options.sameSite) str += '; samesite=' + options.sameSite;

  document.cookie = str;
}

/**
 * Return all cookies.
 *
 * @return {Object}
 * @api private
 */

function all() {
  return parse(document.cookie);
}

/**
 * Get cookie `name`.
 *
 * @param {String} name
 * @return {String}
 * @api private
 */

function get(name) {
  return all()[name];
}

/**
 * Parse cookie `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parse(str) {
  var obj = {};
  var pairs = str.split(/ *; */);
  var pair;
  if ('' == pairs[0]) return obj;
  for (var i = 0; i < pairs.length; ++i) {
    pair = pairs[i].split('=');

    // karteに関係するcookieのみデコードする
    if (isKarteRelatedCookieKey(pair[0])) {
      try {
        obj[decode(pair[0])] = decode(pair[1]);
      } catch (e) {
        console.warn('error `parse(' + value + ')` - ' + e)
      }
    }
  }
  return obj;
}

/**
 * Encode.
 */

function encode(value) {
  try {
    return encodeURIComponent(value);
  } catch (e) {
    console.warn('error `encode(' + value + ')` - ' + e)
  }
}

/**
 * Decode.
 */

function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    console.warn('error `decode(' + value + ')` - ' + e)
  }
}

/**
 * Returns whether a cookie key related to karte or not.
 *
 * @param {String} cookieKey
 * @return {Boolean} 
 * @api private
 */

function isKarteRelatedCookieKey(cookieKey) {
  if (!cookieKey) {
    return false;
  }

  if (cookieKey.substr(0, 'krt'.length) === 'krt' ||
    cookieKey.substr(0, 'ktid'.length) === 'ktid' ||
    cookieKey.substr(0, '__pck__'.length) === '__pck__' ||
    cookieKey.substr(0, 'test'.length) === 'test') {

    return true;
  }
  return false;
}
