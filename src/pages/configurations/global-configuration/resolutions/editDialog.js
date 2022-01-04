import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DeleteIcon from '@material-ui/icons/Delete';

import FormResolution from '../../../../components/FormResolution';
import '../../styles.css';

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
            {props.data.sequence === 1 &&
                <span className="margin-left-icon btn-icon btn-disabled" onClick={() => { }}><ArrowUpwardIcon className="btn-disabled" /></span>
            }
            {props.data.sequence !== 1 &&
                <span className="margin-left-icon btn-icon" onClick={() => { props.upResolution(props.data) }}><ArrowUpwardIcon /></span>
            }
            {props.data.sequence === props.data.length &&
                <span className="margin-left-icon btn-icon btn-disabled" onClick={() => { }}><ArrowDownwardIcon /></span>
            }
            {props.data.sequence !== props.data.length &&
                <span className="margin-left-icon btn-icon" onClick={() => { props.downResolution(props.data) }}><ArrowDownwardIcon /></span>
            }
            <span className="margin-left-icon btn-icon" onClick={() => { }}><DeleteIcon /></span>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Editar resolução</DialogTitle>
                <DialogContent>
                    <FormResolution
                        data={props.data}
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