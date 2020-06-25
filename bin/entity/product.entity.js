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
exports.Products = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const _1 = require(".");
let Products = class Products {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Products.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 20),
    __metadata("design:type", String)
], Products.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 100),
    __metadata("design:type", String)
], Products.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Products.prototype, "status", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Products.prototype, "batch_no", void 0);
__decorate([
    typeorm_1.Column(),
    typeorm_1.CreateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], Products.prototype, "exp_date", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 20),
    __metadata("design:type", String)
], Products.prototype, "star_rate", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Products.prototype, "bar_code", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Products.prototype, "about", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Products.prototype, "is_returnable", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 20),
    __metadata("design:type", String)
], Products.prototype, "inserted_by", void 0);
__decorate([
    typeorm_1.Column(),
    typeorm_1.CreateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], Products.prototype, "inserted_at", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    typeorm_1.UpdateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], Products.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    class_validator_1.Length(4, 100),
    __metadata("design:type", String)
], Products.prototype, "updated_by", void 0);
__decorate([
    typeorm_1.OneToMany(type => _1.ProductImages, image => image.products),
    __metadata("design:type", Array)
], Products.prototype, "image", void 0);
__decorate([
    typeorm_1.OneToOne(type => _1.ProductQuantity, quantity => quantity.products),
    __metadata("design:type", Array)
], Products.prototype, "quantity", void 0);
__decorate([
    typeorm_1.OneToOne(type => _1.ProductOffers, offers => offers.products),
    __metadata("design:type", Array)
], Products.prototype, "offers", void 0);
__decorate([
    typeorm_1.OneToOne(type => _1.ProductPrices, price => price.products),
    __metadata("design:type", Array)
], Products.prototype, "price", void 0);
Products = __decorate([
    typeorm_1.Entity()
], Products);
exports.Products = Products;
//# sourceMappingURL=product.entity.js.map