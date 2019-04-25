import React from 'react'

const DeleteButton = ({ onClick }) => (
    <button type="button" className="btn btn-default btn-md" onClick={(e) => onClick(e)}>
        <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
    </button>
)
export default DeleteButton;