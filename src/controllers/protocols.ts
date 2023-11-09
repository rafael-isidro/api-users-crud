import { NextFunction } from "express";

export interface HttpResponse<T> {
  statusCode: HttpStatusCode;
  body: T;
}

export interface HttpRequest<B> {
  params?: any;
  headers?: any;
  body?: B;
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

export interface IService {
  handle(
    httpRequest: HttpRequest<unknown>,
    httpResponse?: HttpResponse<unknown>,
    next?: NextFunction,
  ): Promise<HttpResponse<unknown> | string>;
}
