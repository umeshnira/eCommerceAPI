"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const bcrypt = __importStar(require("bcryptjs"));
let User = class User {
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }
    checkIfUnencryptedPasswordIsValid(unencryptedPassword) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 20),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.Length(4, 100),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.Column(),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column(),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique(['username'])
], User);
exports.User = User;
//# sourceMappingURL=User.js.map