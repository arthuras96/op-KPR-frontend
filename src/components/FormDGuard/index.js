import React from 'react';

import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import './styles.css';
import Api from "../../services/api";
import CamDataApi from "../../services/camDataApi";
import Loading from '../Loading';
import PreviewCam from '../PreviewCam';

class FormDGuard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            idcamdguard: 0,
            idaccount: 0,
            iddeviceaccount: '',
            layout: '',
            camnumber: '',
            camname: '',
            idzone: '',
            activeuser: true,
            activeresident: false,

            host: '',
            port: '',
            username: '',
            password: '',

            devices: [],
            layouts: [],
            allCams: [],
            filterCams: [],
            zones: [],

            load: false,
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

        const response = await Api.get("/api/account/get-complete?Id=" + this.props.account.idperson + "&Parameters=3,8");

        const auxDevice = response.data.devices;
        let auxDevicesDGuard = [];

        if (auxDevice === null || auxDevice === undefined) {
            alert("Não existe dispositivo D-Guard cadastrado na conta.");
            this.props.closeDialog();
            return;
        }

        auxDevice.forEach(function (device, index) {
            if (device.iddevice === 1) {
                auxDevicesDGuard.push(device);
            }
        });

        if (auxDevicesDGuard.length === 0) {
            alert("Não existe dispositivo D-Guard cadastrado na conta.");
            this.props.closeDialog();
            return;
        } else {
            this.setState({ devices: auxDevicesDGuard });
        }

        this.setState({ zones: response.data.zones })

        if (this.props.data !== null && this.props.data !== undefined) {

            await this.setState({
                idcamdguard: this.props.data.idcamdguard,
                iddeviceaccount: this.props.data.iddeviceaccount
            });

            await this.loadLayout(this.props.data.iddeviceaccount);

            await this.setState({
                layout: this.props.data.layout
            });

            this.loadCams(this.props.data.layout);

            this.setState({
                camnumber: this.props.data.camnumber,
                camname: this.props.data.camname,
                idzone: this.props.data.idzone,
                activeuser: this.props.data.activeuser,
                activeresident: this.props.data.activeresident,
            })

        }

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

        if (name === 'iddeviceaccount')
            this.loadLayout(value);

        if (name === 'layout')
            this.loadCams(value);

        if (name === 'camnumber')
            this.putName(value);

        this.setState({ [name]: value });
    }

    async loadLayout(iddeviceaccount) {

        const indexDeviceAccount = this.state.devices.findIndex(i => i.iddeviceaccount === iddeviceaccount);

        this.setState({ load: true, layout: '', filterCams: [], camnumber: '', host: '', port: '', username: '', password: '', });
        let hostport = this.state.devices[indexDeviceAccount].host + ":" + this.state.devices[indexDeviceAccount].port;
        const userpass = btoa(this.state.devices[indexDeviceAccount].username + ":" + this.state.devices[indexDeviceAccount].password);

        if (!hostport.toLowerCase().includes("http")) {
            hostport = "http://" + hostport;
        }

        const response = await CamDataApi.get(hostport + "/camerasnomes.cgi", { headers: { "Authorization": "Basic " + userpass } });
        const auxCamData = response.data.split("&");

        let auxCamDataState = [];


        if (auxCamData !== null && auxCamData !== undefined) {
            auxCamData.forEach(cam => {
                const auxCamNumber = cam.split("=")[0];
                const auxCamLayout = cam.split("=")[1].split(".")[0];
                const auxCamName = cam.split("=")[1].split(".")[1].replace("Ã¡", "á").replace("Ã¢", "â").replace("Ã£", "ã").replace("Ã¤", "ä").replace("Ã¥", "å").replace("Ã¦", "æ").replace("Ã§", "ç").replace("Ã¨", "è").replace("Ã©", "é").replace("Ãª", "ê").replace("Ã«", "ë").replace("Ã¬", "ì").replace("Ã­", "í").replace("Ã®", "î").replace("Ã¯", "ï").replace("Ã°", "ð").replace("Ã±", "ñ").replace("Ã²", "ò").replace("Ã³", "ó").replace("Ã´", "ô").replace("Ãµ", "õ").replace("Ã¶", "ö").replace("Ã·", "÷").replace("Ã¸", "ø").replace("Ã¹", "ù").replace("Ãº", "ú").replace("Ã»", "û").replace("Ã¼", "ü");

                let addCam = true;

                if (this.props.cams !== null && this.props.cams !== undefined) {
                    const indexExist = this.props.cams.findIndex(i => i.camnumber === auxCamNumber);
                    if (indexExist !== -1) {
                        if (this.state.devices[indexDeviceAccount].host === this.props.cams[indexExist].host && this.state.devices[indexDeviceAccount].port === this.props.cams[indexExist].port &&
                            this.state.devices[indexDeviceAccount].username === this.props.cams[indexExist].username && this.state.devices[indexDeviceAccount].password === this.props.cams[indexExist].password) {
                            addCam = false;
                        }
                    }
                }

                if (addCam) {
                    auxCamDataState.push({
                        value: auxCamNumber,
                        layout: auxCamLayout,
                        label: auxCamName
                    });
                }

                if (this.state.layouts.indexOf(auxCamLayout) === -1) {
                    let auxLayout = this.state.layouts;
                    auxLayout.push(auxCamLayout);
                    this.setState({ layouts: auxLayout });
                }
            });
        }

        if (auxCamDataState.length < 1) {
            alert("Não foram encontradas cameras no layout.");
            this.props.closeDialog();
            return;
        }

        this.setState({ allCams: auxCamDataState });

        this.setState({
            host: this.state.devices[indexDeviceAccount].host,
            port: this.state.devices[indexDeviceAccount].port,
            username: this.state.devices[indexDeviceAccount].username,
            password: this.state.devices[indexDeviceAccount].password,
            load: false
        });
    }

    loadCams(nameLayout) {
        this.setState({ load: true, filterCams: [], camnumber: '' });

        const auxAllCams = this.state.allCams;
        let auxFilterCams = [];

        auxAllCams.forEach(cam => {
            if (cam.layout === nameLayout) {
                auxFilterCams.push(cam);
            }
        });

        this.setState({
            filterCams: auxFilterCams,
            load: false
        });
    }

    putName(camNumber) {
        this.setState({ load: true });

        const { filterCams } = this.state;

        filterCams.forEach(cam => {
            if (cam.value === camNumber) {
                this.setState({
                    camname: cam.label
                });
            }
        });

        this.setState({
            load: false
        });
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ load: true });

        const { idcamdguard, idaccount, iddeviceaccount, camnumber, layout, camname, idzone, activeuser, activeresident } = this.state;
        const response = await Api.put("/api/account/add-camdguard", { idcamdguard, idaccount, iddeviceaccount, camnumber, layout, camname, idzone, activeuser, activeresident });

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

                    {this.state.devices.length > 0 &&
                        <SelectValidator
                            fullWidth
                            label="Dispositivo"
                            onChange={this.handleChange}
                            name="iddeviceaccount"
                            value={this.state.iddeviceaccount}
                            validators={['required']}
                            errorMessages={['O dispositivo é requerido.']}
                            className="select-normalize-form-task"
                        >
                            {this.state.devices.map(
                                device => (<MenuItem key={device.iddeviceaccount} value={Number(device.iddeviceaccount)}>{device.devicename}</MenuItem>)
                            )}
                        </SelectValidator>
                    }

                    <br />

                    {this.state.layouts.length > 0 &&
                        <SelectValidator
                            fullWidth
                            label="Layout"
                            onChange={this.handleChange}
                            name="layout"
                            value={this.state.layout}
                            validators={['required']}
                            errorMessages={['O layout é requerido.']}
                            className="select-normalize-form-task"
                        >
                            {this.state.layouts.map(
                                layout => (<MenuItem key={layout} value={layout}>{layout}</MenuItem>)
                            )}
                        </SelectValidator>
                    }

                    <br />

                    {this.state.filterCams.length > 0 &&
                        <SelectValidator
                            fullWidth
                            label="Camera"
                            onChange={this.handleChange}
                            name="camnumber"
                            value={this.state.camnumber}
                            validators={['required']}
                            errorMessages={['A camera é requerida.']}
                            className="select-normalize-form-task"
                        >
                            {this.state.filterCams.map(
                                cam => (<MenuItem key={cam.value} value={cam.value}>{cam.label}</MenuItem>)
                            )}
                        </SelectValidator>
                    }

                    <br />

                    {this.state.camnumber !== '' &&
                        <TextValidator
                            fullWidth
                            label="Nome"
                            name="camname"
                            value={this.state.camname}
                            onChange={this.handleChange}
                            validators={['required']}
                            errorMessages={['O nome é requerido.']}
                            className="select-normalize-form-task"
                        />
                    }

                    <br />


                    {this.state.camnumber !== '' &&
                        <SelectValidator
                            fullWidth
                            label="Zona"
                            onChange={this.handleChange}
                            name="idzone"
                            value={this.state.idzone}
                            validators={['required']}
                            errorMessages={['A zona é requerida.']}
                            className="select-normalize-form-task"
                        >
                            {this.state.zones.map(
                                zone => (<MenuItem key={zone.idzone} value={Number(zone.idzone)}>{zone.zone}</MenuItem>)
                            )}
                        </SelectValidator>
                    }
                    <br />
                    {this.state.camnumber !== '' &&
                        <div>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={this.state.activeuser}
                                    onChange={this.handleChangeBoolean}
                                    value={this.state.activeuser}
                                    name="activeuser"
                                    color="primary"
                                />
                                }
                                label="Ativo para usuários"
                                validators={['required']}
                                className="padding-top-check"
                            />

                            <FormControlLabel
                                control={<Checkbox
                                    checked={this.state.activeresident}
                                    onChange={this.handleChangeBoolean}
                                    value={this.state.activeresident}
                                    name="activeresident"
                                    color="primary"
                                />
                                }
                                label="Ativo para moradores"
                                validators={['required']}
                                className="padding-top-check"
                            />


                        </div>
                    }

                    {this.state.camnumber !== '' &&
                        <div><PreviewCam camnumber={this.state.camnumber}
                            iddeviceaccount={this.state.iddeviceaccount}
                            host={this.state.host}
                            port={this.state.port}
                            username={this.state.username}
                            password={this.state.password}
                            text={"Pré-visualizar"}
                        /></div>
                    }

                    <br />

                    <Button variant="outlined" className="button-send" type="submit">Salvar</Button>
                </ValidatorForm>
                <Loading on={this.state.load} />
            </div>
        );
    }
}
export default FormDGuard;