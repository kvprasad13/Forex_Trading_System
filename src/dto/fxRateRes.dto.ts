/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class fxRateResDto {


    @ApiProperty({
        description: 'This is the quoteId',
        example: '12345'
    })
    @IsNotEmpty()
    @IsString()

    readonly quoteId: string;
    @ApiProperty({
        description: 'This is the expiry_at',
        example: '12345'
    })
    @IsNotEmpty()
    @IsString()

    readonly expiry_at: string;

}