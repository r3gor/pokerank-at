import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import cfg from './config';

// Configurar la estrategia de Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: `${cfg.API_PREFIX}/auth/google/callback`
}, (accessToken, refreshToken, profile, done) => {
  // Aquí obtienes el perfil del usuario de Google
  return done(null, profile as Express.User);
}));
