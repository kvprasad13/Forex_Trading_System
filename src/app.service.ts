/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';

import { User } from './auth/schemas/user.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Account } from './account/schemas/account.schema';
import * as mongoose from 'mongoose';


@Injectable()
export class AppService {



  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache, private readonly httpService: HttpService, @InjectModel(Account.name) private accountModel: mongoose.Model<Account>,) { }

  async getFXConversion(quoteId: string, fromCurrency: string, toCurrency: string, amount: number, user: User) {

    // console.log('fromCurrency'+fromCurrency+' toCurrency'+toCurrency+" amount"+amount)
    const obj: { fx_rates: any, expiry_at: Date } = await this.cacheManager.get(quoteId);
    // console.log(obj);
    if (!obj) {
      return { message: " FX Rates are expired" };
    }
    const fx_rates = obj.fx_rates;

    const fx_rate= fx_rates.find(fx => {
      if (fx.fromCurrency === fromCurrency && fx.toCurrency === toCurrency) return fx;
    })
    const rate = fx_rate.rate;
    // console.log(rate);

    const account = await this.accountModel.findOne({ user_id: user._id });
    // console.log(account);
    if (!account) {
      return { message: "No account found" };
    }
   
    const fromBalance = account.balances.find((balance) => balance.currency === fromCurrency && balance.amount >= amount);
    const toBalance = account.balances.find((balance) => balance.currency === toCurrency);
    // console.log("fromBalance" + fromBalance);
    // console.log("toBalance" + toBalance);
    if (!fromBalance) {
      return { message: "we can't able to convert" };
    }
    const newFromBalance = { ...fromBalance, amount: fromBalance.amount - amount };
    let newToBalance;
    if (toBalance)
      newToBalance = { ...toBalance, amount: toBalance.amount + rate * amount };
    else {
      newToBalance = { currency: toCurrency, amount:  rate * amount };
    }
    // console.log('newToBalance');
    // console.log(newToBalance);
    let toBalanceExists = false;
    const newBalances = account.balances.map((balance) => {
      if (balance.currency === newFromBalance.currency) {
        return newFromBalance;
      }
      else if (balance.currency === newToBalance.currency) {
        toBalanceExists = true;
        return newToBalance;
      }
      else return balance;
    })
    if (!toBalanceExists) {
      newBalances.push(newToBalance);
    }
    account.balances = newBalances;
    await account.save();


    return { 'convertedAmount': amount * Number(rate), 'currency': toCurrency };

  }
  async getSingleFromCurrencyToToCurrency(fromCurrency: string, toCurrency: string) {
    const apiKey = process.env.API_KEY;
   
    const apiUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${apiKey}`;

    try {
      const response = await this.httpService.axiosRef.get(apiUrl);
      const data = await response.data;
      // console.log("data:");
      // console.log(data);
      if (data['Information']) {

        return null;
      }
      const exchangeRate = data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
      return { fromCurrency, toCurrency, rate: Number(exchangeRate) };

    } catch (error) {
      console.error(`Error fetching exchange rate from ${fromCurrency} to ${toCurrency}: ${error.message}`);
      throw new Error("server error: " + error.message);
    }
  }
  async getAllFXRates() {

    const newFXRates = [];
    const apiCurrencies = ["USD", "EUR", "GBP"];
    for (const fromCurrency of apiCurrencies) {


      for (const toCurrency of apiCurrencies) {
        if (fromCurrency !== toCurrency) {
          const obj = await this.getSingleFromCurrencyToToCurrency(fromCurrency, toCurrency);
          if (obj === null) {

            return null;
          }
          newFXRates.push(obj);
        }
      }
    }
    return newFXRates;
  }

  async getFXRates() {
    const cachedUuid: string = await this.cacheManager.get('fx-rates');

    if (cachedUuid) {
      const { fx_rates, expiry_at }: { fx_rates: [], expiry_at: Date } = await this.cacheManager.get(cachedUuid);
      console.log("already cached")
      console.log('quoteId: ' + cachedUuid);
      console.log("expiry_at: " + expiry_at);
      console.log('FX Rates: ');
      console.log(fx_rates);
      return { quoteId: cachedUuid, expiry_at };

    }
    else {

      const newFXRates = await this.getAllFXRates();
      // const newFXRates = [{ fromCurrency: "USD", toCurrency: "EUR", rate: 1.0324 }, { fromCurrency: "USD", toCurrency: "GPB", rate: 1.24 }]
      if (!newFXRates) {
        return { Information: 'Thank you for using Alpha Vantage! Our standard API rate limit is 25 requests per day. Please subscribe to any of the premium plans at https://www.alphavantage.co/premium/ to instantly remove all daily rate limits.' };

      }
      const quoteId = uuidv4();

      await this.cacheManager.set('fx-rates', quoteId, 30000);
      await this.cacheManager.set(quoteId, { 'fx_rates': newFXRates, 'expiry_at': Date.now() + 30000 }, 30000); // Cache for 30,000 milliseconds (30 seconds)
      const { fx_rates, expiry_at }: { fx_rates: [], expiry_at: Date } = (await this.cacheManager.get(quoteId));
      console.log("new cached")
      console.log('quoteId: ' + quoteId);
      console.log("expiry_at: " + expiry_at);
      console.log('FX Rates: ');
      console.log(fx_rates);
      return { quoteId, expiry_at };
    }






  }
}
