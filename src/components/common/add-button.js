import React from 'react'

const AddButton = ({ onClick }) => (
    <button type="button" className="btn btn-default btn-md" onClick={onClick}>
        <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
    </button>
)
export default AddButton;