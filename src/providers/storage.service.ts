import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { Response } from "express";
import { Client } from "minio";
import { MINIO_CONNECTION } from "nestjs-minio";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { PhotoEntity } from "../entities";
import { Repository } from "typeorm";
import { HASH_SALT } from "../constant";
import * as dotenv from "dotenv";

dotenv.config();

const env = process.env;

const defaultBucket = env.MINIO_BUCKET;

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly _logger = new Logger(StorageService.name);
  constructor(
    @Inject(MINIO_CONNECTION) private readonly _minioClient: Client,
    @InjectRepository(PhotoEntity)
    private readonly _photoRepo: Repository<PhotoEntity>
  ) {}

  onModuleInit() {
    this._createBucketIfNotExists();
  }

  public async getPhoto(res: Response, photoId: string) {
    const photo = await this._photoRepo.findOne({
      where: { id: photoId },
    });

    if (!photo?.id) {
      throw new NotFoundException();
    }

    let data;

    this._minioClient.getObject(
      defaultBucket,
      `${photo?.id}.${photo?.extension}`,
      (err, dataStream) => {
        if (err) {
          return console.log(err);
        }

        dataStream.on("data", function (chunk) {
          data = !data ? new Buffer(chunk) : Buffer.concat([data, chunk]);
        });

        dataStream.on("end", function () {
          res.writeHead(200, { "Content-Type": "image/jpeg" });
          res.write(data);
          res.end();
        });

        dataStream.on("error", function (err) {
          res.status(500);
          res.send(err);
        });
      }
    );
  }

  public async uploadFile(item: Express.Multer.File, res: Response) {
    const { stream } = item;

    const photoExtension = this._getFileExtension(item.originalname);

    const hashedName = generateHashedName(item.originalname.length);

    const photoName = `${hashedName}.${photoExtension[1]}`;

    this._minioClient.putObject(
      defaultBucket,
      photoName,
      item.buffer,
      stream?.readableLength ?? 0,
      async (err) => {
        if (err) res.send(err);

        const savedImage = await this._photoRepo.save({
          id: hashedName,
          extension: photoExtension[1],
        });

        res.send(savedImage);
      }
    );
  }

  private _createBucketIfNotExists() {
    this._minioClient.bucketExists(defaultBucket, (err, exists) => {
      if (err) return this._logger.error(err);

      if (!exists) {
        this._minioClient.makeBucket(
          defaultBucket,
          env.MINIO_TIMEZONE,
          (err) => {
            if (err) return this._logger.error(err);

            this._logger.log("Default bucket created");
          }
        );
      }
    });
  }

  private _getFileExtension(body: string): string[] {
    return body.match(/^.*\.(jpg|JPG|gif|GIF|png|PNG|jpeg)$/);
  }
}

function generateHashedName(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = " ";

  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
