import { ProductCategories } from "../entity";

export class ProductCategoryModel {

    id: number;
    category_id: any;
    product_id: number;
    inserted_at: Date;
    status: boolean;
    inserted_by: string;
    inserted_date: Date;
    updated_at: string;
    updated_by: Date;

    getMappedEntity(model: this) {
        const entity = new ProductCategories()
        entity.category = model?.category_id;
        entity.inserted_by = model?.inserted_by;

        return entity;
    }
}

