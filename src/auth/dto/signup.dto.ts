/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
    @ApiProperty({
        description: 'This is the Name of the User',
        example: 'Varaprasad Kade'
    })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({
        description: 'This is the email of the user',
        example: 'varaprasad@gmail.com'
    })

    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter correct email" })
    readonly email: string;

    @ApiProperty({
        description: 'This is the password',
        example: '123456'
    })

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;

}