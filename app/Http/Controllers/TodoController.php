<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Auth;

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
            foreach($tasks as $task){
                $t = Task::find($task['id']);
                $t->complete = $task['complete'];
                $t->save();
            }
            return $tasks;

        }else if($action == "addtask"){

            $userId = 0; // guest - default
            $user = Auth::user();
            if($user){
                $userId = $user->id;
            }

            $item = $request->get("item");

            $task = new Task;
            $task->user_id = $userId;
            $task->task = $item['task'];
            $task->task_id = $item['task_id'];
            $task->complete = $item['complete'];
            $task->create_time = $item['create_time'];
            $task->delete_time = $item['delete_time'];

            $task->save();

            return $task;
        }else if($action == "loaddata"){

            $userId = 0; // guest - default
            $user = Auth::user();
            if($user){
                $userId = $user->id;
            }
            
            return Task::where("user_id",$userId)->get();
            // load all todo
        }else if($action == "delete"){
            // delete by id or clear all rows.
            $result = [];
            $result['success'] = true;
            $taskId = $request->get("id");
            if($taskId > 0){
                $task = Task::find($taskId);
                if($task){
                    $task->delete(); // delete individual todo
                }               
            }else if($taskId == "all"){ // delete all rows
                Task::truncate();
            }
            
            return $result;

        }
        


    }
}
