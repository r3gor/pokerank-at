import * as ports from '../ports';
import jwt from 'jsonwebtoken';

export class JWTService implements ports.JWTServicePort {
  constructor(
    private secretKey: string,
    private expiresIn: string,
  ) {
  }

  sign(payload: any): string {
    return jwt.sign(
      payload, 
      this.secretKey,
      { expiresIn: this.expiresIn },
    );
  }

  verify(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretKey, (err, decoded) => {
        if (err) {
          return resolve(false);
        }
        return resolve(decoded);
      })
    })
  }
}
