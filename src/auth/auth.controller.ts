import { Controller, Post, UseGuards, Res, Req, BadRequestException, Body } from '@nestjs/common';
import { LocalAuthGuard } from '@/auth/local-auth.guard';
import { AuthService } from '@/auth/auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from '@/auth/Dtos/authRequest.dto';
import { User } from '@/decorators/user.decorator';
import type { IUser } from '@/users/interfaces/IUser';
import type { Response } from 'express';
import { Public } from '@/decorators/metadata';

@ApiTags('Authentications')
@Controller('auth')
export class AppController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Public()
    @Post('register')
    async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const newAccount = await this.authService.registerUser(registerDto);
        return { message: 'Registration successful', data: newAccount };
    }

    @Public()
    @UseGuards(LocalAuthGuard) // Sử dụng LocalAuthGuard để xác thực người dùng
    @ApiBody({ type: LoginDto })
    @Post('login')
    async login(@Res({ passthrough: true }) res: Response, @User() user: IUser) {
        return await this.authService.login(user, res);
    }

    @Public()
    @Post('refresh-token')
    async refreshToken(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        if (!refreshToken) {
            return { message: 'No refresh token provided', success: false };
        }
        const result = await this.authService.refreshToken(refreshToken, res);
        return result;
    }

    @Post('account-info')
    async getAccountInfo(@User() user: IUser) {
        try {
            return { message: 'Account info retrieved successfully', user };
        } catch (error) {
            throw new BadRequestException('Failed to get account info: ' + error.message);
        }
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response, @User() user: IUser) {
        const result: boolean = await this.authService.logout(user._id, res);
        return { message: 'Logout successful', success: result };
    }
}
