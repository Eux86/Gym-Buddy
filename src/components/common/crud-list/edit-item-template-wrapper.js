import React, { useState, useEffect } from 'react';
import ConfirmButton from '../buttons/confirm-button';
import CancelButton from '../buttons/cancel-button';


function EditItemTemplateWrapper(props) {
    const [state, setState] = useState({ 
        editingItemId: null,
        editingValue: null,
        originalValue: null,
    });

    const attachProps = (component, pprops) =>
        React.cloneElement(component, { ...pprops }
    );

    const onEditCancelInternal = () => {
        setState({ ...state, editingItemId: null });
    }

    const onEditConfirmInternal = () => {
        onItemEdit(state.originalValue, state.editingValue);
        setState({ ...state, editingItemId: null, editingValue: null, originalValue: null });
    }

    const onChangeInternal = (item) => {
        setState({ ...state, editingValue: item });        
    }

    return (
        <div className="crud-list-item-template-content">
            {
                attachProps(itemEditTemplate, {
                    value: state.editingValue,
                    onSubmit: () => onEditConfirmInternal(),
                    onChange: (item) => onChangeInternal(item)
                })
            }
        </div>
        <div className="crud-list-actions">
            {onItemDelete && <ConfirmButton onClick={() => onEditConfirmInternal()} />}
            {onItemEdit && <CancelButton onClick={() => onEditCancelInternal()} />}
        </div>
    );
}


export default EditItemTemplateWrapper;