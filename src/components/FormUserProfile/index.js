import React from 'react';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import './styles.css';
import Api from "../../services/api";
import Loading from '../../components/Loading';

import { IsRoot } from '../../services/auth';

class FormUserProfile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            iduserprofile: 0,
            permissionList: [],
            userprofile: "",
            description: "",

            load: false
        }
    }

    async componentDidMount() {

        this.setState({ load: true });
        const response = await Api.get('/api/users/get-list-permissions');
        let data = [];

        if (response.data !== undefined && response.data !== null && response.data.length > 0) {
            // eslint-disable-next-line
            response.data.map(permission => {
                let auxData = {
                    idPermission: permission.idpermission,
                    permission: permission.permission,
                    description: permission.description,
                    value: false
                };
                data.push(auxData);
            });
        }

        if (this.props.data !== null && this.props.data !== undefined) {

            this.props.data.permission.forEach(perm => {
                const index = data.findIndex(i => i.idPermission === perm)

                if (index !== -1) {
                    data[index].value = true;
                }
            });

            this.setState({
                iduserprofile: this.props.data.iduserprofile,
                userprofile: this.props.data.userprofile,
                description: this.props.data.description,
            })
        }

        this.setState({ permissionList: data, load: false });
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value });
    }

    handleChangeBoolean = (event) => {
        const auxIdPermission = Number(event.target.name);
        let value = event.target.value;

        let auxPermissions = this.state.permissionList;
        const index = auxPermissions.findIndex(i => i.idPermission === auxIdPermission)

        if (index !== -1) {

            const valueState = auxPermissions[index].value;
            const variableType = typeof valueState;

            if (variableType === 'boolean') {
                if (valueState)
                    value = false;
                else
                    value = true;
            }

            auxPermissions[index].value = value;

            this.setState({ permissionList: auxPermissions });

        }
    }

    handleSubmit = async event => {
        this.setState({ load: true });
        event.preventDefault();
        const { iduserprofile, permissionList, userprofile, description } = this.state;

        let response = "";

        let permission = [];

        permissionList.forEach(perm => {
            if (perm.value === true) {
                permission.push(perm.idPermission);
            }
        });

        response = await Api.put("/api/users/add-user-profile", {
            iduserprofile, userprofile, description, permission
        });

        alert(response.data.message);

        if (response.data.statuscode === 201) {
            this.props.callbackParentCreateEdit();
            this.props.closeDialog();
        }

        this.setState({ load: false });
    }

    render() {
        return (
            <div>
                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}>

                    <TextValidator
                        fullWidth
                        label="Nome"
                        onChange={this.handleChange}
                        name="userprofile"
                        value={this.state.userprofile}
                        validators={['required']}
                        errorMessages={['O nome do perfil é requerido.']}
                        className="select-normalize"
                    />

                    <br />

                    <TextValidator
                        fullWidth
                        label="Descrição"
                        onChange={this.handleChange}
                        name="description"
                        value={this.state.description}
                        className="select-normalize"
                    />
                    <List>
                        {this.state.permissionList !== undefined && this.state.permissionList !== null && this.state.permissionList.length > 0 &&
                            this.state.permissionList.map(permission =>
                                <ListItem key={permission.idPermission}>
                                    <ListItemAvatar>
                                        <FormControlLabel
                                            control={<Checkbox
                                                checked={permission.value}
                                                onChange={this.handleChangeBoolean}
                                                value={permission.value}
                                                name={permission.idPermission.toString()}
                                                color="primary"
                                            />
                                            }
                                        />
                                    </ListItemAvatar>
                                    <ListItemText primary={permission.permission} secondary={permission.description} />
                                </ListItem>
                            )
                        }
                    </List>

                    <br />
                    <Button variant="outlined" className="button-send" type="submit">Salvar</Button>
                </ValidatorForm>
                <Loading on={this.state.load} />
            </div>
        );
    }
}
export default FormUserProfile;