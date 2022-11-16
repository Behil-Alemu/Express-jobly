"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/* From res.locals we can check if admin is true or false. If false throw unauthorized error else allow user to move on.
res.locals found from the header token provided
console.log(res.locals.user)
 { username: 'username', isAdmin: true, iat: 1668532874 }
 */



function ensureIsAdmin(req, res, next) {
  try {
    
    if (!res.locals.user.isAdmin) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureIsAdmin
};
