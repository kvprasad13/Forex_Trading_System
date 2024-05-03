/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { Document } from "mongoose";

import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
@Schema({
    timestamps: true

})

export class User extends Document {
    @ApiProperty({
        description: "Primary key as User Id", example: "1"
    })

    @PrimaryGeneratedColumn()
    _id: mongoose.Types.ObjectId;
    @ApiProperty({
        description: "User name", example: "Varaprasad Kade"
    })

    @Prop()
    name: string;

    @ApiProperty({
        description: "User email address", example: "varaprasad@gmail.com"
    })

    @Prop({ unique: [true, 'Duplicate email entered'] })
    email: string;
    @ApiProperty({
        description: "This is Hashed Password",
    })

    @Prop()
    password: string;

    @ApiProperty({ description: "when the user created" })
    @CreateDateColumn()
    createdAt: Date;
    @ApiProperty({ description: "when the user updated" })

    @UpdateDateColumn()
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);