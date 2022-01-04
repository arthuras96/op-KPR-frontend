import React, { Component } from 'react';
import MaterialTable from 'material-table';

import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';

import '../styles.css';
import FormDialog from './dialog';
import EditDialog from './editDialog';
import Loading from '../../../components/Loading';
import Api from '../../../services/api';

class Zones extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Status', field: 'status' },
                { title: 'Nome', field: 'name' },
                { title: 'Tipo', field: 'type' },
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
            const response = await Api.get("/api/account/get-complete?Id=" + this.props.account.idperson + "&Parameters=3");
            this.syncZones(response.data.zones); //Método chamado no retorno do metodo.
        } catch (error) {
            window.location.reload();
        }
    }


    render() {
        return <div>
            <MaterialTable
                title="Zonas"
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

    async componentDidMount() {
        // const zones = this.props.account.zones;
        // this.syncZones(zones);

        try {
            this.setState({
                load: true
            });
            const response = await Api.get("/api/account/get-complete?Id=" + this.props.account.idperson + "&Parameters=3");
            this.syncZones(response.data.zones); //Método chamado no retorno do metodo.
        } catch (error) {
            window.location.reload();
        }
    }

    syncZones(zones) {

        let data = [];

        if (zones !== undefined && zones !== null) {
            // eslint-disable-next-line
            zones.map(zone => {
                let auxIcon = "";

                if (zone.active) {
                    auxIcon = <CheckIcon />
                } else {
                    auxIcon = <BlockIcon />
                }

                let auxType = "";

                if (zone.isrestricted)
                    auxType = "Zona restrita";
                else
                    auxType = "Zona pública";

                const dataAux = {
                    status: auxIcon,
                    name: zone.zone,
                    type: auxType,
                    actions: <div>
                        <EditDialog
                            data={zone}
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

export default Zones;
