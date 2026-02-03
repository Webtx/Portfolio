import { StatusCodes } from "http-status-codes";

export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = StatusCodes.BAD_REQUEST) {
    super(message);
    this.statusCode = statusCode;
  }
}
