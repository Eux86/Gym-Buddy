import React from 'react';

const TrainingDay = (props) => {
    const {training} = props;

    const onClick = (event,id) => {
        event.preventDefault();
        props.onClick();
    }

    const deleteTraining = (e,id) => {
        props.onDelete(id);
        e.preventDefault();
    }

    return(training && 
        <li className="list-group-item d-flex justify-content-between">
            <a href="#" onClick={(event) => onClick(event)}>
                <div>
                    {training.name}
                </div>
            </a>
            <div className="mx-2">
                <button type="button" className="btn btn-default btn-md" onClick={(event) => deleteTraining(event, training.id)}>
                    <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                </button>
            </div>
        </li>
    );
}

export default TrainingDay;