import { Products } from '../entity';

export class ProductModel {

    id: number;
    name: string;
    description: string;
    status: number;
    batch_no: number;
    exp_date: Date;
    star_rate: string;
    bar_code: string;
    about: string;
    is_returnable: boolean;
    created_by: string;
    updated_by: string;

    getMappedEntity(model: this) {
      const entity = new Products()
      entity.name = model?.name;
      entity.description = model?.description;
      entity.batch_no = model?.batch_no;
      entity.exp_date = model?.exp_date;
      entity.bar_code = model?.bar_code;
      entity.about = model?.about;
      entity.status = model?.status;
      entity.star_rate = model?.star_rate;
      entity.is_returnable = model?.is_returnable;
      entity.created_by = model?.created_by;
      entity.updated_by = model?.updated_by;

      return entity;
    }
}
