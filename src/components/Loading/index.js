import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import './styles.css';

function Loading(props) {
    return (
        <Backdrop open={props.on} className="backdrop">
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}

export default Loading;