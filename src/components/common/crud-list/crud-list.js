import './crud-list.css'

import React from 'react';

import DeleteButton from '../buttons/delete-button';
import ListControls from './list-controls';
import SimpleTextItemEditorTemplate from './item-templates/simple-text-editor-item-template.1';
import SimpleTextItemTemplate from './item-templates/simple-text-item-template';




const CrudList = ({ items, onItemSelect, onItemDelete, onItemAdd, semaforeCondition }) => {

    return (
        <div className="list-group">
            {items &&
                items.map(item =>
                    <a
                        href="#"
                        key={item.id}
                        className="list-group-item text-dark"
                        onClick={(event) => { event.preventDefault(); onItemSelect(item.id) }}>
                        <div className="crud-list-row">
                            {semaforeCondition ?
                                <div className={"led-column " + (semaforeCondition(item) ? "led-green" : "led-grey")}>
                                </div>
                                :
                                <div></div>
                            }
                            <div className="crud-list-item-template-content">
                                <SimpleTextItemTemplate item={item} />
                            </div>
                            <div className="crud-list-actions">
                                <DeleteButton onClick={() => onItemDelete(item.id)} />
                            </div>
                        </div>
                    </a>
                )
            }
            <ListControls onAdd={onItemAdd}>
                <SimpleTextItemEditorTemplate />
            </ListControls>
        </div>
    )
}


export default CrudList;