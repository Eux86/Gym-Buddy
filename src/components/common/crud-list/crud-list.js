import './crud-list.css'

import React from 'react';

import DeleteButton from '../buttons/delete-button';
import ListControls from './list-controls';
import SimpleTextItemEditorTemplate from './item-templates/simple-text-editor-item-template.1';
import SimpleTextItemTemplate from './item-templates/simple-text-item-template';
import TwoColumnsItemTemplate from './item-templates/two-columns-item-template';




const CrudList = ({ items, onItemSelect, onItemDelete, onItemAdd, semaforeCondition, itemTemplate, itemEditTemplate, itemHeader }) => {

    const getColumnsLayout = () => {
        return semaforeCondition ? 'tree-columns' : 'two-columns';
    }

    const attachProps = (component, pprops) =>
        React.cloneElement(component, { ...pprops }
        );

    return (
        <div className="list-group">
            {/* HEADER */}
            <div className="list-group-item text-dark list-group-header">
                <div className={'crud-list-header ' + getColumnsLayout()}>
                    {semaforeCondition &&
                        <div className="semaforeHeader"></div>
                    }
                    {itemHeader ?
                        itemHeader
                        :
                        <div className="emptyHeader"></div>
                    }
                    <div className="actionsHeader"></div>
                </div>
            </div>
            {/* LIST */}
            {items &&
                items.map(item =>
                    <a
                        href="#"
                        key={item.id}
                        className="list-group-item text-dark"
                        onClick={(event) => { event.preventDefault(); onItemSelect(item.id) }}>
                        <div className={'crud-list-row ' + getColumnsLayout()}>
                            {semaforeCondition &&
                                <div className="led-column">
                                    <div className={(semaforeCondition(item) ? "led-green" : "led-grey")}></div>
                                </div>
                            }
                            <div className="crud-list-item-template-content">
                                {itemTemplate ?
                                    attachProps(itemTemplate, { item })
                                    :
                                    <SimpleTextItemTemplate item={item} />
                                }
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