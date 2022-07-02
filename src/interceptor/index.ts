import { APP_INTERCEPTOR } from "@nestjs/core";
import { UserRequestInterceptor } from "./user-request.interceptor";

export { UserRequestInterceptor };

export default [{ provide: APP_INTERCEPTOR, useClass: UserRequestInterceptor }];
