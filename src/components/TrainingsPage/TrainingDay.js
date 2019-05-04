import React from 'react';
import DeleteButton from '../common/delete-button';

const TrainingDay = (props) => {
    const { training } = props;

    const onClick = (event, id) => {
        event.preventDefault();
        props.onClick();
    }

    return (training &&
        <button onClick={onClick} className="list-group-item d-flex justify-content-between">
            <div>
                {training.name}
            </div>
            <div className="mx-2">
                <DeleteButton onClick={() => props.onDelete(training.id)} />
            </div>
        </button>
    );
}

export default TrainingDay;