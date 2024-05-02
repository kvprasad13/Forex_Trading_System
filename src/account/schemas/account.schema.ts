/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


@Schema({
    timestamps: true
})
export class Account extends Document {


    @Prop([{
        currency: { type: String },
        amount: { type: Number }

    }])
    balances: { currency: string, amount: number }[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: [true, 'Duplicate user id entered']  })
    user_id: mongoose.Types.ObjectId;;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
