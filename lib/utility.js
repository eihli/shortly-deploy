var request = require('request');
var URL = require('url');

exports.processHtml = function(url, cb) {
  var siteProperties = {};
  siteProperties['hostUrl'] = URL.parse(url).protocol + "//" + URL.parse(url).host;
  console.log("siteProperties['hostUrl']:", siteProperties['hostUrl']);


  console.log("Running processHTML on URL of:", url);
  request(url, function(err, res, html) {

    if (err) {
      console.log("Error reading url: ", err);
      return cb(err);
    }

    else {
      siteProperties['title'] = getHtmlTitle(html);

      downloadFavIcon(siteProperties['hostUrl'], function(err, icon) {
        siteProperties['favIcon'] = icon;
        return cb(err, siteProperties);
      });
    }

  });
};

var downloadFavIcon = function(url, fn) {
  console.log("downloadFavIcon called with URL of:", url);

  var favIconUrl = url + "/favicon.ico";

  request(favIconUrl, function(err, res, icon) {
    console.log("RES RESULT START! ----------------------------------------------");
    //console.log(res);
    console.log("RES RESULT END! ----------------------------------------------");
    //console.log(icon);
    if( (res.statusCode >=400) || err || !icon) {
      console.error("Error downloading FavIcon from site");
      favIconUrl = '/redirect_icon.png';
    }
    return fn(err, favIconUrl);
  });
};

var getHtmlTitle = function(html) {
  console.log("getHtmlTitle HTML to parse", html);
  var tag = /<title>(.*)<\/title>/;
  var match = html.match(tag);
  var title = match ? match[1] : "Website Title";
  return title;
};
// exports.getUrlTitle = function(url, cb) {
//   request(url, function(err, res, html) {
//     if (err) {
//       console.log('Error reading url heading: ', err);
//       return cb(err);
//     } else {
//       var tag = /<title>(.*)<\/title>/;
//       var match = html.match(tag);
//       var title = match ? match[1] : url;
//       return cb(err, title);
//     }
//   });
// };

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

exports.isValidUrl = function(url) {
  return url.match(rValidUrl);
};

exports.isLoggedIn = function(req, res) {
  return req.session ? !!req.session.user : false;
};

exports.checkUser = function(req, res, next) {
  if (!exports.isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    next();
  }
};

exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
      req.session.user = newUser;
      res.redirect('/');
    });
};
