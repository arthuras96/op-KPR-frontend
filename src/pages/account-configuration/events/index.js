import React, { Component } from 'react';
import MaterialTable from 'material-table';

import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';

import '../styles.css';
import FormDialog from './dialog';
import EditDialog from './editDialog';
import Loading from '../../../components/Loading';
import Api from '../../../services/api';

class Events extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Status', field: 'status' },
                { title: 'Nome', field: 'name' },
                { title: 'Prioridade', field: 'priority' },
                { title: 'Criado manualmente', field: 'manualCreation' },
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
            const response = await Api.get("/api/account/get-complete?Id=" + this.props.account.idperson + "&Parameters=4");
            this.syncEvents(response.data.events); //Método chamado no retorno do metodo.
        } catch (error) {
            window.location.reload();
        }
    }

    render() {
        return <div>
            <MaterialTable
                title="Eventos"
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
        // const auxEvents = this.props.account.events;
        // this.syncEvents(auxEvents);
        try {
            this.setState({
                load: true
            });
            const response = await Api.get("/api/account/get-complete?Id=" + this.props.account.idperson + "&Parameters=4");
            this.syncEvents(response.data.events); //Método chamado no retorno do metodo.
        } catch (error) {
            console.log(error);
        }
    }

    syncEvents(events) {

        let data = [];

        if (events !== undefined && events !== null) {
            // eslint-disable-next-line
            events.map(event => {
                let auxIcon = "";

                if (event.active) {
                    auxIcon = <CheckIcon />
                } else {
                    auxIcon = <BlockIcon />
                }

                let auxManualCreation = "";

                if (event.manualcreation)
                    auxManualCreation = "Sim";
                else
                    auxManualCreation = "Não";

                const dataAux = {
                    status: auxIcon,
                    name: event.name,
                    priority: event.priority,
                    manualCreation: auxManualCreation,
                    actions: <div>
                        <EditDialog
                            event={event}
                            account={this.props.account}
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

export default Events;
