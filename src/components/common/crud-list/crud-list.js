import './crud-list.css'

import React from 'react';

import DeleteButton from '../delete-button';
import ListControls from './list-controls';
import SimpleTextItemEditorTemplate from './item-templates/simple-text-editor-item-template.1';
import SimpleTextItemTemplate from './item-templates/simple-text-item-template';




const CrudList = ({ items, onItemSelect, onItemDelete, onItemAdd, semaforeCondition }) => {

    // const isSemaforeOn = (lastUpdateDate) => {
    //     const lastUpdate = DatetimeHelper.getUtcDateWithoutTime(new Date(lastUpdateDate)).getTime();
    //     const today = DatetimeHelper.getUtcDateWithoutTime(new Date()).getTime();
    //     return lastUpdate === today;
    // }

    return (
        <div className="list-group">
            {
                items.map(item =>
                    <button
                        key={item.id}
                        className="list-group-item"
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
                    </button>
                )
            }
            <ListControls onAdd={onItemAdd}>
                <SimpleTextItemEditorTemplate />
            </ListControls>
        </div>
    )
}


export default CrudList;