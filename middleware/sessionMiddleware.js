// sessionMiddleware.js
import session from 'express-session';

console.log("sessionMiddleware ");
const sessionMiddleware = session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
});

export default sessionMiddleware;
