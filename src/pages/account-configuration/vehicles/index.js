import React, { Component } from 'react';
import MaterialTable from 'material-table';

import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';

import '../styles.css';
import FormDialog from './dialog';
import EditDialog from './editDialog';
import Loading from '../../../components/Loading';
import Api from '../../../services/api';

class Vehicles extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Status', field: 'status' },
                { title: 'Modelo', field: 'model' },
                { title: 'Placa', field: 'licenseplate' },
                { title: 'Fabricante', field: 'manufacturer' },
                { title: 'Cor', field: 'color' },
                { title: 'Nota', field: 'comments' },
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
            const response = await Api.get("/api/account/get-complete?Id=" + this.props.account.idperson + "&Parameters=7");
            this.syncVehicles(response.data.vehicles); //Método chamado no retorno do metodo.
        } catch (error) {
            window.location.reload();
        }
    }

    render() {
        return <div>
            <MaterialTable
                title="Veículos"
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
        try {
            this.setState({
                load: true
            });
            const response = await Api.get("/api/account/get-complete?Id=" + this.props.account.idperson + "&Parameters=7");
            this.syncVehicles(response.data.vehicles); //Método chamado no retorno do metodo.
        } catch (error) {
            window.location.reload();
        }
    }

    syncVehicles(vehicles) {

        let data = [];


        if (vehicles !== undefined && vehicles !== null) {

            // eslint-disable-next-line
            vehicles.map(vehicle => {

                let auxIcon = "";

                if (vehicle.active) {
                    auxIcon = <CheckIcon />
                } else {
                    auxIcon = <BlockIcon />
                }

                const dataAux = {
                    status: auxIcon,
                    model: vehicle.model,
                    licenseplate: vehicle.licenseplate,
                    manufacturer: vehicle.manufacturer,
                    color: vehicle.color,
                    actions: <div>
                        <EditDialog
                            account={this.props.account}
                            data={vehicle}
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

export default Vehicles;
