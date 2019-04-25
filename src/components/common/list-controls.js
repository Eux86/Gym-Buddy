import React, { useState, useEffect } from 'react';

const INITIAL_STATE = {
    isAddMode: false,
    newElementName: ""
}

function ListControls(props) {
    const [state, setState] = useState(INITIAL_STATE)

    const onAddPressed = (e) => {
        setState({ isAddMode: true });
        e.preventDefault();
    }

    const onCancelPressed = (e) => {
        setState({ isAddMode: false });
        e.preventDefault();
    }

    const onConfirmPressed = (e) => {
        props.onAdd(state.newElementName);
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
                        name="newElementName"
                        type="text"
                        className="form-control"
                        placeholder="New Training"
                        value={state.newElementName}
                        onChange={onChange} />
                </li>
            }
            <div className="d-flex flex-row-reverse">
                {state.isAddMode &&
                    <>
                        <button className="btn btn-danger" onClick={onCancelPressed}>
                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </button>
                        <button className="btn btn-primary" onClick={onConfirmPressed} disabled={state.newElementName == null}>
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


export default ListControls;