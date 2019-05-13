import './crud-list.css'

import React, { useState } from 'react';

import DeleteButton from '../buttons/delete-button';
import AddItemTemplateWrapper from './add-item-template-wrapper';
import SimpleTextItemEditorTemplate from './item-templates/simple-text-editor-item-template.1';
import SimpleTextItemTemplate from './item-templates/simple-text-item-template';
import EditButton from '../buttons/edit-button';
import ConfirmButton from '../buttons/confirm-button';
import CancelButton from '../buttons/cancel-button';




const CrudList = ({ items, onItemSelect, onItemDelete, onItemEdit, onItemAdd, semaforeCondition, itemTemplate, itemEditTemplate, itemHeader }) => {
    const [state, setState] = useState({ 
        editingItemId: null,
        editingValue: null,
        originalValue: null,
    });

    const attachProps = (component, pprops) =>
        React.cloneElement(component, { ...pprops }
        );

    const onItemSelectInternal = (event,item) => {
        event.preventDefault();
        onItemSelect && onItemSelect(item.id);
    }
    
    const onEditInternal = (item) => {
        setState({ ...state, editingItemId: item.id, editingValue: item, originalValue: item });
    }

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

    const isBeingEdited = (item) => {
        return state.editingItemId === item.id;
    }

    return (
        <div className="list-group">
            {/* HEADER */}
            {itemHeader &&
                <div className="list-group-item text-dark list-group-header">
                    <div className="crud-list-row">
                        {semaforeCondition &&
                            <div className="semaforeHeader"></div>
                        }
                        {itemHeader}
                        <div className="crud-list-actions" style={{ visibility: 'hidden' }}>
                            {onItemDelete && <DeleteButton />}
                            {onItemEdit && <EditButton />}
                        </div>
                    </div>
                </div>
            }
            {/* LIST */}
            {items &&
                items.map(item =>{ 
                    return <a
                        href="#"
                        key={item.id}
                        className="list-group-item text-dark"
                        onClick={event => onItemSelectInternal(event,item)}>
                        <div className="crud-list-row">
                            {semaforeCondition &&
                                <div className="led-column">
                                    <div className={(semaforeCondition(item) ? "led-green" : "led-grey")}></div>
                                </div>
                            }
                            {!isBeingEdited(item) ?
                                // VIEW
                                <>  
                                    <div className="crud-list-item-template-content">
                                        {
                                            itemTemplate ?
                                                attachProps(itemTemplate, { item })
                                                :
                                                <SimpleTextItemTemplate item={item} />
                                        }
                                    </div>
                                    <div className="crud-list-actions">
                                        {onItemDelete && <DeleteButton onClick={() => onItemDelete(item)} />}
                                        {onItemEdit && <EditButton onClick={() => onEditInternal(item)} />}
                                    </div>
                                </>
                                :
                                // EDIT
                                <>
                                    <div className="crud-list-item-template-content">
                                        {
                                            attachProps(itemEditTemplate, { 
                                                value:state.editingValue, 
                                                onSubmit:() => onEditConfirmInternal(), 
                                                onChange:(item) => onChangeInternal(item) })
                                        }
                                    </div>
                                    <div className="crud-list-actions">
                                        {onItemDelete && <ConfirmButton onClick={() => onEditConfirmInternal()} />}
                                        {onItemEdit && <CancelButton onClick={() => onEditCancelInternal()} />}
                                    </div>
                                </>
                            }
                        </div>
                    </a>
                })
            }
            <AddItemTemplateWrapper onAdd={onItemAdd}>
                {itemEditTemplate ?
                    itemEditTemplate
                    :
                    <SimpleTextItemEditorTemplate />
                }
            </AddItemTemplateWrapper>
        </div>
    )
}


export default CrudList;