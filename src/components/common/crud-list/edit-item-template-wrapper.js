import React, { useState, useEffect } from 'react';
import ConfirmButton from '../buttons/confirm-button';
import CancelButton from '../buttons/cancel-button';


function EditItemTemplateWrapper({value, children, onConfirm, onCancel}) {
    const [state, setState] = useState({
        editingValue: null,
        originalValue: null,
    });

    useEffect(() => {
        setState({...state,editingValue: value, originalValue: value});
    },[])

    const attachProps = (component, pprops) =>
        React.cloneElement(component, { ...pprops }
    );

    const onEditCancelInternal = () => {
        onCancel();
    }

    const onEditConfirmInternal = () => {
        onConfirm(state.originalValue, state.editingValue);
    }

    const onChangeInternal = (item) => {
        setState({ ...state, editingValue: item });
    }

    return (
        <>
            <div className="crud-list-item-template-content">
                {
                    attachProps(children, {
                        value: state.editingValue,
                        onSubmit: () => onEditConfirmInternal(),
                        onChange: (item) => onChangeInternal(item)
                    })
                }
            </div>
            <div className="crud-list-actions">
                <ConfirmButton onClick={() => onEditConfirmInternal()} />
                <CancelButton onClick={() => onEditCancelInternal()} />
            </div>
        </>
    );
}


export default EditItemTemplateWrapper;