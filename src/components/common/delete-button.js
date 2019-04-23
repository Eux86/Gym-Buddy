import React from 'react'

const DeleteButton = ({ OnClick }) => (
    <button type="button" className="btn btn-default btn-md" onClick={(e) => OnClick(e)}>
        <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
    </button>
)
export default DeleteButton;