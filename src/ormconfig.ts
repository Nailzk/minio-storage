import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import * as dotenv from "dotenv";
import { join } from 'path';

dotenv.config();
const env: { [key: string]: string | boolean } = process.env;

/**
 * we use defaults values for loccal (development) envirionment 
 * in production should use system env variables 
 * the problem for local usage .env file is typeorm specific loaded this file and this comand is not triggered dotenv.config()
 * 
 * IMPORTANT: DONT CHANGE LOCATIONS IN package.json (it will not work)!!!!
 */

const watch = (process.argv || []).some(i => i.includes('--watch'));

module.exports = {
    type: env.TYPEORM_CONNECTION || "postgres",
    host: env.TYPEORM_HOST,
    port: env.TYPEORM_PORT,
    username: env.TYPEORM_USERNAME,
    password: env.TYPEORM_PASSWORD,
    database: env.TYPEORM_DATABASE || 'template',
    logging: env.TYPEORM_LOGGING != false,
    synchronize: !watch && env.TYPEORM_MIGRATIONS_RUN == 'true',
    migrationsRun: !watch && env.TYPEORM_MIGRATIONS_RUN == 'true',
    debug: env.TYPEORM_DEBUG != true,
    entities: [join(__dirname, "./entities/*.entity{.ts,.js}")],
    migrationsTableName: "orm_migrations",
    migrations: [join(__dirname, "./seeds{.ts,.js}")],
    namingStrategy: new SnakeNamingStrategy(),
} as TypeOrmModuleOptions;
