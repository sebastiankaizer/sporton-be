import { Response } from "express";

/**
 * Interface untuk struktur response API yang konsisten
 */
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  errors?: Record<string, string>;
}

/**
 * Utility class untuk membuat response API yang konsisten
 */
export class ResponseHandler {
  /**
   * Response sukses dengan data
   */
  static success<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T,
    count?: number
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      ...(data !== undefined && { data }),
      ...(count !== undefined && { count }),
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Response error
   */
  static error(
    res: Response,
    statusCode: number,
    message: string,
    errors?: Record<string, string>
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      ...(errors && { errors }),
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Shorthand methods untuk kasus umum
   */
  static ok<T>(res: Response, message: string, data?: T, count?: number): Response {
    return this.success(res, 200, message, data, count);
  }

  static created<T>(res: Response, message: string, data?: T): Response {
    return this.success(res, 201, message, data);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
