import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly generateTokenProvider: GenerateTokensProvider,
  ) {}

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      console.log(refreshTokenDto, this.jwtConfiguration.audience);
      // verify the refresh token using jwtService
      const { userId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'userId'>
      >(refreshTokenDto.refreshToken, {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
      });

      // fetch user from database
      const user = await this.userService.findOneById(userId);
      console.log(user);
      if (!user) {
        throw new UnauthorizedException();
      }

      // generate the tokens
      const tokens = await this.generateTokenProvider.generateTokens(user);

      return { ...tokens, userCode: user.userCode, userRole: user.role };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }
}
