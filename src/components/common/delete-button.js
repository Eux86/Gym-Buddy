import React from 'react'

const DeleteButton = ({ onClick }) => {

    const onDeleteClick = (e) => {
        if (window.confirm("Are you sure?")){
            onClick();
        }
        e.preventDefault();
    }

    return (
        <button type="button" className="btn btn-default btn-md" onClick={(e) => onDeleteClick(e)}>
            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
        </button>
    )
}
export default DeleteButton;