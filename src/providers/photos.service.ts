import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { PhotoEntity } from "../entities";

@Injectable()
export class PhotosService extends TypeOrmCrudService<PhotoEntity> {
    constructor(@InjectRepository(PhotoEntity) repo) {
        super(repo)
    }
}