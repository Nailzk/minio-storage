import "./crud-options";
import { AppModule } from "./app.module";
import { bootstrap } from "nest-utils";
import { UserRequestInterceptor } from "./interceptor";
import * as env from "dotenv";

env.config();

bootstrap(AppModule, (app) => {
    app.useGlobalInterceptors(new UserRequestInterceptor());
});
