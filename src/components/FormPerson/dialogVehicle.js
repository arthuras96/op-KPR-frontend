import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import FormVehicle from '../FormVehicle';
//import '../../../styles.css';

const FormDialogVehicle = React.forwardRef((props, ref) => {
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

    console.log(props.account);

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Cadastrar veículo
            </Button>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Cadastrar veículo</DialogTitle>
                <DialogContent>
                    <FormVehicle
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

export default FormDialogVehicle;