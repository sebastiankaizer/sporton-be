"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
/**
 * Utility class untuk membuat response API yang konsisten
 */
class ResponseHandler {
    /**
     * Response sukses dengan data
     */
    static success(res, statusCode, message, data, count) {
        const response = Object.assign(Object.assign({ success: true, message }, (data !== undefined && { data })), (count !== undefined && { count }));
        return res.status(statusCode).json(response);
    }
    /**
     * Response error
     */
    static error(res, statusCode, message, errors) {
        const response = Object.assign({ success: false, message }, (errors && { errors }));
        return res.status(statusCode).json(response);
    }
    /**
     * Shorthand methods untuk kasus umum
     */
    static ok(res, message, data, count) {
        return this.success(res, 200, message, data, count);
    }
    static created(res, message, data) {
        return this.success(res, 201, message, data);
    }
    static noContent(res) {
        return res.status(204).send();
    }
}
exports.ResponseHandler = ResponseHandler;
