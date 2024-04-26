import { Body, Controller, Delete, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { SignInDto, SignUpDto, signInSchema, signUpSchema } from 'src/libs';
import { ZodValidationPipe } from 'src/libs/pipes';
import { COOKIE_TOKEN } from 'src/libssss/constants';
import { Public } from 'src/libssss/decorators';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body(new ZodValidationPipe(signUpSchema)) dto: SignUpDto,
  ) {
    const { member, token } = await this.authService.signUp(dto);

    res.cookie('token', token, { httpOnly: true, secure: true });

    return member;
  }

  @Public()
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body(new ZodValidationPipe(signInSchema)) dto: SignInDto,
  ) {
    const { member, token } = await this.authService.signIn(dto);

    res.cookie(COOKIE_TOKEN, token, { httpOnly: true, secure: true });

    return member;
  }

  @Delete('sign-out')
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_TOKEN);
  }
}
