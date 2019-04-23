import React, { useState, useContext } from 'react';
import { TrainingsServiceContext } from '../../services/trainings-service'

const INITIAL_STATE = {
    isAddMode: false,
    newTrainingName: ""
}

function NewTrainingForm(props) {
    const [state, setState] = useState(INITIAL_STATE)
    const trainingsService = useContext(TrainingsServiceContext);


    const onAddPressed = (e) => {
        setState({ isAddMode: true });
        e.preventDefault();
    }

    const onCancelPressed = (e) => {
        setState({ isAddMode: false });
        e.preventDefault();
    }

    const onConfirmPressed = (e) => {
        props.onAdd(state.newTrainingName);
        setState(INITIAL_STATE);
        e.preventDefault();
    }

    const onChange = event => {
        let newState = {...state};
        newState[event.target.name] = event.target.value;
        setState(newState);
        event.preventDefault();
    }

    return (
        <form className="form-group">
            {state.isAddMode &&
                <li className="list-group-item d-flex justify-content-between">
                    <input
                        name="newTrainingName"
                        type="text"
                        className="form-control"
                        placeholder="New Training"
                        value={state.newTrainingName}
                        onChange={onChange} />
                </li>
            }
            <div className="d-flex flex-row-reverse">
                {state.isAddMode &&
                    <>
                        <button className="btn btn-danger" onClick={onCancelPressed}>
                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </button>
                        <button className="btn btn-primary" onClick={onConfirmPressed} disabled={state.newTrainingName == null}>
                            <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                        </button>
                    </>
                }
                {!state.isAddMode &&
                    <>
                        <button className="btn btn-primary" onClick={onAddPressed}>
                            <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                        </button>
                    </>
                }
            </div>
        </form>
    );
}


export default NewTrainingForm;