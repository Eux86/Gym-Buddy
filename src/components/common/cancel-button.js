import React from 'react'

const CancelButton = ({ onClick, disabled }) => (
    <button className="btn btn-danger" onClick={(e) => onClick(e)} disabled={disabled} >
        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
    </button>
)
export default CancelButton;