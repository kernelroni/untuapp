import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PlusIcon from '../../images/plus.svg';

import Todos from "./Todos"


function Untuapp() {

    const delete_time = 5; // in minute
    const delete_time_ms = delete_time * 60 * 1000;

    const [tasks, setTask] = useState([]);
    const [updateCount, setTotalUpdateCount] = useState(0);
    const [loading, showLoading] = useState(true);
    const [counter, setcounter] = useState(0);
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
            setcounter(previousCount => previousCount + 1);
        },10000);

    },[]);

    // this hook will invoke when the counter state is updated. from previous setinterval call.
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

                deletingItems.push(item);
            }
        });
        if(deletingItems.length){
            deletingItems.forEach(function(item){
                propObject.deleteTask(item.index, item.task, false);
            });
        }
    }


    propObject.onCompleteTask = function(index, task){

        //console.log({index, task});

        task.complete = !task.complete;
        tasks[index] = task;

        
        setTask(previousTasks => {
            setTotalUpdateCount(previousCount => previousCount + 1);
            return tasks;
        });
    }

    propObject.saveTasks = function(){

        // var updatedTask = tasks.filter(function(task){
        //     return task.complete;
        // });

        (async () => {
            // POST request using axios with async/await
            var data = {};
            data.action = "save";
            data.tasks = tasks;
            var response = await axios.post('/ajax', data);
            var rows = response.data;
            showLoading(false);
           
        })();

        console.log(updatedTask);


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

      var uniqueId = new Date().getTime(); // time in milliseconds. 
      var item = {
            id: uniqueId,
            task_id : uniqueId,
            task : task,
            complete : false,
            create_time : uniqueId,
            delete_time : uniqueId + delete_time_ms

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

    if(loading){
        return (
            <div className="loadingapp">
                <div>
                <div className="loader"></div>
                <div>Loading...</div>
                </div>
            </div>
        );
    }else{

        return (

            <>
                        
                        <div className="untuform">
                            <input type="text" className="untuform__input" ref={taskInput}  />
                            <button className="untuform__addtodo" onClick={addTask}><img src={PlusIcon}
                             /></button>
                        </div>

                        <div className="todos__container">
                        <Todos tasks={tasks} untuFunctions={propObject} updateCount={updateCount}/>
                        </div>
                        <div className="cta">
                            <button className="cta__btn cta__btn__save" onClick={propObject.saveTasks}>Save</button>
                            <button className="cta__btn cta__btn__load" onClick={propObject.loadTasks}>Load</button>
                            <button className="cta__btn cta__btn__clear" onClick={propObject.clearTasks}>Clear</button>
                        </div>

            </>

        );
    }
}

export default Untuapp;

if (document.getElementById('untuapp')) {
    ReactDOM.render(<Untuapp />, document.getElementById('untuapp'));
}
