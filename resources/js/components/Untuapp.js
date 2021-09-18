import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';


import Header from "./Header"
import Todoinput from "./Todoinput"
import Todos from "./Todos"
import Cta from "./Cta"
import Loader from "./Loader"

function Untuapp() {

    const delete_time = 5; // todo will delete autometically after 5 min.
    const delete_time_ms = delete_time * 60 * 1000; // 5 min in milliseconds

    const [tasks, setTask] = useState([]); // list of all todos and set todos
    const [updateCount, setTotalUpdateCount] = useState(0);
    const [loading, showLoading] = useState(true);
    const [counter, setCounter] = useState(0);
    const taskInput = useRef(null);

    var propObject = {};


    // load data from database for the first time when page load.
    function loadData(){

        (async () => {
            var data = {};
            data.action = "loaddata";
            data.active = true;
            var response = await axios.post('/ajax', data);
            var rows = response.data;
            showLoading(false);
            setTask(rows);

        })();
    }

    // load all task on page load
    useEffect(() => {
        console.log("Load data from db");
        loadData();

        // this interval will check if a task is already reached to its life - 5 min 
        setInterval(()=>{
            setCounter(previousCount => previousCount + 1);
        },10000);

    },[]);

    // this hook will invoke when the counter state is updated. from previous setinterval call.
    // and will check the 5 min life time for a todo and delete that todo item.
    useEffect(() => {
        checkTaskLifeAndDelete();
    },[counter]);





    function checkTaskLifeAndDelete(){
        var currentTimeInMS = new Date().getTime();
        var deletingItems = [];
        
        
        var endingTasks = tasks.forEach(function(task, index){
            var item = {};
            if(task.delete_time < currentTimeInMS){
                item.index = index;
                item.task = task;

                deletingItems.push(item); // this todo already exceed 5 min duration as life time.
            }
        });
        if(deletingItems.length){
            deletingItems.forEach(function(item){
                // delete todo that exceed 5 min duration.
                propObject.deleteTask(item.index, item.task, false);
            });
        }
    }


    propObject.onCompleteTask = function(index, task){

        // update the check box for todo - is it completed ?
        task.complete = !task.complete;
        tasks[index] = task; // replace the old todo item.
        

        // reset tasks 
        setTask(previousTasks => {

            // hack start - this state change is a hack - sometime changing the complete status of a todo - do not effect immediately in UI. thats why changing a state variable will re-render the component. and check uncheck will reflect in ui immediately. 
            setTotalUpdateCount(previousCount => previousCount + 1);
            // hack end

            return tasks;
        });
    }

    propObject.saveTasks = function(){

        // var updatedTask = tasks.filter(function(task){
        //     return task.complete;
        // });
        showLoading(true);
        (async () => {
            // POST request using axios with async/await
            var data = {};
            data.action = "save";
            data.tasks = tasks;
            var response = await axios.post('/ajax', data);
            var rows = response.data;
            showLoading(false);
           
        })();

    }

    propObject.loadTasks = function(){
        showLoading(true);
        loadData();
    }

    propObject.clearTasks = function(){

        var yes = confirm("Do you want to clear all items ?");
        if(yes){
            deleteOrClear("all");
            setTask([]);
        }


    }

    propObject.deleteTask = function(index, task, alert = true){

        var yes = false ;
        if(alert){
            yes = confirm("Do you want to delete this item ?");
        }
        if(yes || !alert){
            deleteOrClear(task.id);
            tasks.splice(index, 1);
            //delete tasks[index];
            setTask(previousTasks => {
                setTotalUpdateCount(previousCount => previousCount + 1);
                return tasks;
            });
        }
    }

    function deleteOrClear(taskid){

        (async () => {
            // POST request using axios with async/await
            var data = {};
            data.action = "delete";
            data.id = taskid;
            var response = await axios.post('/ajax', data);
            var rows = response.data;
            showLoading(false);
           
        })();


    }





    function addTask(){

        var task = taskInput.current.value.trim();
        if(!task || task.length <= 0){
            return;
        }

      var currentTimeInMS = new Date().getTime(); // time in milliseconds. 
      var item = {
            task_id : currentTimeInMS,
            task : task,
            complete : false,
            create_time : currentTimeInMS,
            delete_time : currentTimeInMS + delete_time_ms

        };

        (async () => {
            // POST request using axios with async/await
            var data = {};
            data.action = "addtask";
            data.item = item;
            var response = await axios.post('/ajax', data);

            item.id = response.id;
            var row = response.data;

            setTask(previousTasks => {
                taskInput.current.value = "";
                return [...previousTasks, row ];
                
            });

        })();


    }

        return (
            <>
            <div id="untu">
                <Header />
                <main className="py-4 container">
                        <Todoinput addTask={addTask} theRef={taskInput}/>

                        <div className="todos__container">
                        <Todos tasks={tasks} untuFunctions={propObject}/>
                        </div>
                        <Cta untuFunctions={propObject}/>
                </main>
            </div>

            {loading && <Loader />}
            </>
        );

}

export default Untuapp;

if (document.getElementById('untuapp')) {
    ReactDOM.render(<Untuapp />, document.getElementById('untuapp'));
}
