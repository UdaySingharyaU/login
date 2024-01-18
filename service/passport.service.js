import passport from 'passport';
import { Strategy } from 'passport-local';
import User from '../model/User.js';
import DEBUG from 'debug';

const authFields = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
};

passport.use(
    'signup',
    new Strategy(authFields, async (req, email, password, cb) => {
      console.log("localstrategysignup");
      try {
        const checkEmail = await User.checkExistingField('email', email);
  
        if (checkEmail) {
          return cb(null, false, {
            statusCode: 409,
            message: 'Email already registered, log in instead',
          });
        }  
        const checkUserName = await User.checkExistingField(
          'username',
          req.body.username,
        );
        if (checkUserName) {
          return cb(null, false, {
            statusCode: 409,
            message: 'Username exists, please try another',
          });
        }
        const newUser = new User();
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        newUser.username = req.body.username;
        newUser.fullName = req.body.fullName;
        newUser.role = req.body.role;
        await newUser.save();
  
        return cb(null, newUser);
      } catch (err) {
        DEBUG(err);
        return cb(null, false, { statusCode: 400, message: err.message });
      }
    }),
  );
  

passport.use(
    'login',
    new Strategy(async (username, password, done) => {
        try {
        const user = await User.findOne({ username });

        if (!user) {
            return done(null, false, { message: 'Invalid username' });
        }

        const isValidPassword = await user.isValidPassword(password);

        if (!isValidPassword) {
            return done(null, false, { message: 'Invalid password' });
        }

        return done(null, user);
        } catch (error) {
        return done(error);
        }
    })
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
export default passport;