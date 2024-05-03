/* eslint-disable prettier/prettier */


import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '@nestjs/passport';
import { currencies } from 'src/constants';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { topUpReqDto } from './dto/topUpReq.dto';



@ApiTags("Account")
@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }
    @ApiOkResponse({ description: "Top up done Successfully", type: Object })

    @ApiBadRequestResponse({ description: "Top up failed. Try again" })
    @Post('topup')

    @UseGuards(AuthGuard())
    @ApiBearerAuth('JWT-auth')
    async topUpCurrentUserAccount(@Body() data: topUpReqDto, @Req() req) {
        const currency = data.currency;
        const amount = data.amount;
        if (!currency || !amount) {
            throw new Error("Both fields are required");
        }
        if (typeof amount !== 'number') {
            throw new Error("Amount should be a number");
        }
        if (typeof currency !== 'string' || !currencies.includes(currency)) {
            throw new Error("Currency should be valid");
        }
        return this.accountService.topUpCurrentUserAccount(currency, amount, req.user);
    }

    @Get('balance')
    @UseGuards(AuthGuard())
    @ApiOkResponse({
        description: "This is the balances in the user's account.",
        type: Object
    })
    @ApiBearerAuth('JWT-auth')
    async getCurrentUserBalances(@Req() req) {

        return this.accountService.getCurrentUserBalances(req.user);
    }


}
