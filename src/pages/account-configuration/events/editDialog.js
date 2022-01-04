import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import ListIcon from '@material-ui/icons/List';

import FormEvent from '../../../components/FormEvent';
import '../styles.css';

const EditDialog = React.forwardRef((props, ref) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function closeDialog() { // Função enviada para fechar form suspenso.
        setOpen(false);
    }

    return (
        <div>
            <span className="btn-icon" onClick={handleClickOpen}><EditIcon /></span>
            <span className="margin-left-icon btn-icon" onClick={() => { }}><ListIcon /></span>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Editar evento</DialogTitle>
                <DialogContent>
                    <FormEvent
                        event={props.event}
                        account={props.account}
                        callbackParentCreateEdit={() => props.callbackParentCreateEdit()} // Callback do primario sendo enviado para retorno
                        closeDialog={() => closeDialog()} // Callback sendo enviado para fechar o form
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

export default EditDialog;