import React, { Component } from 'react';
import MaterialTable from 'material-table';

import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';

import '../styles.css';
import FormDialog from './dialog';
import EditDialog from './editDialog';
import Loading from '../../../components/Loading';
import Api from '../../../services/api';

class Devices extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Status', field: 'status' },
                { title: 'Dispositivo', field: 'device' },
                { title: 'Nome', field: 'devicename' },
                { title: 'Tipo', field: 'devicetype' },
                { title: 'Ações', field: 'actions' },
            ],
            data: [],
            // account: props.account,
            load: false
        };
    }

    async onChildCreateEdit() { // Método enviado para componente intermediario
        try {
            this.setState({
                load: true
            });
            const response = await Api.get("/api/account/get-complete?Id=" + this.props.account.idperson + "&Parameters=8");
            this.syncDevices(response.data.devices); //Método chamado no retorno do metodo.
            this.setState({
                load: false
            });
        } catch (error) {
            window.location.reload();
        }
    }


    render() {
        return <div>
            <MaterialTable
                title="Dispositivos"
                columns={this.state.columns}
                data={this.state.data}
            />

            <div className="float-right-add">
                <FormDialog
                    account={this.props.account}
                    callbackParentCreateEdit={() => this.onChildCreateEdit()}
                />
            </div>

            <Loading on={this.state.load} />
        </div>
    }

    componentDidMount() {
        this.onChildCreateEdit();
    }

    syncDevices(devices) {
        let data = [];

        if (devices !== undefined && devices !== null) {
            // eslint-disable-next-line
            devices.map(device => {
                let auxIcon = "";

                if (device.active) {
                    auxIcon = <CheckIcon />
                } else {
                    auxIcon = <BlockIcon />
                }

                const dataAux = {
                    status: auxIcon,
                    device: device.device,
                    devicename: device.devicename,
                    devicetype: device.devicetype,
                    actions: <div>
                        <EditDialog
                            account={this.props.account}
                            data={device}
                            callbackParentCreateEdit={() => this.onChildCreateEdit()}
                        />
                    </div>
                }

                data.push(dataAux);
            });
        }

        this.setState({
            data: data,
            load: false
        });
    }
}

export default Devices;
