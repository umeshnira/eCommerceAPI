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
@Unique(['email'])

export class SellerEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    name: string;

    @Column()
    @Length(4, 20)
    address: string;

    @Column()
    @Length(4, 20)
    landmark: string;

    @Column()
    @Length(4, 20)
    pincode: string;

    @Column()
    @Length(4, 20)
    email: string;

    @Column()
    phone: number;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    @Column()
    @Length(4, 20)
    aadharcard: string;

    @Column()
    @Length(4, 20)
    pancard: string;

    @Column()
    @Length(4, 20)
    bankActNo: string;

    @Column()
    @Length(4, 100)
    isfcCode: string;

    @Column()
    @Length(4, 100)
    password: string;

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
