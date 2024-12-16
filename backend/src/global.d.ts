import { User as DomainUser } from '@domain/user';

declare global {
  namespace Express {
    interface User extends DomainUser {}
  }
}
