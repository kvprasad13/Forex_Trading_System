/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class fxConversionReqDto {


    @ApiProperty({
        description: 'This is the quoteId',
        example: '12345'
    })
    @IsNotEmpty()
    @IsString()

    readonly quoteId: string;
    @ApiProperty({
        description: 'This is the fromCurrency',
        example: 'USD'
    })
    @IsNotEmpty()
    @IsString()

    readonly fromCurrency: string;

    @ApiProperty({
        description: 'This is the toCurrency',
        example: 'EUR'
    })
    @IsNotEmpty()
    @IsString()

    readonly toCurrency: string;

    @ApiProperty({
        description: 'This is the amount',
        example: 100
    })
    @IsNotEmpty()
    @IsNumber()

    readonly amount: number;

}