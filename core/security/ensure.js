// ensure.js
// =========
// ensure authentication

//  Simple route middleware to ensure user is authenticated.
//  Use this route middleware on any resource that needs to be protected.  If
//  the request is authenticated (typically via a persistent login session),
//  the request will proceed.  Otherwise, the user will be redirected to the
//  login page.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(/*"test text*/); }
	// console.log(req.path);
	res.redirect('/login')
}

module.exports = ensureAuthenticated