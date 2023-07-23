"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rooms_1 = require("../controllers/rooms");
const router = (0, express_1.Router)();
router.get('/create', rooms_1.createRoom);
router.get('/validate/:id', rooms_1.validateRoom);
exports.default = router;
//# sourceMappingURL=routes.js.map