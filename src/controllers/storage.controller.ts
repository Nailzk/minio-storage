import {
    Controller,
    Get,
    Param,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { StorageService } from "../providers";

@ApiTags("Storage")
@Controller("storage")
export class UsersController {
    constructor(public service: StorageService) {}

    @Post()
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("file"))
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    })
    uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Res() res: Response
    ): Promise<void> {
        return this.service.uploadFile(file, res);
    }

    @Get(":id")
    async getPhoto(
        @Res() res: Response,
        @Param("id") id: string
    ): Promise<void> {
        return this.service.getPhoto(res, id);
    }
}
