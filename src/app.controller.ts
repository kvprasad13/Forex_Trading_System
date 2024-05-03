/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiBadRequestResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { fxConversionReqDto } from './dto/fxConversionReq.dto';
import { fxConversionResDto } from './dto/fxConversionRes.dto';
import { fxRateResDto } from './dto/fxRateRes.dto';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  @ApiTags("Account")
  @Get('fx-rates')

  @ApiOkResponse({
    description: "fx-rates cached successfully",
    type: fxRateResDto
  })
  @ApiBadRequestResponse({
    description: "fx-rates does not fetched. Try again."
  })
  async getFXRates() {
    return this.appService.getFXRates();
  }
  @ApiTags("Account")
  @UseGuards(AuthGuard())


  @Post('fx-conversion')

  @ApiOkResponse({
    description: "fx-conversion done successfully",
    type: fxConversionResDto

  })
  @ApiBadRequestResponse({
    description: "fx-conversion failed. Try again."
  })
  @ApiBearerAuth('JWT-auth')
  async getFXConversion(@Body() data: fxConversionReqDto, @Req() req) {
    const { quoteId, fromCurrency, toCurrency ,amount} = data;
   
    return this.appService.getFXConversion(quoteId, fromCurrency, toCurrency, amount, req.user);
  }

}
