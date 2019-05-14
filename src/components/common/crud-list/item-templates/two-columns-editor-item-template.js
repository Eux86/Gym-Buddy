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
                type="number" step="1" inputMode="numeric" pattern="[0-9]*"
                name="repetitions"
                type="text"
                className="form-control"
                value={value && value.repetitions}
                onChange={onChangeInternal}
                onKeyPress={onKeyPressed} />
            <input
                type="number" step="1" inputMode="numeric" pattern="[0-9]*"
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