import React, { useState, useEffect } from 'react';
import EditButton from './edit-button';
import CancelButton from './cancel-button';
import ConfirmButton from './confirm-button';


const INITIAL_STATE = {
    title: '',
    newTitle: '',
    isEditMode: false,
}

const EditableTitle = ({ title, onChange }) => {
    const [state, setState] = useState(INITIAL_STATE);

    useEffect(() => {
        setState({ ...state, title: title })
    }, [title])

    const onChangeInternal = event => {
        setState({ ...state, [event.target.name]: event.target.value });
    };

    const onCancelPressed = () => {
        setState({ ...state, isEditMode: false })
    }

    const onConfirmPressed = () => {
        onChange(state.newTitle);
        setState({ ...state, isEditMode: false })
    }

    const onEdit = () => {
        setState({ ...state, isEditMode: true, newTitle: title })
    }

    return (
        <div className="container">
            {!state.isEditMode &&
                <h1>
                    {state.title}
                    <EditButton noBorder onClick={() => onEdit(state.title)} />
                </h1>
            }
            {state.isEditMode &&
                <>
                    <div class="input-group">
                        <input type="text" className="form-control" name="newTitle" value={state.newTitle} onChange={onChangeInternal} />
                        <div className="input-group-btn">
                            <CancelButton onClick={onCancelPressed} />
                            <ConfirmButton onClick={onConfirmPressed} disabled={state.title == null} />
                        </div>
                    </div>
                </>
            }
        </div>
    );
}

export default EditableTitle;