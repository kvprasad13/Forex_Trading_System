/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';

import { Account } from './schemas/account.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/schemas/user.schema';
@Injectable()
export class AccountService {
    constructor(
        @InjectModel(Account.name)
        private accountModel: mongoose.Model<Account>
    ) { }

    async topUpCurrentUserAccount(currency: string, amount: number, user: User) {

        try {
            const account = await this.accountModel.findOne({ user_id: user._id });

            if (!account) {
                const balances = [];

                balances.push({ currency, amount });
                await this.accountModel.create({ balances, user_id: user._id });
            }
            else {

                const prevBalances = account.balances;

                let currencyExists = false;

                const newBalances = prevBalances.map(balance => {

                    if (balance.currency === currency) {
                        currencyExists = true;
                        return { currency, amount: balance.amount + amount }
                    }
                    else {
                        return balance;
                    }
                });
                if (!currencyExists)
                    newBalances.push({ currency, amount });
                account.balances = newBalances;
                await account.save();

            }


            const newAccount = (await this.accountModel.findOne({ user_id: user._id }));

            return {
                message: "Top Up done successfully",
                balances: newAccount.balances
            };
        }
        catch (err) {
            console.log(err);
            throw new Error("Server error");
        }

    }
    async getCurrentUserBalances(user: User) {
       
        const account = await this.accountModel.findOne({ user_id: user._id });
        if (!account) {
            return { "balances": {} }
        }
        const balances = account.balances.map(balance => ({ currency: balance.currency, amount: balance.amount }))
        return {
            "balances": balances
        };

    }





}