import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings';

import FormCompany from '../../components/FormCompany';
import './styles.css';
import { HavePermission } from '../../services/auth';

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

    const toConfig = (IdAccount) => {
        window.location.href = '/account/' + IdAccount;
    }

    return (
        <div>

            {HavePermission(9) && <span className="btn-icon" onClick={handleClickOpen}><EditIcon /></span>}
            {HavePermission(10) && <span className="margin-left-icon btn-icon" onClick={() => { toConfig(props.data.idperson) }}><SettingsIcon /></span>}

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Editar conta</DialogTitle>
                <DialogContent>
                    <FormCompany
                        data={props.data}
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

export default EditDialog;