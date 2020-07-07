import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    OneToOne,
    JoinColumn
} from 'typeorm';
import { Length } from 'class-validator';
import { Status } from '.';

@Entity()
@Unique(['name'])

export class Categories {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    name: string;

    @Column()
    @Length(4, 100)
    description: string;

    @ManyToOne(type => Categories,{ nullable: true } )
    @JoinColumn({ name: 'parent_category_id', referencedColumnName: 'id'})
    parent_category_id: number;

    @ManyToOne(type => Status,{ nullable: true } )
    @JoinColumn({ name: 'status', referencedColumnName: 'id'})
    status: number;

    @Column()
    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @Column()
    @Length(4, 20)
    created_by: string;

    @Column({nullable: true})
    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;

    @Column({nullable: true})
    @Length(4, 100)
    updated_by: string;

    @OneToMany(type => Categories, Categories => Categories.parent_category_id)
    Categories: Categories[]
}
