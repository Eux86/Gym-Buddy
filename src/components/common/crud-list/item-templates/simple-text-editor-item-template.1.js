import React from 'react'

const SimpleTextItemEditorTemplate = (props) => {
    const onChange = (event) => {
        props.onChange(event.target.value);
    }

    const onKeyPressed = (e) => {
        if (e.key === 'Enter') {
            props.onSubmit();
        }
    }

    return (
        <input
            name="newElementName"
            type="text"
            className="form-control"
            placeholder="New Exercise"
            value={props.value}
            onChange={onChange}
            onKeyPress={onKeyPressed} />
    )
}


export default SimpleTextItemEditorTemplate;