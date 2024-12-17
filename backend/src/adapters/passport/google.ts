import passport from "passport";
import { PassportStrategyPort } from "../../ports/passport";
import { Strategy } from 'passport-google-oauth20';
import { UserServicePort } from "../../ports/services";
import cfg from "../../config/config";

export class GooglePassport implements PassportStrategyPort {
  name: string;

  constructor(
    private userService: UserServicePort,
    private config: {
      clientID: string,
      clientSecret: string,
    }
  ) {

    this.name = 'google';
    passport.use(
      new Strategy({ 
        clientID: this.config.clientID,
        clientSecret: this.config.clientSecret,
        callbackURL: `${cfg.API_URL}${cfg.API_PREFIX}/auth/${this.name}/callback`,
      }, 
        async (accessToken, refreshToken, profile, done) => {
          const userDB = await this.userService.getUserByIdProvider(profile.id, 'goog'); //FIXME: harcode

          const user = userDB || {
            oauthId: profile?.id,
            role: 'us',
            email: profile?.emails![0]?.value || '',
            provider: 'gogl', // FIXME: hardcode
            username: profile.displayName,
          }

          console.log("passport-google-oauth20", {
            profile, user, userDB
          })

          return done(null, user);
        }));
  }

  handleAuth() {
    return passport.authenticate('google', { scope: ['profile', 'email'] });
  }

  handleRedirect() {
    return passport.authenticate('google', { session: false });
  }
}
