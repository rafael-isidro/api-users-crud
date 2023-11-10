import { NextFunction, Response } from "express";
import { HttpRequest, HttpResponse } from "../controllers/protocols";

export interface IService {
  handle(
    httpRequest: HttpRequest<unknown>,
    httpResponse?: Response | HttpResponse<unknown>,
    next?: NextFunction
  ): Promise<HttpResponse<unknown> | string>;
}
