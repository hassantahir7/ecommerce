import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: any; // Adding data field
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message = 'Internal server error';
    let data = null;  // Default value for error case

    // Handle HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        message = (exceptionResponse as { message: string }).message;
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    } 
    // Handle general JavaScript Error
    else if (exception instanceof Error) {
      message = exception.message;
    }

    // Prepare error response
    const errorResponse: ErrorResponse = {
      statusCode: status,
      success: status < 400,
      message: message,
      data: data, // null in case of error
    };

    // Send response
    response.status(status).json(errorResponse);
  }
}
