import React from 'react'

const EditButton = ({ onClick }) => (
    <button type="button" className="btn btn-default btn-md" onClick={onClick}>
        <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
    </button>
)
export default EditButton;