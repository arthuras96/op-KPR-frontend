import React, { Component } from 'react';
import MaterialTable from 'material-table';

import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';

import '../styles.css';
import FormDialog from './dialog';
import EditDialog from './editDialog';
import Loading from '../../../components/Loading';
import Api from '../../../services/api';
import PreviewCam from '../../../components/PreviewCam';


class DGuard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Nome', field: 'camname' },
                { title: 'Layout', field: 'layout' },
                { title: 'Ativo para usuário', field: 'activeuser' },
                { title: 'Ativo para morador', field: 'activeresident' },
                { title: 'Pré-visualizar', field: 'previewcam' },
                { title: 'Ações', field: 'actions' },
            ],
            data: [],
            load: false,
            cams: []
        };
    }

    async onChildCreateEdit() { // Método enviado para componente intermediario
        try {
            this.setState({
                load: true
            });
            const response = await Api.get("/api/account/get-complete?Id=" + this.props.account.idperson + "&Parameters=9");
            this.syncCamsDGuard(response.data.camsdguard); //Método chamado no retorno do metodo.
            this.setState({
                cams: response.data.camsdguard,
                load: false
            });
        } catch (error) {
            window.location.reload();
        }
    }


    render() {
        return <div>
            <MaterialTable
                title="D-Guard - Câmeras"
                columns={this.state.columns}
                data={this.state.data}
            />

            <div className="float-right-add">
                <FormDialog
                    cams={this.state.cams}
                    account={this.props.account}
                    callbackParentCreateEdit={() => this.onChildCreateEdit()}
                />
            </div>

            <Loading on={this.state.load} />
        </div>
    }

    async componentDidMount() {
        this.onChildCreateEdit();
    }

    syncCamsDGuard(camsDGuard) {
        let data = [];

        if (camsDGuard !== undefined && camsDGuard !== null) {
            // eslint-disable-next-line
            camsDGuard.map(camDGuard => {
                let auxIconUser = "";
                let auxIconResident = "";

                if (camDGuard.activeuser) {
                    auxIconUser = <CheckIcon />
                } else {
                    auxIconUser = <BlockIcon />
                }

                if (camDGuard.activeresident) {
                    auxIconResident = <CheckIcon />
                } else {
                    auxIconResident = <BlockIcon />
                }

                const dataAux = {
                    camname: camDGuard.camname,
                    layout: camDGuard.layout,
                    activeuser: auxIconUser,
                    activeresident: auxIconResident,
                    previewcam: <PreviewCam camnumber={camDGuard.camnumber}
                        iddeviceaccount={camDGuard.iddeviceaccount}
                        host={camDGuard.host}
                        port={camDGuard.port}
                        username={camDGuard.username}
                        password={camDGuard.password}
                        text={""} />,
                    actions: <div>
                        <EditDialog
                            account={this.props.account}
                            data={camDGuard}
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

export default DGuard;
