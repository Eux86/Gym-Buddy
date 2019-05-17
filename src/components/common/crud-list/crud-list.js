import './crud-list.css'

import React, { useState } from 'react';

import DeleteButton from '../buttons/delete-button';
import AddItemTemplateWrapper from './add-item-template-wrapper';
import SimpleTextItemEditorTemplate from './item-templates/simple-text-editor-item-template.1';
import SimpleTextItemTemplate from './item-templates/simple-text-item-template';
import EditButton from '../buttons/edit-button';
import ConfirmButton from '../buttons/confirm-button';
import CancelButton from '../buttons/cancel-button';
import EditItemTemplateWrapper from './edit-item-template-wrapper';




const CrudList = ({ items, onItemSelect, onItemDelete, onItemEdit, onItemAdd, semaforeCondition, itemTemplate, itemEditTemplate, itemHeader }) => {
    const [state, setState] = useState({
        editingItemId: null,
    });

    const attachProps = (component, pprops) =>
        React.cloneElement(component, { ...pprops }
        );

    const onItemSelectInternal = (event, item) => {
        event.preventDefault();
        onItemSelect && onItemSelect(item.id);
    }

    const onEditInternal = (item) => {
        setState({ ...state, editingItemId: item.id });
    }

    const onEditCancelInternal = (item) => {
        setState({ ...state, editingItemId: null });
    }

    const onEditConfirmInternal = (original, edited) => {
        setState({ ...state, editingItemId: null });
        onItemEdit(original, edited);
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
                items.map(item => {
                    return <a
                        href="#"
                        key={item.id}
                        className={"list-group-item list-group-item-action " + (item.temp ? 'disabled' : '')}
                        onClick={event => onItemSelectInternal(event, item)}>
                        {item.temp &&
                            <div className="hover">
                                <div className="lds-facebook center-absolute"><div></div><div></div><div></div></div>
                            </div>
                        }
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
                                        {onItemDelete && <DeleteButton disabled={item.temp} onClick={() => onItemDelete(item)} />}
                                        {onItemEdit && <EditButton disabled={item.temp} onClick={() => onEditInternal(item)} />}
                                    </div>
                                </>
                                :
                                // EDIT
                                <>
                                    <EditItemTemplateWrapper
                                        value={item}
                                        onConfirm={onEditConfirmInternal}
                                        onCancel={onEditCancelInternal}>
                                        {itemEditTemplate}
                                    </EditItemTemplateWrapper>
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