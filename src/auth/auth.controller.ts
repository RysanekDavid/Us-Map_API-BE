import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  private readonly PASSWORD = process.env.AUTH_PASSWORD || 'vaše-tajné-heslo';
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'váš-tajný-klíč';

  @Post('login')
  async login(@Body() body: { password: string }) {
    console.log('Received password:', body.password);
    console.log('Env password:', this.PASSWORD);
    console.log('Password match:', body.password === this.PASSWORD);

    if (body.password !== this.PASSWORD) {
      throw new UnauthorizedException('Nesprávné heslo');
    }

    const token = jwt.sign({}, this.JWT_SECRET, { expiresIn: '24h' });
    return { token };
  }
}
