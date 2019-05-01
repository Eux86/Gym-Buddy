import React, { useState, useEffect } from 'react';
import EditButton from '../common/edit-button';
import CancelButton from '../common/cancel-button';
import ConfirmButton from '../common/confirm-button';


const INITIAL_STATE = {
    title: '',
    isEditMode: false,
}

const EditableTitle = (props) => {
    const [state, setState] = useState(INITIAL_STATE);

    useEffect(() => {
        setState({...state, title: props.title})
    }, [])
    
    const onChange = event => {
        setState({ ...state, [event.target.name]: event.target.value });
    };

    const onCancelPressed = () => {
        setState({...state, isEditMode: false})
    }

    const onConfirmPressed= () => {}

    const onEdit = () => {
        setState({...state, isEditMode: true})
    }
    
    return (
        <div>
            {!state.isEditMode &&
                <h1>
                    {state.title}
                    <EditButton noBorder onClick={() => onEdit(state.title)} />
                </h1>
            }
            {state.isEditMode &&
                <h1>
                    <input className="form-control" name="newValue" value={state.title} onChange={onChange} />
                    <CancelButton onClick={onCancelPressed} />
                    <ConfirmButton onClick={onConfirmPressed} disabled={state.title == null} />
                </h1>
            }
        </div>
    );
}

export default EditableTitle;