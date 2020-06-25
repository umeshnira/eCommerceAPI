"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Categories_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categories = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const _1 = require(".");
let Categories = Categories_1 = class Categories {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Categories.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 20),
    __metadata("design:type", String)
], Categories.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 100),
    __metadata("design:type", String)
], Categories.prototype, "description", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Categories_1, category => category.subCategories),
    typeorm_1.JoinColumn({ name: "parent_category_id", referencedColumnName: "id" }),
    __metadata("design:type", Number)
], Categories.prototype, "parent_category_id", void 0);
__decorate([
    typeorm_1.OneToMany(type => Categories_1, category => category.parent_category_id),
    __metadata("design:type", Array)
], Categories.prototype, "subCategories", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Categories.prototype, "status", void 0);
__decorate([
    typeorm_1.Column(),
    typeorm_1.CreateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], Categories.prototype, "inserted_at", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 20),
    __metadata("design:type", String)
], Categories.prototype, "inserted_by", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    typeorm_1.UpdateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], Categories.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    class_validator_1.Length(4, 100),
    __metadata("design:type", String)
], Categories.prototype, "updated_by", void 0);
__decorate([
    typeorm_1.OneToMany(type => _1.ProductCategories, category => category.category),
    __metadata("design:type", Array)
], Categories.prototype, "category", void 0);
Categories = Categories_1 = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique(['name'])
], Categories);
exports.Categories = Categories;
//# sourceMappingURL=category.entity.js.map