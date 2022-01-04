import React, { Component } from 'react';
import MaterialTable from 'material-table';

import '../../styles.css';
import FormDialog from './dialog';
import EditDialog from './editDialog';
import Loading from '../../../../components/Loading';
import Api from '../../../../services/api';

class Resolutions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Ordem', field: 'sequence' },
                { title: 'Nome', field: 'name' },
                { title: 'Descrição', field: 'taskResolution' },
                { title: 'Ações', field: 'actions' },
            ],
            data: [],
            // account: props.account,
            load: false
        };
    }

    async onChildCreateEdit() { // Método enviado para componente intermediario
        this.setState({
            load: true
        });

        try {
            const response = await Api.get("/api/task/get-resolution");
            this.syncResolutions(response.data); //Método chamado no retorno do metodo.
        } catch (error) {
            window.location.reload();
        }
    }

    async UpResolution(resolution) {
        this.setState({
            load: true
        });

        let statusCode = 0;

        try {
            const response = await Api.post("/api/task/up-resolution", resolution);
            statusCode = response.data.statuscode;
        } catch (error) {
            alert("Ocorreu um problema inesperado. Por favor, tente novamente.");
            this.setState({
                load: false
            });
            return;
        }

        if (statusCode === 201) {
            try {
                const response = await Api.get("/api/task/get-resolution");
                this.syncResolutions(response.data); //Método chamado no retorno do metodo.
            } catch (error) {
                window.location.reload();
            }
        }
        else
            alert("Ocorreu um problema inesperado. Por favor, tente novamente.");

        this.setState({
            load: false
        });
    }

    async DownResolution(resolution) {
        this.setState({
            load: true
        });

        let statusCode = 0;

        try {
            const response = await Api.post("/api/task/down-resolution", resolution);
            statusCode = response.data.statuscode;
        } catch (error) {
            alert("Ocorreu um problema inesperado. Por favor, tente novamente.");
            this.setState({
                load: false
            });
            return;
        }

        if (statusCode === 201) {
            try {
                const response = await Api.get("/api/task/get-resolution");
                this.syncResolutions(response.data); //Método chamado no retorno do metodo.
            } catch (error) {
                window.location.reload();
            }
        }
        else
            alert("Ocorreu um problema inesperado. Por favor, tente novamente.");

        this.setState({
            load: false
        });
    }

    render() {
        return <div>
            <MaterialTable
                title="Resoluções"
                columns={this.state.columns}
                data={this.state.data}
            />

            <div className="float-right-add">
                <FormDialog
                    callbackParentCreateEdit={() => this.onChildCreateEdit()}
                />
            </div>

            <Loading on={this.state.load} />
        </div>
    }

    async componentDidMount() {

        this.setState({
            load: true
        });

        try {
            const response = await Api.get("/api/task/get-resolution");
            this.syncResolutions(response.data); //Método chamado no retorno do metodo.
        } catch (error) {
            window.location.reload();
        }
    }

    syncResolutions(resolutions) {

        let data = [];

        if (resolutions !== undefined && resolutions !== null) {
            // eslint-disable-next-line
            resolutions.map(resolution => {

                resolution.length = resolutions.length;

                const dataAux = {
                    sequence: resolution.sequence,
                    name: resolution.name,
                    taskResolution: resolution.taskresolution,
                    actions: <div>
                        <EditDialog
                            data={resolution}
                            callbackParentCreateEdit={() => this.onChildCreateEdit()}
                            upResolution={() => this.UpResolution(resolution)}
                            downResolution={() => this.DownResolution(resolution)}
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

export default Resolutions;
