import { ProductQuantity } from '../entity';

export class ProductQuantityModel {

    id: number;
    product_id: number;
    left_qty: number;
    tota_qty: number;
    inserted_at: Date;
    inserted_by: string;
    updated_at: Date;
    updated_by: string;

    getMappedEntity(model: this) {
        const entity = new ProductQuantity()
        entity.left_qty = model?.left_qty;
        entity.tota_qty = model?.tota_qty;
        entity.inserted_at = model?.inserted_at;
        entity.inserted_by = model?.inserted_by;
        entity.updated_at = model?.updated_at;
        entity.updated_by = model?.updated_by;

        return entity;
    }
}

