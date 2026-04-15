import { comparePassword } from '@/libraries/bcrypt/bcrypt';
import { IUser } from '@/users/interfaces/IUser';
import { UserService } from '@/users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { CreateSessionDto } from '@/sessions/dto/create-session.dto';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { SessionService } from '@/sessions/sessions.service';
import { ChangePasswordDto, RegisterDto } from '@/auth/Dtos/authRequest.dto';
import { RoleService } from '@/roles/roles.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly sessionService: SessionService,

    ) { }

    private readonly refresh_token: string = "refresh_token";

    async validateUser(userName: string, password: string): Promise<IUser | null> {
        const user: any = await this.userService.findByUsernameOrEmail(userName);
        // Short-circuit when user not found to avoid null access
        if (!user) {
            return null;
        }
        // Optional chaining in case roleId is missing
        const role = user.roleId ? await this.roleService.findOne(user.roleId.toString()) : null;
        // Validate password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return null;
        }
        const { password: _pwd, ...result } = user.toObject();
        result.roleName = role?.name ?? null;
        return result;
    }

    async generateRefreshToken(payload: { _sub: string; _id: string }): Promise<string> {
        const expiresInRaw = this.configService.get<string>('JWT_REFRESH_EXPIRE');
        if (!expiresInRaw) {
          throw new Error('Missing JWT_REFRESH_EXPIRE environment variable');
        }
        const expiresInMs = ms(expiresInRaw as unknown as Parameters<typeof ms>[0]) as number;
        const refresh_token = this.jwtService.sign(payload, { // ghi đè các giá trị trong jwt.module.ts
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: expiresInMs / 1000, //chuyển từ milliseconds sang seconds
        });
        return refresh_token;
    }

    async registerUser(registerDto: RegisterDto): Promise<IUser> {
        const { userName, email, password } = registerDto;
        const userExists = await this.userService.CheckUserExists(userName, email);
        if (userExists) {
            throw new BadRequestException('Username or email already exists');
        }
        const createUserDto = { userName, email, password, roleName: 'user' };
        const newUser: any = await this.userService.create(createUserDto);
        const { password: pwd, ...result } = newUser.toObject();
        return result;
    }

    async login(user: IUser, res: Response): Promise<any> {
        const refreshToken = await this.generateRefreshToken({ _sub: user._id, _id: user._id });
        const createSessionDto: CreateSessionDto = {
            userId: user._id as unknown as Types.ObjectId,
            refreshToken: refreshToken,
        };
        const setSessionDB = await this.sessionService.UpSertSessionAsync(createSessionDto);
        if (!setSessionDB) {
            throw new BadRequestException('Failed to create session');
        }
        const refreshExpireRaw = this.configService.get<string>('JWT_REFRESH_EXPIRE');
        if (!refreshExpireRaw) {
          throw new Error('Missing JWT_REFRESH_EXPIRE environment variable');
        }
        const maxAgeMs = ms(refreshExpireRaw as unknown as Parameters<typeof ms>[0]) as number;
        res.cookie(this.refresh_token, refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            maxAge: maxAgeMs,
            secure: true,
        });
        const payLoad: IUser = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
            roleName: user.roleName,
        };
        const accessToken = this.jwtService.sign(payLoad);
        return {
            message: 'Login successful',
            accessToken: accessToken,
            user: payLoad,
        };
    }

    async refreshToken(oldRefreshToken: string, res: Response): Promise<any> {
        try {
            if (!oldRefreshToken || oldRefreshToken === '' || oldRefreshToken === 'undefined') {
                throw new BadRequestException('Refresh token is missing');
            }
            this.jwtService.verify(oldRefreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            });
            const session = await this.sessionService.findSessionByRefreshTokenAndUserId(oldRefreshToken);
            if (!session) {
                throw new BadRequestException('Session not found for the provided refresh token and user ID');
            }
            const userFetch: any = await this.userService.findOne(session.userId.toString());
            if (userFetch._id.toString() !== session.userId.toString()) {
                throw new BadRequestException('User ID does not match session user ID');
            }
            if (userFetch) {
                const role = await this.roleService.findOne(userFetch.roleId.toString());
                if (!role) {
                    throw new BadRequestException('Role not found for the user');
                }
                userFetch.roleName = role?.name;
            }
            const User: IUser = {
                _id: userFetch._id,
                userName: userFetch.userName,
                email: userFetch.email,
                avatar: userFetch.avatar,
                roleName: userFetch.roleName,
            };
            if (!User || !User._id || !User.userName || !User.email) {
                throw new BadRequestException('User not found for this refresh token');
            }
            res.clearCookie(this.refresh_token);
            return await this.login(User, res);
        } catch (error: any) {
            throw new BadRequestException('Invalid refresh token: ' + error.message);
        }
    }

    async ChangePassword(user: IUser, changePasswordDto: ChangePasswordDto): Promise<IUser> {
        try {
            const isValid = await this.validateUser(user.userName, changePasswordDto.oldPassword);
            if (!isValid) {
                throw new BadRequestException('Old password is incorrect');
            }
            const inforUser: IUser = await this.userService.findOne(user._id) as unknown as IUser;
            if (!inforUser) {
                throw new BadRequestException('User not found');
            }
            const result = await this.userService.changePasswordForIdUser(user._id, changePasswordDto.newPassword);
            if (!result) {
                throw new BadRequestException('Failed to change password');
            }
            return user;
        } catch (error: any) {
            throw new BadRequestException('Failed to change password: ' + error.message);
        }
    }

    async logout(userId: string, res: Response): Promise<boolean> {
        try {
            const result = await this.sessionService.DeleteSessionByUserId(userId);
            if (!result) {
                throw new BadRequestException('Failed to delete session');
            }
            res.clearCookie(this.refresh_token);
            return true;
        } catch (error: any) {
            throw new BadRequestException('Logout failed: ' + error.message);
        }
    }
}
