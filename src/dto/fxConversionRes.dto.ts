/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class fxConversionResDto {


    @ApiProperty({
        description: 'This is the converted amount',
        example: 90.53
    })
    @IsNotEmpty()
    @IsNumber()

    readonly convertedAmount: number;
    @ApiProperty({
        description: 'This is the currency',
        example: 'EUR'
    })
    @IsNotEmpty()
    @IsString()

    readonly currency: string;

}