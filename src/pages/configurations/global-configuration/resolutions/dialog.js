import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import FormResolution from '../../../../components/FormResolution';

import '../../styles.css';

const FormDialog = React.forwardRef((props, ref) => {
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
            <Fab color="secondary" onClick={handleClickOpen}>
                <AddIcon />
            </Fab>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Cadastrar resolução</DialogTitle>
                <DialogContent>
                    <FormResolution
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

export default FormDialog;