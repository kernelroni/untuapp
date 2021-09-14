<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TodoController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        
        return view("todo");

    }


    public function ajax(Request $request){

        $action = $request->get("action","");
        if($action == "save"){

            $tasks = $request->get("tasks");
            return $tasks;

        }else if($action == "addtask"){

            $item = $request->get("item");

            $task = new Task;
            $task->task = $item['task'];
            $task->task_id = $item['task_id'];
            $task->complete = $item['complete'];
            $task->create_time = $item['create_time'];
            $task->delete_time = $item['delete_time'];

            $task->save();

            return $task;
        }else if($action == "loaddata"){
            return Task::all();
        }
        


    }
}
