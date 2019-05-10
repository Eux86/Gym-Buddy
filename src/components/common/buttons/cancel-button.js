import React from 'react'
import ButtonContainer from './button-container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CancelButton = (props) => {

    return (
        <ButtonContainer {...props} className="btn-danger">
            <FontAwesomeIcon icon={['fas','times']} />
        </ButtonContainer>
    )
}
export default CancelButton;