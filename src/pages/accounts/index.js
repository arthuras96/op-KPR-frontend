import React, { Component } from 'react';
import MaterialTable from 'material-table';

import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';

import './styles.css';
import FormDialog from './dialog';
import EditDialog from './editDialog';
import Api from '../../services/api';
import Loading from '../../components/Loading';


class Accounts extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Status', field: 'status' },
                { title: 'Código', field: 'code' },
                { title: 'Conta', field: 'account' },
                { title: 'Contato', field: 'contact' },
                { title: 'Telefone', field: 'phone' },
                { title: 'Ações', field: 'actions' },
            ],
            data: [],
            responseArray: [],
            load: false
        };
    }

    onChildCreateEditAccount() { // Método enviado para componente intermediario
        this.syncAccounts(); //Método chamado no retorno do metodo.
    }

    render() {
        return <div>
            <MaterialTable
                title="Conta"
                columns={this.state.columns}
                data={this.state.data}
            />

            <div className="float-right-add">
                <FormDialog callbackParentCreateEdit={() => this.onChildCreateEditAccount()} />
            </div>

            <Loading on={this.state.load} />
        </div>
    }

    componentDidMount() {
        this.syncAccounts();
    }

    async syncAccounts() {
        this.setState({
            load: true
        });

        const response = await Api.get("/api/account/get");
        console.log(response);

        let data = [];

        for (var i = 0; i < response.data.length; i++) {
            let auxIcon = "";
            let auxIdPerson = response.data[i].idperson;

            if (response.data[i].active === true) {
                auxIcon = <CheckIcon />
            } else {
                auxIcon = <BlockIcon />
            }

            const dataAux = {
                status: auxIcon,
                code: auxIdPerson,
                account: response.data[i].name,
                contact: response.data[i].contact,
                phone: response.data[i].telone,
                actions: <div>
                    <EditDialog data={response.data[i]} callbackParentCreateEdit={() => this.onChildCreateEditAccount()} />
                </div>
            }

            data.push(dataAux);
        }

        this.setState({
            data: data,
            responseArray: response.data,
            load: false
        });
    }
}

export default Accounts;
