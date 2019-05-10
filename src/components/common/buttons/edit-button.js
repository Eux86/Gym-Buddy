import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonContainer from './button-container';

const EditButton = (props) => {

    return (
        <ButtonContainer {...props}  className="btn-default">
            <FontAwesomeIcon icon={['fas','pencil-alt']} />
        </ButtonContainer>
    )
}
export default EditButton;