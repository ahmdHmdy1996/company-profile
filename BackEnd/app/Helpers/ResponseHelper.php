<?php

if (!function_exists('jsonResponse')) {
    /**
     * Returns a standardized JSON response.
     *
     * @param bool $valid (true for success, false for failure)
     * @param int $code
     * @param string|null $message
     * @param mixed $data
     * @param array|null $meta
     * @param array|null $errors
     * @param array|null $statistics
     * @return \Illuminate\Http\JsonResponse
     */
    function jsonResponse($valid, $code, $message = null, $data = null, $meta = null, $errors = null)
    {
        $response = [
            'status' => $valid,
            'code' => $code,
            'message' => $message,
        ];

        if (!is_null($data)) {
            $response['data'] = $data;
        }

        if (!$valid && !is_null($errors)) {
            $response['errors'] = $errors;
        }

        if (!is_null($meta)) {
            $response['meta'] = $meta;
        }



        return response()->json($response, $code);
    }
}

if (!function_exists('validationResponse')) {
    /**
     * Returns a standardized validation error response.
     *
     * @param array $errors
     * @param string|null $message
     * @return \Illuminate\Http\JsonResponse
     */
    function validationResponse(array $errors, $message = null)
    {
        return jsonResponse(
            false,
            422,
            $message ?? __('messages.validation_error'),
            null,
            null,
            $errors
        );
    }
}

if (!function_exists('successResponse')) {
    /**
     * Returns a standardized success response.
     *
     * @param mixed $data
     * @param string|null $message
     * @param int $code
     * @param array|null $meta
     * @param array|null $statistics
     * @return \Illuminate\Http\JsonResponse
     */
    function successResponse($data = null, $message = null, $code = 200, $meta = null, $statistics = null)
    {
        return jsonResponse(
            true,
            $code,
            $message,
            $data,
            $meta,
            null
        );
    }
}

if (!function_exists('errorResponse')) {
    /**
     * Returns a standardized error response.
     *
     * @param string|null $message
     * @param int $code
     * @param array|null $errors
     * @return \Illuminate\Http\JsonResponse
     */
    function errorResponse($message = null, $code = 400, $errors = null)
    {
        return jsonResponse(
            false,
            $code,
            $message,
            null,
            null,
            $errors
        );
    }
}
