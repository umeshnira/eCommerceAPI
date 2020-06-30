import { ProductImages } from "../entity";

export class ProductImagesModel {

    id: number;
    product_id: number;
    image: string;
    inserted_at: Date;
    inserted_by: string;
    updated_at: Date;
    updated_by: string;

    getMappedEntity(model: this) {
        const entity = new ProductImages()
        entity.image = model?.image;
        entity.inserted_at = model?.inserted_at;
        entity.inserted_by = model?.inserted_by;
        entity.updated_at = model?.updated_at;
        entity.updated_by = model?.updated_by;
        entity.product_id = model?.product_id;

        return entity;
    }
}

