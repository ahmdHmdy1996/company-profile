<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return successResponse([
                'user' => new UserResource($user),
                'token' => $token,
                'token_type' => 'Bearer'
            ], 'User registered successfully', 201);

        } catch (ValidationException $e) {
            return validationResponse($e->errors());
        }
    }

    /**
     * Login user.
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (!Auth::attempt($validated)) {
                return errorResponse('Invalid credentials', 401);
            }

            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return successResponse([
                'user' => new UserResource($user),
                'token' => $token,
                'token_type' => 'Bearer'
            ], 'Login successful');

        } catch (ValidationException $e) {
            return validationResponse($e->errors());
        }
    }

    /**
     * Get authenticated user.
     */
    public function user(Request $request): JsonResponse
    {
        return successResponse(
            new UserResource($request->user()),
            'User retrieved successfully'
        );
    }

    /**
     * Logout user.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return successResponse(null, 'Logout successful');
    }

    /**
     * Logout from all devices.
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return successResponse(null, 'Logged out from all devices');
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
                'current_password' => 'required_with:password',
                'password' => 'sometimes|string|min:8|confirmed',
            ]);

            // Check current password if updating password
            if ($request->has('password')) {
                if (!Hash::check($request->current_password, $user->password)) {
                    return errorResponse('Current password is incorrect', 400);
                }
                $validated['password'] = Hash::make($validated['password']);
            }

            // Remove current_password from validated data
            unset($validated['current_password']);

            $user->update($validated);

            return successResponse(
                new UserResource($user),
                'Profile updated successfully'
            );

        } catch (ValidationException $e) {
            return validationResponse($e->errors());
        }
    }
}
