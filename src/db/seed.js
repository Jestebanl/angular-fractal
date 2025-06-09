"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
/*
He usado estos comandos para poder usar seed.ts:
npx tsc src/db/seed.ts
node src/db/seed.js
*/
// Firebase configuration - usando la configuración correcta de tu app.config.ts
var firebaseConfig = {
    projectId: "aplicacionfractal",
    appId: "1:718383008770:web:6873a6d01f35eb3bf82b1b",
    storageBucket: "aplicacionfractal.firebasestorage.app",
    apiKey: "AIzaSyA15L-YkV4ElcrCcpVM3tRe-ee8qUN9VYA",
    authDomain: "aplicacionfractal.firebaseapp.com",
    messagingSenderId: "718383008770"
};
// Initialize Firebase
var app = (0, app_1.initializeApp)(firebaseConfig);
var db = (0, firestore_1.getFirestore)(app);
/**
 * Seeds toast data into the Firestore database
 */
var seedToasts = function () { return __awaiter(void 0, void 0, void 0, function () {
    var toastsCollection, toasts, _i, _a, _b, toastId, toastData, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                console.log('Seeding toasts to database...');
                toastsCollection = (0, firestore_1.collection)(db, 'Toast');
                return [4 /*yield*/, Promise.resolve().then(function () { return require('./sample-toast-data'); })];
            case 1:
                toasts = (_c.sent()).toasts;
                _i = 0, _a = Object.entries(toasts);
                _c.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                _b = _a[_i], toastId = _b[0], toastData = _b[1];
                return [4 /*yield*/, (0, firestore_1.addDoc)(toastsCollection, toastData)];
            case 3:
                _c.sent();
                console.log("Added toast: ".concat(toastId));
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                console.log('Toast seeding completed successfully!');
                return [3 /*break*/, 7];
            case 6:
                error_1 = _c.sent();
                console.error('Error seeding toasts:', error_1);
                throw error_1;
            case 7: return [2 /*return*/];
        }
    });
}); };
/**
 * Seeds component data into the Firestore database
 */
var seedComponents = function () { return __awaiter(void 0, void 0, void 0, function () {
    var componentsCollection, componentes, _i, componentes_1, componente, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                console.log('Seeding components to database...');
                componentsCollection = (0, firestore_1.collection)(db, 'Componente');
                return [4 /*yield*/, Promise.resolve().then(function () { return require('./sample-component-data'); })];
            case 1:
                componentes = (_a.sent()).componentes;
                _i = 0, componentes_1 = componentes;
                _a.label = 2;
            case 2:
                if (!(_i < componentes_1.length)) return [3 /*break*/, 5];
                componente = componentes_1[_i];
                return [4 /*yield*/, (0, firestore_1.addDoc)(componentsCollection, componente)];
            case 3:
                _a.sent();
                console.log("Added component: ".concat(componente.nombre));
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                console.log('Component seeding completed successfully!');
                return [3 /*break*/, 7];
            case 6:
                error_2 = _a.sent();
                console.error('Error seeding components:', error_2);
                throw error_2;
            case 7: return [2 /*return*/];
        }
    });
}); };
// ...existing functions (seedUsers, seedEvents)...
// Updated main seeding function
var seedDatabase = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, seedToasts()];
            case 1:
                _a.sent();
                return [4 /*yield*/, seedComponents()];
            case 2:
                _a.sent();
                console.log('Database seeding completed!');
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Failed to seed database:', error_3);
                throw error_3;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.seedDatabase = seedDatabase;
// Run when script is executed directly
if (require.main === module) {
    (0, exports.seedDatabase)()
        .then(function () { return process.exit(0); })
        .catch(function (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    });
}
exports.default = exports.seedDatabase;
