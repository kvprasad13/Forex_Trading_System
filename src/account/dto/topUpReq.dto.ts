/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class topUpReqDto {



    @ApiProperty({
        description: 'This is the currency',
        example: 'USD'
    })
    @IsNotEmpty()
    @IsString()

    readonly currency: string;

    @ApiProperty({
        description: 'This is the amount',
        example: 23
    })
    @IsNotEmpty()
    @IsNumber()

    readonly amount: number;

}