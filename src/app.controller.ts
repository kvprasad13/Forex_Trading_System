/* eslint-disable prettier/prettier */
import { Controller, Get,Post,Body, UseGuards,Req } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('fx-rates')
 
  async getFXRates() {
    return this.appService.getFXRates();
  }
  @UseGuards(AuthGuard())
  @Post('fx-conversion')
  async getFXConversion(@Body('quoteId') quoteId: string, @Body('fromCurrency') fromCurrency: string, @Body('toCurrency') toCurrency: string, @Body('amount') amount: number, @Req() req) { 
    // console.log("quoteId "+quoteId+'fromCurrency' + fromCurrency + ' toCurrency' + toCurrency + " amount" + amount)

    return this.appService.getFXConversion(quoteId,fromCurrency,toCurrency,amount,req.user);
  }

}
