
export class CategoryListModel {

    id: number;
    name: string;
    parent_category_id: number;
    created_by: string;
    created_at: string;
    subCategories: CategoryListModel[] = [];

    constructor(id: number, name: string, created_at: string, created_by: string, parent_category_id?: number,) {
        this.id = id;
        this.name = name;
        this.created_by = created_by;
        this.created_at = created_at;
        this.parent_category_id = parent_category_id;
    }
}
