import React from 'react'
import PlusIcon from '../../images/plus.svg';

function Todoinput(props) {
    return (
        <div className="untuform">
            <input type="text" className="untuform__input" ref={props.theRef}  />
            <button className="untuform__addtodo" onClick={props.addTask}>
                <img src={PlusIcon} />
            </button>
        </div>
    )
}

export default Todoinput
