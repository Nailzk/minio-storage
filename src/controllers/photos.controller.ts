import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Crud, CrudController } from "@nestjsx/crud";
import { PhotoEntity } from "../entities";
import { PhotosService } from "../providers";

@Crud({
    model: {
        type: PhotoEntity,
    },
})
@ApiTags("Photo")
@Controller("photo")
export class PhotosController implements CrudController<PhotoEntity> {
    constructor(public service: PhotosService) {}
}
