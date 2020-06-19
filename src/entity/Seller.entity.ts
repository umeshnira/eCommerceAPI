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

export class Sellers {

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
    @Length(4, 20)
    phone: string;

    @Column({ type: 'boolean', default: false })
    status: boolean;

    @Column()
    @Length(4, 20)
    aadhar_card_no: string;

    @Column()
    @Length(4, 20)
    pan_card_no: string;

    @Column()
    @Length(4, 20)
    bank_ac_no: string;

    @Column()
    @Length(4, 100)
    ifsc_code: string;

    @Column()
    @CreateDateColumn()
    inserted_at: Date;

    @Column()
    @Length(4, 20)
    inserted_by: string;

    @Column()
    @UpdateDateColumn()
    updated_at: Date;

    @Column({ nullable: true })
    @Length(4, 100)
    updated_by: string;
}
