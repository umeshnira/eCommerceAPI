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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductPrices = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const product_entity_1 = require("./product.entity");
let ProductPrices = class ProductPrices {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ProductPrices.prototype, "id", void 0);
__decorate([
    typeorm_1.OneToOne(type => product_entity_1.Products, { nullable: false }),
    typeorm_1.JoinColumn({ name: "product_id", referencedColumnName: "id" }),
    __metadata("design:type", product_entity_1.Products)
], ProductPrices.prototype, "products", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ProductPrices.prototype, "price", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ProductPrices.prototype, "price_without_offer", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    typeorm_1.CreateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], ProductPrices.prototype, "inserted_at", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    class_validator_1.Length(4, 100),
    __metadata("design:type", String)
], ProductPrices.prototype, "inserted_by", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    typeorm_1.UpdateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], ProductPrices.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    class_validator_1.Length(4, 100),
    __metadata("design:type", String)
], ProductPrices.prototype, "updated_by", void 0);
ProductPrices = __decorate([
    typeorm_1.Entity()
], ProductPrices);
exports.ProductPrices = ProductPrices;
//# sourceMappingURL=product-prices.entity.js.map