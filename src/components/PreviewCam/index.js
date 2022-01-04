import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import VideocamIcon from '@material-ui/icons/Videocam';
import Cam from './cam';

const PreviewCam = React.forwardRef((props, ref) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    return (
        <div>
            <span className="btn-icon" onClick={handleClickOpen}>{props.text} {props.text === "" && <VideocamIcon />}</span>
            {/* <span className="margin-left-icon btn-icon" onClick={() => { }}><ListIcon /></span> */}
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Pré-visualização</DialogTitle>
                <DialogContent>
                    <Cam data={props} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Sair
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
})

export default PreviewCam;