import React from 'react'

const ConfirmButton = ({ onClick, disabled }) => (
    <button className="btn btn-primary" onClick={(e) => onClick(e)} disabled={disabled} >
        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
    </button>
)
export default ConfirmButton;