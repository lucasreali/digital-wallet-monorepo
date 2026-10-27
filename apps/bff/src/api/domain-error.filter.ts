import { type ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  ConflictError,
  DomainError,
  InvalidInputError,
  NotFoundError,
  ServiceUnavailableError,
} from '../domain/errors';

const statusOf = (err: DomainError) =>
  err instanceof InvalidInputError
    ? HttpStatus.BAD_REQUEST
    : err instanceof NotFoundError
      ? HttpStatus.NOT_FOUND
      : err instanceof ConflictError
        ? HttpStatus.CONFLICT
        : err instanceof ServiceUnavailableError
          ? HttpStatus.BAD_GATEWAY
          : HttpStatus.UNPROCESSABLE_ENTITY;

@Catch(DomainError)
export class DomainErrorFilter extends BaseExceptionFilter {
  catch(err: DomainError, host: ArgumentsHost) {
    super.catch(new HttpException(err.message, statusOf(err)), host);
  }
}
