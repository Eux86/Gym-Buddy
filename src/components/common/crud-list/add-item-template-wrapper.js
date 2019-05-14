import React, { useState, useEffect } from 'react';
import ConfirmButton from '../buttons/confirm-button';
import CancelButton from '../buttons/cancel-button';
import AddButton from '../buttons/add-button';

const INITIAL_STATE = {
    isAddMode: false,
    newElementName: ""
}

function AddItemTemplateWrapper({onAdd,children}) {
    const [state, setState] = useState(INITIAL_STATE);

    const onAddPressed = () => {
        setState({ isAddMode: true });
    }

    const onCancelPressed = () => {
        setState({ isAddMode: false });
    }

    const onConfirmPressed = () => {
        onAdd(state.newElementName);
        setState(INITIAL_STATE);
    }

    const onChange = value => {
        setState({...state, newElementName: value});
    }

    const onSubmit = () => {
        onConfirmPressed();
    }

    const childrenWithProps = React.Children.map(children, child =>
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
                    <AddButton onClick={onAddPressed} />
                }
            </div>
        </form>
    );
}


export default AddItemTemplateWrapper;