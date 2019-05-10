import './editable-title.css'

import React, { useState, useEffect } from 'react';
import EditButton from '../buttons/edit-button';
import CancelButton from '../buttons/cancel-button';
import ConfirmButton from '../buttons/confirm-button';



const INITIAL_STATE = {
    title: '',
    newTitle: '',
    isEditMode: false,
}

const EditableTitle = ({ title, onChange }) => {
    const [state, setState] = useState(INITIAL_STATE);

    useEffect(() => {
        setState({ ...state, title: title });

        return () => {
            const inputEl = document.getElementById('titleEditor');
            inputEl && inputEl.focus();
        }
    }, [title, state.isEditMode])

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
        setState({ ...state, isEditMode: true, newTitle: title });
    }

    const onKeyPressed = (e) => {
        if (e.key === 'Enter') {
            onConfirmPressed();
        }
    }

    return (
        <div className="editable-title"> 
            {!state.isEditMode &&
                <div className="title-label">
                    {state.title}
                    <EditButton noBorder onClick={() => onEdit(state.title)} />
                </div>
            }
            {state.isEditMode &&
                <>
                    <div className="input-group">
                        <input 
                            id="titleEditor" 
                            type="text" 
                            className="title-input" 
                            name="newTitle" 
                            value={state.newTitle} 
                            onChange={onChangeInternal} 
                            onKeyPress={onKeyPressed}/>
                        <div className="actions">
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