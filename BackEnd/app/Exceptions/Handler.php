<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        // Handle API requests
        if ($request->is('api/*') || $request->expectsJson()) {
            return $this->handleApiException($request, $e);
        }

        return parent::render($request, $e);
    }

    /**
     * Handle API exceptions
     */
    private function handleApiException($request, Throwable $e)
    {
        if ($e instanceof ValidationException) {
            return validationResponse($e->errors());
        }

        if ($e instanceof ModelNotFoundException) {
            return errorResponse('The requested resource does not exist.', 404);
        }

        if ($e instanceof AuthenticationException) {
            return errorResponse('Authentication required to access this resource.', 401);
        }

        if ($e instanceof ThrottleRequestsException) {
            return errorResponse('Too many requests. Please try again later.', 429);
        }

        if ($e instanceof NotFoundHttpException) {
            return errorResponse('The requested endpoint does not exist.', 404);
        }

        if ($e instanceof MethodNotAllowedHttpException) {
            return errorResponse('The HTTP method is not allowed for this endpoint.', 405);
        }

        if ($e instanceof AccessDeniedHttpException) {
            return errorResponse('You do not have permission to access this resource.', 403);
        }

        // Handle other exceptions
        $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
        $message = config('app.debug') ? $e->getMessage() : 'An unexpected error occurred.';

        return errorResponse($message, $statusCode);
    }
}
