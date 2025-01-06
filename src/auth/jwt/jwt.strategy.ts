import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService, 
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET'), 
    });
  }

  async validate(payload: { userId: string }) {
    const userData = await this.authService.findOneUserByID(payload.userId);

    if (!userData) {
      throw new InternalServerErrorException('User not found');
    }

    const { password, ...restData } = userData; 
    return restData;
  }
}
