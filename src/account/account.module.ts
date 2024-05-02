/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import {  AccountSchema } from './schemas/account.schema';
@Module({
    imports: [ AuthModule,MongooseModule.forFeature([{ name: 'Account', schema: AccountSchema }])],
    controllers: [AccountController],
    providers: [AccountService],
    
})
export class AccountModule { }
