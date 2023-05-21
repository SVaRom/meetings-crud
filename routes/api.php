<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MeetingsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('show', [MeetingsController::class, 'index']);
Route::post('add', [MeetingsController::class, 'create']);
Route::post('update', [MeetingsController::class, 'update']);
Route::post('delete', [MeetingsController::class, 'destroy']);
Route::post('room', [MeetingsController::class, 'indexRoom']);
Route::post('meeting', [MeetingsController::class, 'show']);
