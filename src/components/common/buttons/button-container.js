import React from 'react'

const ButtonContainer = (props) => {

    const onClickInternal = (e) => {
        props.onClick();
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <button type="button" className={"btn  "+props.className || ""} onClick={onClickInternal}>
            {props.children}
        </button>
    )
}
export default ButtonContainer;   