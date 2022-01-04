import React, { Component } from 'react';
import MaterialTable from 'material-table';

import '../../../styles.css';
import FormDialog from './dialog';
import EditDialog from './editDialog';
import Api from '../../../../../services/api';
import Loading from '../../../../../components/Loading';

class Registered extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Nome', field: 'name' },
                { title: 'CPF', field: 'cpf' },
                { title: 'Unidade', field: 'unityname' },
                { title: 'Tel/Ramal', field: 'tel' },
                { title: 'Tipo', field: 'typeresident' },
                { title: 'Ações', field: 'actions' },
            ],
            data: [],

            load: false
        };
    }

    onChildCreateEdit() {
        this.syncResident();
    }

    render() {
        return <div>
            <div className="ptn-pers-pad">
                <FormDialog account={this.props.account} callbackParentCreateEdit={() => this.onChildCreateEdit()} />
            </div>

            <MaterialTable
                title="Pessoas"
                columns={this.state.columns}
                data={this.state.data}
            />

            <Loading on={this.state.load} />
        </div>
    }

    componentDidMount() {
        this.syncResident();
    }

    async syncResident() {
        this.setState({
            load: true
        });

        let data = [];

        const response = await Api.get("/api/resident/get-list?Id=" + this.props.account.idperson);

        response.data.forEach(resident => {
            resident.actions = <div>
                <EditDialog
                    idResident={resident.idperson}
                    account={this.props.account}
                    callbackParentCreateEdit={() => this.onChildCreateEdit()}
                />
            </div>
            data.push(resident)
        });

        this.setState({
            data: data,
            load: false
        })
    }
}

export default Registered;
