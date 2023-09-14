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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetConfig = void 0;
const GetConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(res.locals.payload.id);
    const queryParams = req.query;
    /*
    queueModel.GetAll().then((queues => {
       
        const data = queues.map((queue) => {
            return <Servicios> ObjectFiltering(queue, OUTPUT_TYPES_TURNOS);
        })
        
        res.send({success: true, data});

    })).catch(async (error) => {

        res.status(404).send({error: error.message});
        
    })
    */
    // Testing controller
    res.json({ success: true, queryParams, userId });
});
exports.GetConfig = GetConfig;
