import React from 'react'

const SimpleTextItemTemplate = ({item}) => {

    return (
        <div style={{alignItems:'center', display:'flex'}}>
            {item.name} 
        </div>
    )
}


export default SimpleTextItemTemplate;