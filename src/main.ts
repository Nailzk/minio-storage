import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { CrudRequestInterceptor } from "@nestjsx/crud";
import * as cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { AppModule } from "./app.module";
import "./crud-options";

const env = process.env as any;

dotenv.config();

const serviceName = env.SERVICE || "Service";
const PORT = env.PORT || 3000;

async function bootstrap() {
  const logger = new Logger(serviceName);


  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(cookieParser());
  app.useGlobalInterceptors(new CrudRequestInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle(serviceName)
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  await app.listen(PORT);

  logger.log(`Application started on port ${PORT}`);

  return app;
}

bootstrap();
