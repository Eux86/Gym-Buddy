import React from 'react'

const TwoColumnsItemEditorTemplate = ({onSubmit, onChange, value}) => {

    const onChangeInternal = (event) => {
        onChange({ ...value, [event.target.name]: event.target.value });
    }
    
    const onKeyPressed = (e) => {
        if (e.key === 'Enter') {
            onSubmit();
        }
    }

    return (
        <>
            <input
                name="repetitions"
                type="text"
                className="form-control"
                value={value && value.repetitions}
                onChange={onChangeInternal}
                onKeyPress={onKeyPressed} />
            <input
                name="amount"
                type="text"
                className="form-control"
                value={value && value.amount}
                onChange={onChangeInternal}
                onKeyPress={onKeyPressed} />
        </>
    )
}


export default TwoColumnsItemEditorTemplate;