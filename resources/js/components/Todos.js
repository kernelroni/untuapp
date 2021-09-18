import React from 'react';

function Todos(props) {

    
    if(!props.tasks.length){

        return (

            <div className="no-task">Todo list empty.</div>

        )
    }



    return (

        <ul className="todos">

        {props.tasks.map((task,index) => {

        var completeClass = task.complete ? "todos__item__check--active" : "";

        return <li className="todos__item" key={task.id}>

            <button className={`todos__item__check ${completeClass} todos__item__el`}
            onClick={()=>{
                props.untuFunctions.onCompleteTask(index, task);
            }}>
            <img src="/images/check.svg" />
            </button>

            <div className="todos__item__label todos__item__el">{task.task}</div>

            <button className="todos__item__delete todos__item__el"
            onClick={()=>{
                props.untuFunctions.deleteTask(index, task);
            }}
            ><img src="/images/x.svg" /></button>
        </li>

        })}


        </ul>
    )
}

export default Todos;
