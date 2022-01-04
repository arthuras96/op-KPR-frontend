import React from 'react';

import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import './styles.css';
import Api from "../../services/api";
import Loading from '../Loading';


class FormDevices extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            iddeviceaccount: 0,
            idaccount: 0,
            iddevicemanufacturer: '',
            manufacturers: [],

            iddevice: '',
            devices: [],

            devicename: '',

            host: '',
            port: '',
            portsecondary: '',
            username: '',
            password: '',
            hostmonitoring: '',
            portmonitoring: '',
            active: true,

            load: false,

            hostControl: false,
            portControl: false,
            portsecondaryControl: false,
            usernameControl: false,
            passwordControl: false,
            hostmonitoringControl: false,
            portmonitoringControl: false
        }
    }

    async componentDidMount() {
        if (this.props.account.idperson === '' || this.props.account.idperson === 0 || this.props.account.idperson === undefined) {
            alert("Houve um erro. Tente novamente. Em caso de persistencia, contate a TI.");
            this.props.closeDialog();
            return;
        } else {
            this.setState({ idaccount: this.props.account.idperson });
        }

        this.setState({ load: true });

        const responseManufactures = await Api.get('/api/account/get-device-manufacturer');
        this.setState({ manufacturers: responseManufactures.data });

        if (this.props.data !== null && this.props.data !== undefined) {

            await this.loadDevices(this.props.data.iddevicemanufacturer);

            this.setState({
                iddeviceaccount: this.props.data.iddeviceaccount,
                iddevicemanufacturer: this.props.data.iddevicemanufacturer,
                iddevice: this.props.data.iddevice,
                devicename: this.props.data.devicename,
                host: this.props.data.host,
                port: this.props.data.port,
                portsecondary: this.props.data.portsecondary,
                username: this.props.data.username,
                password: this.props.data.password,
                hostmonitoring: this.props.data.hostmonitoring,
                portmonitoring: this.props.data.portmonitoring,
                active: this.props.data.active
            });
        }

        this.changeForms(this.state.iddevice);

        this.setState({ load: false });
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

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        if (name === 'iddevicemanufacturer')
            this.loadDevices(value);

        if (name === 'iddevice')
            this.changeForms(value);

        this.setState({ [name]: value });
    }

    changeForms(idDevice) {
        if (Number(idDevice) === 1) {
            this.setState({
                hostControl: true,
                portControl: true,
                portsecondaryControl: false,
                usernameControl: true,
                passwordControl: true,
                hostmonitoringControl: false,
                portmonitoringControl: false
            })
        }
    }

    async loadDevices(idManufacturer) {
        this.setState({ load: true });
        const responseDevices = await Api.get("/api/account/get-device-by-manufacturer?Id=" + idManufacturer);
        this.setState({
            devices: responseDevices.data,
            load: false
        });
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ load: true });

        const { iddeviceaccount, idaccount, iddevicemanufacturer, iddevice, devicename, host, port, portsecondary, username, password, hostmonitoring, portmonitoring, active } = this.state;
        const response = await Api.put("/api/account/add-device", { iddeviceaccount, idaccount, iddevicemanufacturer, iddevice, devicename, host, port, portsecondary, username, password, hostmonitoring, portmonitoring, active });

        this.setState({ load: false });

        alert(response.data.message);

        if (response.data.statuscode === 201) { // Se deu certo
            this.props.callbackParentCreateEdit();
            this.props.closeDialog();
        }

    }

    render() {
        return (
            <div>
                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}>

                    <SelectValidator
                        fullWidth
                        label="Fabricante"
                        onChange={this.handleChange}
                        name="iddevicemanufacturer"
                        value={this.state.iddevicemanufacturer}
                        validators={['required']}
                        errorMessages={['A fabricante é requerida.']}
                        className="select-normalize-form-task"
                    >
                        {this.state.manufacturers.map(
                            manufacturer => (<MenuItem key={manufacturer.value} value={Number(manufacturer.value)}>{manufacturer.label}</MenuItem>)
                        )}
                    </SelectValidator>

                    <br />

                    <SelectValidator
                        fullWidth
                        label="Dispositivo"
                        onChange={this.handleChange}
                        name="iddevice"
                        value={this.state.iddevice}
                        validators={['required']}
                        errorMessages={['O dispositivo é requerido.']}
                        className="select-normalize-form-task"
                    >
                        {this.state.devices.map(
                            device => (<MenuItem key={device.value} value={Number(device.value)}>{device.label}</MenuItem>)
                        )}
                    </SelectValidator>

                    <br />

                    <TextValidator
                        fullWidth
                        label="Nome"
                        name="devicename"
                        value={this.state.devicename}
                        onChange={this.handleChange}
                        validators={['required']}
                        errorMessages={['O nome é requerido.']}
                        className="select-normalize-form-task"
                    />

                    {this.state.hostControl &&
                        <TextValidator
                            fullWidth
                            label="Host"
                            name="host"
                            value={this.state.host}
                            onChange={this.handleChange}
                            validators={['required']}
                            errorMessages={['O host é requerido.']}
                            className="select-normalize-form-task"
                        />
                    }

                    {this.state.portControl &&
                        <TextValidator
                            fullWidth
                            label="Porta"
                            name="port"
                            value={this.state.port}
                            onChange={this.handleChange}
                            validators={['required', 'isNumber']}
                            errorMessages={['A porta é requerida.', 'Apenas números.']}
                            className="select-normalize-form-task"
                        />
                    }

                    {this.state.portsecondaryControl &&
                        <TextValidator
                            fullWidth
                            label="Porta Secundária"
                            name="portsecondary"
                            value={this.state.portsecondary}
                            onChange={this.handleChange}
                            validators={['required', 'isNumber']}
                            errorMessages={['A porta secundária é requerida.', 'Apenas números']}
                            className="select-normalize-form-task"
                        />
                    }

                    {this.state.usernameControl &&
                        <TextValidator
                            fullWidth
                            label="Usuário"
                            name="username"
                            value={this.state.username}
                            onChange={this.handleChange}
                            validators={['required']}
                            errorMessages={['O usuário é requerido.']}
                            className="select-normalize-form-task"
                        />
                    }

                    {this.state.passwordControl &&
                        <TextValidator
                            fullWidth
                            label="Senha"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            validators={['required']}
                            errorMessages={['A senha é requerida.']}
                            className="select-normalize-form-task"
                        />
                    }

                    {this.state.hostmonitoringControl &&
                        <TextValidator
                            fullWidth
                            label="Host de monitoramento"
                            name="hostmonitoring"
                            value={this.state.hostmonitoring}
                            onChange={this.handleChange}
                            validators={['required']}
                            errorMessages={['O host de monitoramento é requerido.']}
                            className="select-normalize-form-task"
                        />
                    }

                    {this.state.portmonitoringControl &&
                        <TextValidator
                            fullWidth
                            label="Porta de monitoramento"
                            name="portmonitoring"
                            value={this.state.portmonitoring}
                            onChange={this.handleChange}
                            validators={['required', 'isNumber']}
                            errorMessages={['A porta de monitoramento é requerida.', 'Apenas números.']}
                            className="select-normalize-form-task"
                        />
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

                    <br />
                    <Button variant="outlined" className="button-send" type="submit">Salvar</Button>
                </ValidatorForm>
                <Loading on={this.state.load} />
            </div>
        );
    }
}
export default FormDevices;