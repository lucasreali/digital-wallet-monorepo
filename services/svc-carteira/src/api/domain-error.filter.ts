import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ConflictError, DomainError, NotFoundError } from '../domain/errors';

@Catch(DomainError)
export class DomainErrorFilter extends BaseExceptionFilter {
  catch(err: DomainError, host: ArgumentsHost) {
    const status =
      err instanceof NotFoundError ? HttpStatus.NOT_FOUND
      : err instanceof ConflictError ? HttpStatus.CONFLICT
      : HttpStatus.UNPROCESSABLE_ENTITY;
    super.catch(new HttpException(err.message, status), host);
  }
}
