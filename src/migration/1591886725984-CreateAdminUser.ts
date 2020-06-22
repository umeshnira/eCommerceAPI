import { MigrationInterface, QueryRunner, getRepository } from "typeorm";

export class CreateAdminUser1547919837483 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
    }

    public async down(queryRunner: QueryRunner): Promise<any> {}
}