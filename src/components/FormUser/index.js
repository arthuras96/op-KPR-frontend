import React from 'react';

import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import './styles.css';
import Api from "../../services/api";
import Loading from '../../components/Loading';

import { IsRoot } from '../../services/auth';

class FormUser extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            idperson: '',
            name: '',
            email: '',
            password: '',
            iduserprofile: '',
            username: '',
            active: true,
            sendactiveemail: false,

            changeUsername: true,
            showSendActiveEmail: true,
            userProfileList: [],

            load: false
        }
    }

    async componentDidMount() {

        if (IsRoot()) {
            this.setState({
                iduserprofile: 0,
            });
        } else {
            this.setState({ load: true });
            const response = await Api.get('/api/users/get-list-profiles');
            console.log(response.data);
            this.setState({ userProfileList: response.data, load: false });
        }


        if (this.props.data !== null && this.props.data !== undefined) {
            this.setState({
                idperson: this.props.data.idperson,
                name: this.props.data.name,
                email: this.props.data.email,
                password: this.props.data.password,
                iduserprofile: this.props.data.iduserprofile,
                username: this.props.data.username,
                showSendActiveEmail: false,
                changeUsername: false
            })
        }
        else {
            this.setState({
                idperson: 0,
            });
        }
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({ [name]: value });
    }

    handleChangeBoolean = (event) => {
        const name = event.target.name;
        let value = event.target.value;

        const valueState = this.state[name];
        const variableType = typeof valueState;

        if (variableType === 'boolean') {
            if (valueState)
                value = false;
            else
                value = true;
        }

        this.setState({ [name]: value });
    }

    handleSubmit = async event => {
        this.setState({ load: true });
        event.preventDefault();
        const { idperson, name, email, password, iduserprofile, username, active, sendactiveemail } = this.state;

        let response = "";

        if (IsRoot()) {
            response = await Api.put("/api/users/add-admin", {
                idperson, name, email, password, iduserprofile, username, active, sendactiveemail
            });
        } else {
            response = await Api.put("/api/users/add-user", {
                idperson, name, email, password, iduserprofile, username, active, sendactiveemail
            });
        }

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
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                        className="select-normalize"
                        validators={['required']}
                        errorMessages={['O nome é requerido.']}
                    />

                    {this.state.changeUsername &&
                        <TextValidator
                            fullWidth
                            label="Nome de usuário"
                            name="username"
                            value={this.state.username}
                            onChange={this.handleChange}
                            className="select-normalize"
                            validators={['required']}
                            errorMessages={['O nome é requerido.']}
                        />
                    }
                    {!this.state.changeUsername &&
                        <TextValidator
                            fullWidth
                            label="Nome de usuário"
                            name="username"
                            value={this.state.username}
                            onChange={this.handleChange}
                            className="select-normalize"
                            validators={['required']}
                            errorMessages={['O nome é requerido.']}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    }

                    <TextValidator
                        fullWidth
                        label="E-mail"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        className="select-normalize"
                        validators={['isEmail', 'required']}
                        errorMessages={['O e-mail não é valido.', 'O e-mail é requerido.']}
                    />

                    <TextValidator
                        fullWidth
                        label="Senha"
                        onChange={this.handleChange}
                        name="password"
                        value={this.state.password}
                        className="select-normalize"
                        validators={['required']}
                        errorMessages={['A senha é requerida.']}
                    />

                    {!IsRoot() &&
                        <SelectValidator
                            fullWidth
                            label="Perfil de usuário"
                            onChange={this.handleChange}
                            name="iduserprofile"
                            value={this.state.iduserprofile}
                            validators={['required']}
                            errorMessages={['A conta é requerida.']}
                            className="select-normalize"
                        >
                            {this.state.userProfileList.map(
                                userProfile => (<MenuItem key={userProfile.iduserprofile} value={userProfile.iduserprofile}>{userProfile.userprofile}</MenuItem>)
                            )}
                        </SelectValidator>

                    }

                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.active}
                            onChange={this.handleChangeBoolean}
                            value={this.state.active}
                            name="active"
                            color="primary"
                        />
                        }
                        label="Ativo"
                        validators={['required']}
                        className="padding-top-check"
                    />

                    {this.state.showSendActiveEmail &&

                        <FormControlLabel
                            control={<Checkbox
                                checked={this.state.sendactiveemail}
                                onChange={this.handleChangeBoolean}
                                value={this.state.sendactiveemail}
                                name="sendactiveemail"
                                color="primary"
                            />
                            }
                            label="Enviar e-mail de ativação"
                            validators={['required']}
                            className="padding-top-check"
                        />
                    }

                    <br />
                    <Button variant="outlined" className="button-send" type="submit">Salvar</Button>
                </ValidatorForm>
                <Loading on={this.state.load} />
            </div>
        );
    }
}
export default FormUser;