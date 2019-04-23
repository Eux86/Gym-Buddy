import React from 'react'

const AddButton = ({ OnClick }) => (
    <button type="button" className="btn btn-default btn-md" onClick={(e) => OnClick(e)}>
        <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
    </button>
)
export default AddButton;