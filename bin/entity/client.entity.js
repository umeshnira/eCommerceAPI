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
exports.Clients = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
let Clients = class Clients {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Clients.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 20),
    __metadata("design:type", String)
], Clients.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 100),
    __metadata("design:type", String)
], Clients.prototype, "address", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 100),
    __metadata("design:type", String)
], Clients.prototype, "landmark", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 20),
    __metadata("design:type", String)
], Clients.prototype, "pin_code", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 20),
    __metadata("design:type", String)
], Clients.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 20),
    __metadata("design:type", String)
], Clients.prototype, "phone", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Clients.prototype, "status", void 0);
__decorate([
    typeorm_1.Column(),
    typeorm_1.CreateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], Clients.prototype, "inserted_at", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 20),
    __metadata("design:type", String)
], Clients.prototype, "inserted_by", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    typeorm_1.UpdateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], Clients.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    class_validator_1.Length(4, 100),
    __metadata("design:type", String)
], Clients.prototype, "updated_by", void 0);
Clients = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique(['email'])
], Clients);
exports.Clients = Clients;
//# sourceMappingURL=client.entity.js.map