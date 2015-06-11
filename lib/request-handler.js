var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var Users = require('../app/models/user');
var Links = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Links.find({}, function(err, links) {
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  util.processHtml(uri, function(err, siteProperties) {

      if (err) {
        console.log('Error reading URL heading: ', err);
        return res.send(404);
      }

      console.log(siteProperties);

      var link = new Links({url: uri, title: siteProperties.title, base_url: req.headers.origin, fav_icon: siteProperties.favIcon});
      link.save(function(err, link) {
        res.send(200, link);
      });

  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  Users.findOne({username: username}, function(err, user) {
    if(err) {
      console.error("Encountered Error with Users.findOne");
      res.redirect('/login');
    }
    if(!user) {
      res.redirect('/login');
    }
    else {
      user.comparePassword(password, function(match) {
      if (match) {
        util.createSession(req, res, user);
      } else {
        res.redirect('/login');
      }
    })
    }
  });
};


exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var newUsers = new Users({username: username, password: password});
  //TODO: Fix this with checking for new User and sending proper redirects

  Users.findOne({username: newUsers.username}, function(err, user) {
    if (err) {
      console.log(err)
      res.send(err);
    } else if (user) {
      console.log("Username already exists");
      res.send("Username already exists");
    } else {
      newUsers.save();
      util.createSession(req, res, newUsers); // util.createSession handles redirect
    }
  });

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           util.createSession(req, res, newUser);
  //           Users.add(newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   })
};


//TODO: Fix this
exports.navToLink = function(req, res) {

  Links.findOne({code: req.params[0]}, function(err, link) {
    if (err) {
      console.log("Error finding link in database. Unable to navigate.");
    } else if (link) {
      res.redirect(link.url);
    } else {
      console.log("No link.url");
    }
  });

  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};
