import React from 'react';
import DeleteButton from '../common/delete-button';

const TrainingDay = (props) => {
    const {training} = props;

    const onClick = (event,id) => {
        event.preventDefault();
        props.onClick();
    }

    return(training && 
        <li className="list-group-item d-flex justify-content-between">
            <a href="#" onClick={(event) => onClick(event)}>
                <div>
                    {training.name}
                </div>
            </a>
            <div className="mx-2">
                <DeleteButton onClick={() => props.onDelete(training.id)} />
            </div>
        </li>
    );
}

export default TrainingDay;