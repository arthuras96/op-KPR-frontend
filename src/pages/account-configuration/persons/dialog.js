import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import FormPerson from '../../../components/FormPerson';

import '../styles.css';

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
            {props.typebtn === 1 &&
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Cadastrar pessoa
                </Button>
            }

            {props.typebtn === 2 &&
                <Fab color="secondary" onClick={handleClickOpen}>
                    <AddIcon />
                </Fab>
            }

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Cadastrar pessoa</DialogTitle>
                <DialogContent>
                    <FormPerson
                        idResident={0}
                        account={props.account}
                        callbackParentCreateEdit={() => props.callbackParentCreateEdit()} // Callback do primario sendo enviado para retorno
                        closeDialog={() => closeDialog()}
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