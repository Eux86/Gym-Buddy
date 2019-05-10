import './back-bar.css'

import React, { useState, useEffect } from 'react';


const BackBar = ({ label, linkTarget, history }) => {

    const onClick = (e) => {
        history.push(linkTarget);
        e.preventDefault();
        e.stopPropagation();
    }
   
    return (
        <div className="back-bar">
            <a href="#" onClick={onClick}>{label}</a>
        </div>
    );
}

export default BackBar;