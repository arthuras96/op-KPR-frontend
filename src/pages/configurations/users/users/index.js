import React, { Component } from 'react';
import MaterialTable from 'material-table';

import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';

import FormDialog from './dialog';
import EditDialog from './editDialog';
import Loading from '../../../../components/Loading';
import Api from '../../../../services/api';

import { IsRoot } from '../../../../services/auth';

import '../../styles.css';

class UserRegistration extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Status', field: 'status' },
                { title: 'Nome', field: 'name' },
                { title: 'Nome de usuário', field: 'username' },
                { title: 'Perfil', field: 'profile' },
                { title: 'Ações', field: 'actions' },
            ],
            data: [],
            title: '',
            load: false
        };
    }

    async onChildCreateEdit() { // Método enviado para componente intermediario
        if (IsRoot()) {
            this.setState({ title: "Administradores", load: true });
            const response = await Api.get("/api/users/get-list-admin");
            this.syncUsers(response.data);
        } else {
            this.setState({ title: "Usuários", load: true });
            const response = await Api.get("/api/users/get-list-user");
            this.syncUsers(response.data);
        }
    }

    render() {
        return <div>
            <MaterialTable
                title={this.state.title}
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

    componentDidMount() {
        this.onChildCreateEdit();
    }

    syncUsers(users) {

        let data = [];

        if (users !== undefined && users !== null && users.length > 0) {
            // eslint-disable-next-line
            users.map(user => {

                let auxIcon = "";

                if (user.active) {
                    auxIcon = <CheckIcon />
                } else {
                    auxIcon = <BlockIcon />
                }
                const dataAux = {
                    status: auxIcon,
                    name: user.name,
                    username: user.username,
                    profile: user.userprofile,
                    actions: <div>
                        <EditDialog
                            data={user}
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

export default UserRegistration;
