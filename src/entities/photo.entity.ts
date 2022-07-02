import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("photos")
export class PhotoEntity {
    @ApiProperty()
    @PrimaryColumn()
    id: string;

    @ApiProperty()
    @Column({ type: "varchar", length: 12 })
    extension: string;
}
