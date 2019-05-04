import React from 'react'

const ConfirmButton = ({ onClick, disabled }) => {

    const onClickInternal = (e) => {
        onClick();
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <button className="btn btn-primary" onClick={onClickInternal} disabled={disabled} >
            <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
        </button>
    )
}
export default ConfirmButton;