import React, { useState, useEffect } from 'react';
import ConfirmButton from '../confirm-button';
import CancelButton from '../cancel-button';

const INITIAL_STATE = {
    isAddMode: false,
    newElementName: ""
}

function ListControls(props) {
    const [state, setState] = useState(INITIAL_STATE);

    const onAddPressed = (e) => {
        setState({ isAddMode: true });
        e.preventDefault();
    }

    const onCancelPressed = () => {
        setState({ isAddMode: false });
    }

    const onConfirmPressed = () => {
        props.onAdd(state.newElementName);
        setState(INITIAL_STATE);
    }

    const onChange = value => {
        setState({...state, newElementName: value});
    }

    const onSubmit = () => {
        onConfirmPressed();
    }

    const childrenWithProps = React.Children.map(props.children, child =>
        React.cloneElement(child, { value: state.newElementName, onChange: onChange, onSubmit: onSubmit })
    );

    return (
        <form className="form-group" onSubmit={() => alert('submitted')}>
            {state.isAddMode &&
                <li className="list-group-item d-flex justify-content-between">
                    {childrenWithProps} 
                </li>
            }
            <div className="d-flex flex-row-reverse">
                {state.isAddMode &&
                    <>
                        <CancelButton onClick={onCancelPressed} />
                        <ConfirmButton onClick={onConfirmPressed} disabled={state.newElementName == null} />
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