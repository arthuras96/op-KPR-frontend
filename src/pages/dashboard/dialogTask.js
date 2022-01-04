import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';

import FormTask from '../../components/FormTask';

import './styles.css';

const FormTaskDialog = React.forwardRef((props, ref) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function callBackCreate() {
        setOpen(false);
    }

    return (

        <div>
            <AddIcon fontSize="small" className="icon-add" onClick={handleClickOpen} />

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Cadastrar conta</DialogTitle>
                <DialogContent>
                    <FormTask
                        accountList={props.accountList}
                        account={props.account}
                        callbackParentCreate={() => props.callbackParentCreate()}
                        closeDialog={() => callBackCreate()}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
})

export default FormTaskDialog;