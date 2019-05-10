import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonContainer from './button-container';

const DeleteButton =  (props) => {

    const onDeleteClick = () => {
        if (window.confirm("Are you sure?")){
            props.onClick();
        }
    }

    return (
        <ButtonContainer {...props} onClick={onDeleteClick} className="btn-default">
            <FontAwesomeIcon icon={['fas','trash']} />
        </ButtonContainer>
    )
}
export default DeleteButton;