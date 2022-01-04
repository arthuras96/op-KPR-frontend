import React, { Component } from 'react';
import MaterialTable from 'material-table';

import '../styles.css';
import FormDialog from './dialog';
import EditDialog from './editDialog';
import Loading from '../../../components/Loading';
import Api from '../../../services/api';


class Schedules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Nome', field: 'name' },
                { title: 'Descrição', field: 'description' },
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
            const response = await Api.get("/api/account/get-complete?Id=" + this.props.account.idperson + "&Parameters=5");
            this.syncSchedules(response.data.schedules); //Método chamado no retorno do metodo.
        } catch (error) {
            window.location.reload();
        }
    }

    render() {
        return <div>
            <MaterialTable
                title="Horários"
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
        // const schedules = this.props.account.schedules;
        // this.syncSchedules(schedules);
        try {
            this.setState({
                load: true
            });
            const response = await Api.get("/api/account/get-complete?Id=" + this.props.account.idperson + "&Parameters=5");
            this.syncSchedules(response.data.schedules); //Método chamado no retorno do metodo.
        } catch (error) {
            window.location.reload();
        }
    }

    syncSchedules(schedules) {

        let data = [];

        if (schedules !== undefined && schedules !== null) {
            // eslint-disable-next-line
            schedules.map(schedule => {
                const dataAux = {
                    name: schedule.name,
                    description: schedule.description,
                    actions: <div>
                        <EditDialog
                            data={schedule}
                            account={this.props.account}
                            callbackParentCreateEdit={() => this.onChildCreateEdit()}
                        />
                    </div>
                }

                data.push(dataAux);
            })
        }

        this.setState({
            data: data,
            load: false
        });
    }

}

export default Schedules;