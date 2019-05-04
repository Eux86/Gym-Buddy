import React from 'react'

const AddButton = ({ onClick }) => {

    const onClickInternal = (e) => {
        onClick();
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <button type="button" className="btn btn-default btn-md" onClick={onClickInternal}>
            <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
        </button>
    )
}
export default AddButton;