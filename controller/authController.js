
import User from '../model/User.js';
import passportLocal from '../service/passport.service.js';
import DEBUG from 'debug'


const createCookieFromToken = (user, statusCode, req, res) => {
  const token = user.generateVerificationToken();

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    token_expires: cookieOptions.expires,
    data: {
      user,
    },
  });
};

console.log("signup");
export const  signup= async (req, res, next) => {
    passportLocal.authenticate(
      'signup',{ session: false },async (err, user, info) => {
        try {
          console.log("authenticate ");
          if (err || !user) {
            const { statusCode = 400, message } = info;
            return res.status(statusCode).json({
              status: 'error',
              error: {
                message,
              },
            });
          }
          createCookieFromToken(user, 201, req, res);
        } catch (error) {
          DEBUG(error);
          throw new ApplicationError(error.statusCode, error.message);
        }
      },
    )(req, res, next);
}


export const login= async (req, res, next) => {
    passportLocal.authenticate(
      'login',{ session: false },async (err, user, info) => {
        try {
          if (err || !user) {
            let message = err;
            if (info) {
              message = info.message;
            }
            return res.status(401).json({
              status: 'error',
              error: {
                message,
              },
            });
          }
          // call req.login manually to set the session and
          // init passport correctly in serialize & deserialize
          req.logIn(user, function (error) {
            if (error) {
              return next(error);
            }
          });
          // generate a signed json web token with the contents of user
          // object and return it in the response
          createCookieFromToken(user, 200, req, res);
        } catch (error) {
          DEBUG(error);
          throw new ApplicationError(error.statusCode, error.message);
        }
      },
    )(req, res, next);
  }


export const logout=async (req, res, next) => {
    try {
    res.clearCookie('jwt');
    res.clearCookie('connect.sid');
    req.session.destroy(function (error) {
    if (error) {
        return next(error);
    }
    return res.status(200).json({
        status: 'success',
        message: 'You have successfully logged out',
    });
    });
    } catch (error) {
    DEBUG(error);
    throw new ApplicationError(error.statusCode, error.message);
    }
}




