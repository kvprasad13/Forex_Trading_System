/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { HttpModule } from '@nestjs/axios';

import { AccountSchema } from './account/schemas/account.schema';
import { AccountModule } from './account/account.module';

@Module({
  imports: [CacheModule.register({
    isGlobal: true,
    useFactory: () => ({

      store: redisStore,
      host: 'localhost', // Redis server host
      port: 6379, // Redis server port

    }),
  }), ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([{name:'Account',schema:AccountSchema}]),
    AuthModule, HttpModule,AccountModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
