import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Length } from 'class-validator';

@Entity()

export class ProductEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productCategoryId: number;

    @Column()
    @Length(4, 20)
    name: string;

    @Column()
    @Length(4, 100)
    description: string;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    @Column()
    @CreateDateColumn()
    createdDate: Date;

    @Column()
    @Length(4, 20)
    createdBy: string;

    @Column()
    @UpdateDateColumn()
    modifiedDate: Date;

    @Column({ nullable: true })
    @Length(4, 100)
    modifiedBy: string;

}
