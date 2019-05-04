import React from 'react'

const EditButton = ({ onClick, noBorder }) => {
    const borderType = !noBorder || "none";

    const onClickInternal = (e) => {
        onClick();
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <button type="button"
            className="btn btn-default btn-md"
            style={{ border: borderType }}
            onClick={onClickInternal}>
            <span
                className="glyphicon glyphicon-pencil"
                aria-hidden="true"></span>
        </button>
    )
}
export default EditButton;