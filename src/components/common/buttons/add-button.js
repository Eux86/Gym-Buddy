import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonContainer from './button-container';

const AddButton = (props) => {

    return (
        <ButtonContainer {...props}  className="btn-primary">
            <FontAwesomeIcon icon={['fas','plus']} />
        </ButtonContainer>
    )
}
export default AddButton;   