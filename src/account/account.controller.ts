/* eslint-disable prettier/prettier */


import { Controller, Get, Post, Body, UseGuards,Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '@nestjs/passport';
import { currencies } from 'src/constants';
@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @Post('topup')
    @UseGuards(AuthGuard())
    async topUpCurrentUserAccount(@Body('currency') currency: string, @Body('amount') amount: number, @Req() req) {
        if (!currency || !amount) {
            throw new Error("Both fields are required");
        }
        if (typeof amount !== 'number') {
            throw new Error("Amount should be a number");
        }
        if (typeof currency !== 'string' || !currencies.includes(currency)) { 
            throw new Error("Currency should be valid");
        }
        return this.accountService.topUpCurrentUserAccount(currency, amount,req.user);
    }

    @Get('balance')
    @UseGuards(AuthGuard())
    async getCurrentUserBalances(@Req() req) {
       
        return this.accountService.getCurrentUserBalances(req.user);
    }


}
