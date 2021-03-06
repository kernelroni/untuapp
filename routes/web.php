<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/



Auth::routes();
Route::get('/', [App\Http\Controllers\TodoController::class, 'index'])->name('todohome');
Route::get('/todo', [App\Http\Controllers\TodoController::class, 'index'])->name('todo');
Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::any('/ajax', [App\Http\Controllers\TodoController::class, 'ajax'])->name('ajax');