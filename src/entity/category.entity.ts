import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Length } from 'class-validator';
import { ProductCategories } from '.';

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

    @ManyToOne(type => Categories, category => category.subCategories)
    @JoinColumn({ name: "parent_category_id", referencedColumnName: "id"})
    parent_category_id: number;

    @OneToMany(type => Categories, category => category.parent_category_id)
    subCategories: Categories[];

    @Column({ type: 'boolean', default: false })
    status: boolean;

    @Column()
    @CreateDateColumn({type: "timestamp"})
    inserted_at: Date;

    @Column()
    @Length(4, 20)
    inserted_by: string;

    @Column({nullable: true})
    @UpdateDateColumn({type: "timestamp"})
    updated_at: Date;

    @Column({nullable: true})
    @Length(4, 100)
    updated_by: string;

    @OneToMany(type => ProductCategories, category => category.category)
    category: ProductCategories[]
}
