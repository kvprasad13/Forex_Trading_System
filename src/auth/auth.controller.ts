/* eslint-disable prettier/prettier */
import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenDto } from './dto/accessToken.dto';


@ApiTags("User")
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')

    @ApiCreatedResponse({
        description: "Create a new user object",
        type: AccessTokenDto,

    })
    @ApiBadRequestResponse({
        description: "User cannot register. Try again."
    })
    signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
        return this.authService.signUp(signUpDto)
    }

    @Post('/login')
    @ApiCreatedResponse({
        description: "User is logged in",
        type: AccessTokenDto
    })
    @ApiBadRequestResponse({
        description: "Unable to login. Try again."
    })
    login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        return this.authService.login(loginDto)
    }

}
