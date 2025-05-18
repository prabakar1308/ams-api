import { BaseEntity } from 'src/common/entities/base.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'master', orderBy: { id: 'ASC' } })
export class WorksheetUnit extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
        unique: true,
    })
    value: string;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    brand: string;

    @Column({
        type: 'varchar',
        length: 256,
        nullable: true,
    })
    specs?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
