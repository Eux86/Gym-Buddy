import './drag-handler.css';
import React from 'react';

const DragHandle = (props) => {
    const onClickInternal = (event) => {
        event.preventDefault();
        event.stopPropagation();
        props.onClick && props.onClick(event);
    }
    return (
        <div {...props} onClick={onClickInternal} className="drag-handler">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default DragHandle;