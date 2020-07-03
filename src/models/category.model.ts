import { Categories } from "../entity";

export class CategoryModel {

    id: number;
    name: string;
    description: string;
    status: boolean;
    parent_category_id: number;
    created_by: string;
    updated_by: string;
    created_at:Date;
    updated_at:Date;

    getMappedEntity(model: this) {
        const entity = new Categories()
        entity.name = model?.name;
        entity.description = model?.description;
        entity.created_by = model?.created_by;
        entity.updated_by = model?.updated_by;
        entity.created_at = model?.created_at;
        entity.updated_at = model?.updated_at;
        entity.parent_category_id = model?.parent_category_id;
        return entity;
    }
}

