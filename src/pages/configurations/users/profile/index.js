import React, { Component } from 'react';
import MaterialTable from 'material-table';

import '../../styles.css';
import FormDialog from './dialog';
import EditDialog from './editDialog';
import Loading from '../../../../components/Loading';
import Api from '../../../../services/api';

class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Nome', field: 'name' },
                { title: 'Descrição', field: 'description' },
                { title: 'Ações', field: 'actions' },
            ],
            data: [],
            load: false
        };
    }

    async onChildCreateEdit() { // Método enviado para componente intermediario
        this.setState({ load: true });
        const response = await Api.get("/api/users/get-list-profiles");
        this.syncProfiles(response.data);
    }

    render() {
        return <div>
            <MaterialTable
                title="Perfis"
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

    syncProfiles(profiles) {

        let data = [];
        console.log(profiles);

        if (profiles !== undefined && profiles !== null && profiles.length > 0) {
            // eslint-disable-next-line
            profiles.map(profile => {

                const dataAux = {
                    name: profile.userprofile,
                    description: profile.description,
                    actions: <div>
                        <EditDialog
                            data={profile}
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

export default Profile;
