import React from 'react'

const CancelButton = ({ onClick, disabled }) => {
    
    const onClickInternal = (e) => {
        onClick();
        e.preventDefault();
        e.stopPropagation();
    }

    return (
    <button className="btn btn-danger" onClick={onClickInternal} disabled={disabled} >
        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
    </button>
)
    }
export default CancelButton;