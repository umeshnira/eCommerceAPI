import { Status } from '../../enums';

export class CategoryModel {

    id: number;
    name: string;
    description: string;
    status: Status;
    parent_category_id: number;
    created_by: string;
    updated_by: string;
    created_at:Date;
    updated_at:Date;
}

