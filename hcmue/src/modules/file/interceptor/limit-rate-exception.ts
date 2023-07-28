import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class FileRateLimitInterceptor implements NestInterceptor {
  private callCounter = {}; // Object to store call counts for each route

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //const request = context.switchToHttp().getRequest();
    const route = context.getHandler().name;
    const limit = 1; // Set the limit of calls within the time period
    const timePeriod = 2; // Set the time period in seconds (e.g., 2 seconds)

    // Generate a unique identifier for each route and user (You can customize this based on your requirements)
    const identifier = route;

    // Initialize the counter for this identifier if not exists
    this.callCounter[identifier] = this.callCounter[identifier] || 0;

    // Check if the call limit has been exceeded
    if (this.callCounter[identifier] >= limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: 'Rate limit exceeded.',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Increment the call count and store the timestamp
    this.callCounter[identifier]++;
    setTimeout(() => {
      // Reset the call count after the time period has passed
      this.callCounter[identifier] = 0;
    }, timePeriod * 1000);

    return next.handle().pipe(
      tap(() => {
        // Handle response if needed
      }),
    );
  }
}
