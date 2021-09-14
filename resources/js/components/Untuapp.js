import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PlusIcon from '../../images/plus.svg';

import Todos from "./Todos"


function Untuapp() {

    const delete_time = 5; // in minute
    const delete_time_ms = delete_time * 60 * 1000;

    const [tasks, setTask] = useState([]);
    const [updateCount, setTotalUpdateCount] = useState(0);
    const taskInput = useRef(null);

    var propObject = {};


    function loadData(){

        (async () => {
            // POST request using axios with async/await
            var data = {};
            data.action = "loaddata";
            data.active = true;
            var response = await axios.post('/ajax', data);
            var rows = response.data;

            setTask(rows);

        })();


    }

    useEffect(() => {

        loadData();
    },[]);



    propObject.onCompleteTask = function(index, task){

        console.log({index, task});

        task.complete = !task.complete;
        tasks[index] = task;

        
        setTask(previousTasks => {
            setTotalUpdateCount(previousCount => previousCount + 1);
            return tasks;
        });
    }

    propObject.saveTasks = function(){

        var updatedTask = tasks.filter(function(task){
            return task.complete;
        });
        console.log(updatedTask);


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

    return (

        <>
       
                    <div className="untuform">
                        <input type="text" className="untoform__input" ref={taskInput}  />
                        <button className="nutoform__addtodo"><img src={PlusIcon}
                        onClick={addTask} /></button>
                    </div>

                    <div className="todos__container">
                    <Todos tasks={tasks} untuFunctions={propObject} updateCount={updateCount}/>
                    </div>
                    <div className="cta">
                        <button className="cta__btn cta__btn__save" onClick={propObject.saveTasks}>Save</button>
                        <button className="cta__btn cta__btn__load">Load</button>
                        <button className="cta__btn cta__btn__clear">Clear</button>
                    </div>

        </>

    );
}

export default Untuapp;

if (document.getElementById('untuapp')) {
    ReactDOM.render(<Untuapp />, document.getElementById('untuapp'));
}
