import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonContainer from './button-container';

const ConfirmButton = (props) => {

    return (
        <ButtonContainer {...props}  className="btn-primary">
            <FontAwesomeIcon icon={['fas','check']} />
        </ButtonContainer>
    )
}
export default ConfirmButton;