import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'váš-tajný-klíč';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Povolíme přístup k login endpointu bez tokenu
    if (request.path === '/api/auth/login') {
      return true;
    }

    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Chybí token');
    }

    try {
      jwt.verify(token, this.JWT_SECRET);
      return true;
    } catch {
      throw new UnauthorizedException('Neplatný token');
    }
  }
}
