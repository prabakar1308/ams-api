import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/auth/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.contants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the request from execution context
    const request: Request = context.switchToHttp().getRequest<Request>();
    // Extract the token from header
    const token = this.extractRequestFromHeader(request);
    // Validate the token
    if (!token) throw new UnauthorizedException('Bearer Token not found');

    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token, this.jwtConfiguration);
      // Use the payload if necessary, e.g., attach it to the request object
      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
    return true;
  }

  private extractRequestFromHeader(request: Request) {
    const token = request.headers.authorization?.split(' ')[1] ?? undefined;
    return token;
  }
}
