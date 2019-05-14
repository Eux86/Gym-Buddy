import React from 'react'

const TwoColumnsItemTemplate = ({item}) => {

    return (
        <div style={{
            display: 'flex', 
            width: '100%',
            justifyContent: 'space-around',
            alignItems: 'center',    
        }}>
            <div className="col1">{item.repetitions}</div>
            <div className="col2">{item.amount}</div>
        </div>
    )
}

export default TwoColumnsItemTemplate;