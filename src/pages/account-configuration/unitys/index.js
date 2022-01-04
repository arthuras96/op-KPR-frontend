import React, { Component } from 'react';
import MaterialTable from 'material-table';

import '../styles.css';
import FormDialog from './dialog';
import EditDialog from './editDialog';
import Loading from '../../../components/Loading';
import Api from '../../../services/api';

class Unitys extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Nome', field: 'name' },
                { title: 'Tipo', field: 'typeunity' },
                { title: 'Estado', field: 'unitystate' },
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
            const response = await Api.get("/api/account/get-complete?Id=" + this.props.account.idperson + "&Parameters=6");
            this.syncUnitys(response.data.unitys); //Método chamado no retorno do metodo.
        } catch (error) {
            window.location.reload();
        }
    }

    render() {
        return <div>
            {this.props.typebtn === 1 &&
                <div className="ptn-pers-pad">
                    <FormDialog
                        typebtn={this.props.typebtn}
                        account={this.props.account}
                        callbackParentCreateEdit={() => this.onChildCreateEdit()}
                    />
                </div>
            }

            <MaterialTable
                title="Unidades"
                columns={this.state.columns}
                data={this.state.data}
            />

            {this.props.typebtn === 2 &&
                <div className="float-right-add">
                    <FormDialog
                        typebtn={this.props.typebtn}
                        account={this.props.account}
                        callbackParentCreateEdit={() => this.onChildCreateEdit()}
                    />
                </div>
            }

            <Loading on={this.state.load} />
        </div>
    }

    async componentDidMount() {
        try {
            this.setState({
                load: true
            });
            const response = await Api.get("/api/account/get-complete?Id=" + this.props.account.idperson + "&Parameters=6");
            this.syncUnitys(response.data.unitys); //Método chamado no retorno do metodo.
        } catch (error) {
            window.location.reload();
        }
    }

    syncUnitys(unitys) {

        let data = [];

        if (unitys !== undefined && unitys !== null) {
            // eslint-disable-next-line
            unitys.map(unity => {
                const dataAux = {
                    name: unity.unityname,
                    typeunity: unity.typeunity,
                    unitystate: unity.unitystate,
                    actions: <div>
                        <EditDialog
                            account={this.props.account}
                            data={unity}
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

export default Unitys;
