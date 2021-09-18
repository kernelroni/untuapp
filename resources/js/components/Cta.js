import React from 'react'

function Cta(props) {
    return (
        <div className="cta">
        <button className="cta__btn cta__btn__save" onClick={props.untuFunctions.saveTasks}>Save</button>
        <button className="cta__btn cta__btn__load" onClick={props.untuFunctions.loadTasks}>Load</button>
        <button className="cta__btn cta__btn__clear" onClick={props.untuFunctions.clearTasks}>Clear</button>
    </div>
    )
}

export default Cta
