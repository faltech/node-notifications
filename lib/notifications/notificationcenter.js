/**
 * Module dependencies.
 */
var Notification = require('./notification');


/**
 * `NotificationCenter` constructor.
 *
 * A `NotificationCenter` manages the sending and receiving of notifications
 * within an application.
 *
 * @api public
 */
function NotificationCenter() {
  this._entries = [];
};

/**
 * Adds an entry to the notification dispatch table for the specified
 * notification.
 *
 * `name` is the name of the notification for which to register the observer;
 * that is, only notifications with this name are delivered to the observer.  If
 * `name` is `null` or `undefined`, the notification center does not use a
 * notification's name when matching dispatch criteria for the observer.
 *
 * `recipient` is the object whose notifications the observer wants to receive;
 * that is, only notifications sent by this recipient are delivered to the
 * observer.  If `recipient` is `null` or `undefined`, the notification center does
 * not use a notification's recipient when matching dispatch criteria for the
 * observer.
 *
 * Examples:
 *
 *     notifications.addObserver('fooBar', function(notif) {
 *       // notifications named `fooBar` from *any* object will be delivered here
 *     });
 *
 *     notifications.addObserver(anObject, function(notif) {
 *       // notifications with *any* name from `anObject` will be delivered here
 *     });
 *
 *     notifications.addObserver('fooBar', anObject, function(notif) {
 *       // notifications named `fooBar` from `anObject` will be delivered here
 *     });
 *
 *     notifications.addObserver(function(notif) {
 *       // *all* notifications will be delivered here
 *     });
 *
 * @param {String} name
 * @param {Object} recipient
 * @param {Function} fn
 * @api public
 */
NotificationCenter.prototype.addObserver = 
NotificationCenter.prototype.on = function(name, recipient, fn) {
  if (typeof recipient == 'function') { fn = recipient, recipient = null; }
  if (typeof name == 'object' && name) { recipient = name, name = null; }
  if (typeof name == 'function') { fn = name, recipient = null, name = null; }
  this._entries.push([name, recipient, fn]);
};

/**
 * Removes all matching entries from the notification dispatch table.
 *
 * `name` is the name of the notification to remove from dispatch table.
 * Specify a notification name to remove only entries that specify this
 * notification name.  When `null` or `undefined`, the notification name is not
 * used as criteria for removal.
 *
 * `recipient` is the recipient of the notifications to remove from the dispatch
 * table.  Specify a notification recipient to remove only entries that specify
 * this recipient. When `null` or `undefined`, the notification recipient is not used
 * as criteria for removal.
 *
 * Examples:
 *     notifications.removeObserver('fooBar', anObject);
 *       // removes observerFn for notifications named `fooBar` from `anObject`
 *
 * @param {String} name
 * @param {Object} recipient
 * @api public
 */
NotificationCenter.prototype.removeObserver = function(name, recipient) {
  var matches = [];
  for (var i = 0, len = this._entries.length; i < len; i++) {
    var entry = this._entries[i];
    //if ( (entry[2] === fn) && ((entry[0] === name) || !name) && ((entry[1] === recipient) || !recipient) ) {
      if (((entry[0] === name) || !name) && (entry[1].constructor.name === recipient.constructor.name)){
      matches.push(entry);
    }
  }
  for (var i   = 0, len = matches.length; i < len; i++) {
    var idx = this._entries.indexOf(matches[i]);
    this._entries.splice(idx, 1);
  }
};

/**
 * Posts a notification with given `name`, `object`, and optional `info`.
 *
 * Any observers that match the dispatch criteria will receive the notification.
 *
 * Examples:
 *
 *     notifications.post('MyClass.interestingEvent', this);
 *
 *     notifications.post('MyClass.otherInterestingEvent', this, { foo: 'bar' });
 *
 * @param {String} name
 * @param {Object} object
 * @param {Object} info
 */
NotificationCenter.prototype.post = function(name, object, info) {
  var notification = (name instanceof Notification) ? name : new Notification(name, object, info);
  var entries = this._entries.slice(0);
  for (var i = 0, len = entries.length; i < len; i++) {
    var entry = entries[i];
    if (entry[0] === notification.name){
      entry[2].call(this, notification);
    }
  }
};


/**
 * Expose `NotificationCenter`.
 */
module.exports = NotificationCenter;
