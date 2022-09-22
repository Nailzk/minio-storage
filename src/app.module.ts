import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import { NestMinioModule } from "nestjs-minio";
import controllers from "./controllers";
import entities from "./entities";
import interceptor from "./interceptor";
import * as ormConfig from "./ormconfig";
import providers from "./providers";

console.log("config", { ...ormConfig, password: "***" });

dotenv.config();

const env = process.env;

@Module({
    imports: [
        TypeOrmModule.forRoot(ormConfig),
        TypeOrmModule.forFeature(entities),
        JwtModule.register({ secret: "secret" }),
        NestMinioModule.register({
            endPoint: env.MINIO_HOST,
            port: Number(env.MINIO_PORT),
            useSSL: false,
            accessKey: env.MINIO_ACCESS_KEY,
            secretKey: env.MINIO_SECRET_KEY,
        })
    ],
    controllers: controllers,
    providers: [...providers, ...interceptor],
})
export class AppModule {}
