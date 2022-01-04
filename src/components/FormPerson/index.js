import React from 'react';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';

import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import { isCPF, isDate } from 'brazilian-values';

import './styles.css';
import Api from "../../services/api";
import { HavePermission } from "../../services/auth";
import Loading from '../../components/Loading';
import FormDialogVehicle from './dialogVehicle';
import FormDialogUnity from './dialogUnity';
import Steper from './steper';

class FormPerson extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentStep: 1,
            account: props.account,

            // person
            idperson: 0,
            name: '',
            active: true,

            // natural person
            cpf: '',
            rg: '',
            birthdate: '',
            idgender: '',

            // resident
            idaccount: 0,
            idtyperesident: '',
            answerable: true,
            sponsor: '',
            company: '',
            department: '',
            note: '',
            accesspermission: true,
            accessstart: '',
            accessend: '',

            // contact
            email: '',
            telone: '',
            teltwo: '',
            telthree: '',

            // n for n - person / unitys in account
            residentunity: [],
            auxUnity: '',

            // n for n - person / vehicles in account
            residentvehicle: [],
            auxVehicle: '',

            // access
            accesszone: [],

            // Preload
            typeresidents: [],
            persons: [],
            genders: [],

            username: '',

            load: false,

            loadCPF: true
        }
    }


    async getCompleteFromCPF(value) {
        if (this.state.loadCPF) {
            this.setState({ load: true });
            let auxAccount = this.state.account;
            const responseResident = await Api.post("/api/resident/get-complete-from-cpf",
                { cpf: value, idaccount: this.state.account.idperson }
            );

            if (responseResident.data !== null && responseResident.data !== "" && responseResident.data !== undefined) {
                let auxResidentUnity = responseResident.data.residentunity;

                if (auxResidentUnity !== null && auxResidentUnity !== undefined) {
                    // eslint-disable-next-line
                    auxResidentUnity.map(function (element, index, array) {
                        const indexUnitys = auxAccount.unitys.findIndex(e => e.idunity === element.idunity);
                        if (indexUnitys !== -1) {
                            auxResidentUnity[index].unityname = auxAccount.unitys[indexUnitys].unityname;
                        }
                    });
                } else {
                    auxResidentUnity = [];
                }

                let auxResidentVehicle = responseResident.data.residentvehicle;

                if (auxResidentVehicle !== null && auxResidentVehicle !== undefined) {
                    // eslint-disable-next-line
                    auxResidentVehicle.map(function (element, index, array) {
                        const indexVehicles = auxAccount.vehicles.findIndex(e => e.idvehicle === element.idvehicle);
                        if (indexVehicles !== -1) {
                            auxResidentVehicle[index].licenseplate = auxAccount.vehicles[indexVehicles].licenseplate;
                            auxResidentVehicle[index].model = auxAccount.vehicles[indexVehicles].model;
                            auxResidentVehicle[index].color = auxAccount.vehicles[indexVehicles].color;
                            auxResidentVehicle[index].manufacturer = auxAccount.vehicles[indexVehicles].manufacturer;
                        }
                    });
                } else {
                    auxResidentVehicle = [];
                }

                let auxDateArray = responseResident.data.birthdate.split(' ')[0].split('/');

                let auxBirthDate = auxDateArray[2] + "-" + auxDateArray[1] + "-" + auxDateArray[0];

                let auxSponsor = '';

                if (responseResident.data.sponsor !== 0) {
                    auxSponsor = responseResident.data.sponsor;
                }

                this.setState({
                    // person
                    idperson: responseResident.data.idperson,
                    name: responseResident.data.name,
                    active: responseResident.data.active,

                    // natural person
                    cpf: responseResident.data.cpf,
                    rg: responseResident.data.rg,
                    birthdate: auxBirthDate,
                    idgender: responseResident.data.idgender,

                    // resident
                    // idaccount: responseResident.data.idaccount,
                    idtyperesident: responseResident.data.idtyperesident,
                    answerable: responseResident.data.answerable,
                    sponsor: auxSponsor,
                    company: responseResident.data.company,
                    department: responseResident.data.department,
                    username: responseResident.data.username,
                    note: responseResident.data.note,
                    accesspermission: responseResident.data.accesspermission,
                    accessstart: responseResident.data.accessstart,
                    accessend: responseResident.data.accessend,

                    // contact
                    email: responseResident.data.email,
                    telone: responseResident.data.telone,
                    teltwo: responseResident.data.teltwo,
                    telthree: responseResident.data.telthree,

                    // n for n - person / unitys in account
                    residentunity: auxResidentUnity,

                    // n for n - person / vehicles in account
                    residentvehicle: auxResidentVehicle,

                    // access
                    accesszone: responseResident.data.accesszone,

                    load: false
                });

                // eslint-disable-next-line
                this.state.account.zones.map(zone => {
                    try {
                        let auxAccessZone = this.state.accesszone;

                        if (auxAccessZone === null)
                            auxAccessZone = [];

                        const indexAccessZone = auxAccessZone.findIndex(e => e.idzone === zone.idzone);
                        console.log(indexAccessZone);
                        if (indexAccessZone === -1) {
                            auxAccessZone.push(
                                {
                                    access: false,
                                    idperson: 0,
                                    idaccount: this.state.account.idperson,
                                    idzone: zone.idzone,
                                    zone: zone.zone,
                                    idschedule: ''
                                }
                            )
                        } else {
                            auxAccessZone[indexAccessZone].zone = zone.zone;
                        }

                        this.setState({
                            accesszone: auxAccessZone
                        })
                    }
                    catch {

                    }
                });

            } else {
                this.setState({ load: false });
            }

            this.setState({ loadCPF: false });
        }
    }

    async componentDidMount() {
        this.setState({ load: true });

        const responsePreload = await Api.get("/api/resident/preload?Id=" + this.state.account.idperson);

        let auxAccount = this.state.account;
        auxAccount.unitys = responsePreload.data.unity;
        auxAccount.vehicles = responsePreload.data.vehicle;

        let auxTypeResidents = responsePreload.data.typeresident;

        if (!HavePermission(16)) { auxTypeResidents.splice(auxTypeResidents.findIndex(x => x.label === "Funcionário"), 1); }
        if (!HavePermission(17)) { auxTypeResidents.splice(auxTypeResidents.findIndex(x => x.label === "Morador"), 1); }
        if (!HavePermission(18)) { auxTypeResidents.splice(auxTypeResidents.findIndex(x => x.label === "Prestador de serviço"), 1); }
        if (!HavePermission(19)) { auxTypeResidents.splice(auxTypeResidents.findIndex(x => x.label === "Visitante"), 1); }


        this.setState({
            typeresidents: auxTypeResidents,
            persons: responsePreload.data.sponsor,
            genders: responsePreload.data.gender,
            account: auxAccount
        });

        if (this.props.idResident !== 0) {
            const responseResident = await Api.post("/api/resident/get-complete",
                { idperson: this.props.idResident, idaccount: this.state.account.idperson }
            );

            let auxResidentUnity = responseResident.data.residentunity;

            if (auxResidentUnity !== null && auxResidentUnity !== undefined) {
                // eslint-disable-next-line
                auxResidentUnity.map(function (element, index, array) {
                    const indexUnitys = auxAccount.unitys.findIndex(e => e.idunity === element.idunity);
                    if (indexUnitys !== -1) {
                        auxResidentUnity[index].unityname = auxAccount.unitys[indexUnitys].unityname;
                    }
                });
            } else {
                auxResidentUnity = [];
            }

            let auxResidentVehicle = responseResident.data.residentvehicle;

            if (auxResidentVehicle !== null && auxResidentVehicle !== undefined) {
                // eslint-disable-next-line
                auxResidentVehicle.map(function (element, index, array) {
                    const indexVehicles = auxAccount.vehicles.findIndex(e => e.idvehicle === element.idvehicle);
                    if (indexVehicles !== -1) {
                        auxResidentVehicle[index].licenseplate = auxAccount.vehicles[indexVehicles].licenseplate;
                        auxResidentVehicle[index].model = auxAccount.vehicles[indexVehicles].model;
                        auxResidentVehicle[index].color = auxAccount.vehicles[indexVehicles].color;
                        auxResidentVehicle[index].manufacturer = auxAccount.vehicles[indexVehicles].manufacturer;
                    }
                });
            } else {
                auxResidentVehicle = [];
            }

            let auxDateArray = responseResident.data.birthdate.split(' ')[0].split('/');

            let auxBirthDate = auxDateArray[2] + "-" + auxDateArray[1] + "-" + auxDateArray[0];

            let auxSponsor = '';

            if (responseResident.data.sponsor !== 0) {
                auxSponsor = responseResident.data.sponsor;
            }

            console.log(responseResident.data);

            this.setState({
                // person
                idperson: responseResident.data.idperson,
                name: responseResident.data.name,
                active: responseResident.data.active,

                // natural person
                cpf: responseResident.data.cpf,
                rg: responseResident.data.rg,
                birthdate: auxBirthDate,
                idgender: responseResident.data.idgender,

                // resident
                idaccount: responseResident.data.idaccount,
                idtyperesident: responseResident.data.idtyperesident,
                answerable: responseResident.data.answerable,
                sponsor: auxSponsor,
                company: responseResident.data.company,
                department: responseResident.data.department,
                username: responseResident.data.username,
                note: responseResident.data.note,
                accesspermission: responseResident.data.accesspermission,
                accessstart: responseResident.data.accessstart,
                accessend: responseResident.data.accessend,

                // contact
                email: responseResident.data.email,
                telone: responseResident.data.telone,
                teltwo: responseResident.data.teltwo,
                telthree: responseResident.data.telthree,

                // n for n - person / unitys in account
                residentunity: auxResidentUnity,

                // n for n - person / vehicles in account
                residentvehicle: auxResidentVehicle,

                // access
                accesszone: responseResident.data.accesszone,

                load: false
            })
        }

        ValidatorForm.addValidationRule('isCPF', (value) => {
            if (isCPF(value)) {
                this.getCompleteFromCPF(value);
                return true;
            }
            this.setState({ loadCPF: true });
            return false;
        });

        ValidatorForm.addValidationRule('isDate', (value) => {
            const auxDate = value.split('-');
            const auxDateFormated = auxDate[2] + "/" + auxDate[1] + "/" + auxDate[0];
            if (isDate(auxDateFormated)) {
                return true;
            }
            return false;
        });


        // eslint-disable-next-line
        this.state.account.zones.map(zone => {
            try {
                let auxAccessZone = this.state.accesszone;

                if (auxAccessZone === null)
                    auxAccessZone = [];

                const indexAccessZone = auxAccessZone.findIndex(e => e.idzone === zone.idzone);
                if (indexAccessZone === -1) {
                    auxAccessZone.push(
                        {
                            access: false,
                            idperson: 0,
                            idaccount: this.state.account.idperson,
                            idzone: zone.idzone,
                            zone: zone.zone,
                            idschedule: ''
                        }
                    )
                } else {
                    auxAccessZone[indexAccessZone].zone = zone.zone;
                }

                this.setState({
                    accesszone: auxAccessZone
                })
            }
            catch {

            }
        })

        if (this.props.data !== undefined) {
            this.setState({

            });
        }

        this.setState({ load: false });
    }

    componentWillUnmount() {
        // remove rule when it is not needed
        ValidatorForm.removeValidationRule('isCPF');
        ValidatorForm.removeValidationRule('isDate');
    }

    deleteUnity = (id) => {
        let auxArray = this.state.residentunity;
        auxArray = auxArray.filter(e => e.idunity !== id);
        this.setState({ residentunity: auxArray });
    }

    deleteVehicle = (id) => {
        let auxArray = this.state.residentvehicle;
        auxArray = auxArray.filter(e => e.idvehicle !== id);
        this.setState({ residentvehicle: auxArray });
    }

    async getCPFDate(cep) {
        // const response = await Api.get("https://api.postmon.com.br/v1/cep/" + cep);
        // this.setState({
        //     address: response.data.logradouro,
        //     neighborhood: response.data.bairro,
        //     city: response.data.cidade,
        //     state: response.data.estado,
        //     country: 'Brasil'
        // })
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({ [name]: value });
    }

    handleChangeAccess = (event) => {
        const index = event.target.name;
        const value = event.target.value;

        let auxAccessZone = this.state.accesszone;
        auxAccessZone[index].idschedule = value;

        this.setState({ accesszone: auxAccessZone });
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

    handleChangeBooleanAccess = (event) => {
        const index = event.target.name;
        let value = event.target.value;

        let auxAccessZone = this.state.accesszone;

        const valueState = auxAccessZone[index].access;
        const variableType = typeof valueState;

        if (variableType === 'boolean') {
            if (valueState)
                value = false;
            else
                value = true;
        }

        auxAccessZone[index].access = value;

        this.setState({ accesszone: auxAccessZone });
    }

    handleAddUnity = () => {
        const { residentunity, auxUnity } = this.state;

        if (auxUnity === '')
            return;

        if (residentunity === null || residentunity === undefined)
            this.setState({ residentunity: [] });

        if (residentunity.findIndex(e => e.idunity === Number(auxUnity)) === -1) {
            let auxResidentUnity = residentunity;
            const indexUnity = this.state.account.unitys.findIndex(e => e.idunity === Number(auxUnity));
            auxResidentUnity.push(this.state.account.unitys[indexUnity]);

            this.setState({
                residentunity: auxResidentUnity
            });
        }
    }

    handleAddVehicle = () => {
        const { residentvehicle, auxVehicle } = this.state;

        if (auxVehicle === '')
            return;

        if (residentvehicle === null || residentvehicle === undefined)
            this.setState({ residentvehicle: [] });

        if (residentvehicle.findIndex(e => e.idvehicle === Number(auxVehicle)) === -1) {
            let auxResidentVehicle = residentvehicle;
            const indexVehicle = this.state.account.vehicles.findIndex(e => e.idvehicle === Number(auxVehicle));
            auxResidentVehicle.push(this.state.account.vehicles[indexVehicle]);

            this.setState({
                residentvehicle: auxResidentVehicle
            });
        }
    }

    handleSubmit = async event => {
        event.preventDefault();

        if (event.target.name === "formunity" || event.target.name === "formvehicle")
            return null;

        if (event.target.name === "1" || event.target.name === "2" || event.target.name === "3" || event.target.name === "4") {
            const auxStep = Number(event.target.name);
            this.setState({ currentStep: auxStep });
            return null;
        }

        this.setState({ load: true });
        let currentStep = this.state.currentStep;
        if (currentStep !== 4) {
            currentStep += 1;
            this.setState({
                currentStep: currentStep,
                load: false
            });
        }
        else {
            if (this.state.answerable)
                this.setState({ sponsor: 0 });

            this.setState({ idaccount: this.state.account.idperson });

            if (this.state.idgender === '') {
                this.setState({ idgender: 0 });
            }

            const { idaccount, idperson } = this.state;

            // const { account, idperson, name, active, cpf, rg, birthdate, idgender, idaccount, idtyperesident, answerable, sponsor, company, department, note, accesspermission, accessstart, accessend, email, telone, teltwo, telthree, residentunity, auxUnity, residentvehicle, auxVehicle, accesszone, typeresidents, persons, genders } = this.state;

            const { cpf, name, rg, birthdate, idgender, email, idtyperesident, answerable, sponsor, telone, teltwo, telthree, company, department, note, active } = this.state;
            // console.log("Step 1 ↓");
            // console.log(cpf + " - " + name + " - " + rg + " - " + birthdate + " - " + idgender + " - " + email + " - " + idtyperesident + " - " + answerable + " - " + sponsor + " - " + telone + " - " + teltwo + " - " + telthree + " - " + company + " - " + department + " - " + note + " - " + active);

            if (this.state.residentunity.length < 1) {
                this.setState({
                    residentunity: [{ idunity: 0, idaccount: 0, unityname: "", idtypeunity: 0, idunitystate: 0 }]
                });
            }
            const { residentunity } = this.state;
            // console.log("Step 2 ↓");
            // console.log(residentunity);

            if (this.state.residentvehicle.length < 1) {
                this.setState({
                    residentvehicle: [{ idvehicle: 0, licenseplate: "", model: "", manufacturer: "", color: "", comments: "", idaccount: 0, active: false }]
                });
            }
            const { residentvehicle } = this.state;
            // console.log("Step 3 ↓");
            // console.log(residentvehicle);

            const { accesspermission, accessstart, accessend, accesszone } = this.state;
            // console.log("Step 4 ↓");
            // console.log(accesspermission, accessstart, accessend);
            // console.log(accesszone);

            let auxAccessZone = this.state.accesszone;

            for (let index = 0; index < auxAccessZone.length; index++) {
                if (!auxAccessZone[index].access)
                    auxAccessZone[index].idschedule = 0;
            }

            this.setState({ accesszone: auxAccessZone });

            const response = await Api.put("/api/resident/add", { cpf, idperson, name, rg, birthdate, idgender, idaccount, email, idtyperesident, answerable, sponsor, telone, teltwo, telthree, company, department, note, active, residentunity, residentvehicle, accesspermission, accessstart, accessend, accesszone });
            alert(response.data.message);

            if (response.data.statuscode === 201) { // Se deu certo
                this.props.callbackParentCreateEdit();
                this.props.closeDialog();
            }

            this.setState({ load: false });
        }
    }

    onChildCreateUnity = async () => {
        this.setState({ load: true });
        const responseUnityAtt = await Api.get("/api/account/get-complete?Id=" + this.props.account.idperson + "&Parameters=6");
        let auxAccount = this.state.account;
        auxAccount.unitys = responseUnityAtt.data.unitys;
        this.setState({
            account: auxAccount,
            load: false
        });
    }

    onChildCreateVehicle = async () => {
        this.setState({ load: true });
        const responseVehicleAtt = await Api.get("/api/account/get-complete?Id=" + this.props.account.idperson + "&Parameters=7");
        let auxAccount = this.state.account;
        auxAccount.vehicles = responseVehicleAtt.data.vehicles;
        this.setState({
            account: auxAccount,
            load: false
        });
    }

    // #region controlSteper

    _next = () => {
        let currentStep = this.state.currentStep;
        currentStep = currentStep >= 1 ? 4 : currentStep + 1
        this.setState({
            currentStep: currentStep
        });
    }

    _prev = () => {
        let currentStep = this.state.currentStep
        currentStep = currentStep <= 1 ? 1 : currentStep - 1
        this.setState({
            currentStep: currentStep
        })
    }

    previousButton() {
        let currentStep = this.state.currentStep;
        if (currentStep !== 1) {
            return (
                <Button variant="outlined" className="btn-before" onClick={this._prev}>Anterior</Button>
            )
        }
        return null;
    }

    nextButton() {
        let currentStep = this.state.currentStep;
        if (currentStep < 4) {
            return (
                <Button variant="outlined" className="button-send" onClick={this._next}>Próximo</Button>
            )
        }
        return null;
    }

    // #endregion

    render() {
        return (
            <React.Fragment>

                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}>

                    <Steper step={this.state.currentStep} />

                    <br />

                    <Step1
                        currentStep={this.state.currentStep}
                        handleChange={this.handleChange}
                        handleChangeBoolean={this.handleChangeBoolean}
                        account={this.state.account}

                        cpf={this.state.cpf}
                        name={this.state.name}
                        rg={this.state.rg}

                        birthdate={this.state.birthdate}
                        idgender={this.state.idgender}
                        genders={this.state.genders}
                        email={this.state.email}

                        idtyperesident={this.state.idtyperesident}
                        typeresidents={this.state.typeresidents}
                        answerable={this.state.answerable}
                        sponsor={this.state.sponsor}
                        persons={this.state.persons}

                        telone={this.state.telone}
                        teltwo={this.state.teltwo}
                        telthree={this.state.telthree}

                        company={this.state.company}
                        department={this.state.department}
                        username={this.state.username}

                        note={this.state.note}
                        active={this.state.active}

                    />
                    <Step2
                        currentStep={this.state.currentStep}
                        handleChange={this.handleChange}
                        residentunity={this.state.residentunity}
                        account={this.state.account}
                        onChildCreateUnity={this.onChildCreateUnity}
                        auxUnity={this.state.auxUnity}
                        handleAddUnity={this.handleAddUnity}
                        deleteUnity={this.deleteUnity}
                    />
                    <Step3
                        currentStep={this.state.currentStep}
                        handleChange={this.handleChange}
                        handleAddVehicle={this.handleAddVehicle}
                        residentvehicle={this.state.residentvehicle}
                        account={this.state.account}
                        onChildCreateVehicle={this.onChildCreateVehicle}
                        auxVehicle={this.state.auxVehicle}
                        deleteVehicle={this.deleteVehicle}
                    />
                    <Step4
                        currentStep={this.state.currentStep}
                        handleChange={this.handleChange}
                        handleChangeBoolean={this.handleChangeBoolean}
                        handleChangeBooleanAccess={this.handleChangeBooleanAccess}
                        handleChangeAccess={this.handleChangeAccess}
                        account={this.state.account}
                        accesszone={this.state.accesszone}
                        accesspermission={this.state.accesspermission}
                        accessstart={this.state.accessstart}
                        accessend={this.state.accessend}
                    />

                    <br />

                    {this.previousButton()}
                    {/* {this.nextButton()} */}

                </ValidatorForm>
                <Loading on={this.state.load} />
            </React.Fragment>
        );
    }
}

function Step1(props) {
    if (props.currentStep !== 1) {
        return null
    }
    return (
        <div className="inner-div-margin-left">
            <TextValidator
                label="CPF"
                onChange={props.handleChange}
                name="cpf"
                value={props.cpf}
                validators={['required', 'isCPF']}
                errorMessages={['O CPF é requerido.', 'O CPF não é valido.']}
            />

            <TextValidator
                label="Nome"
                onChange={props.handleChange}
                name="name"
                value={props.name}
                validators={['required', 'minStringLength: 4']}
                errorMessages={['Nome é requerido.', 'O nome é muito curto.']}
            />

            <TextValidator
                label="RG"
                onChange={props.handleChange}
                name="rg"
                value={props.rg}
            />

            <br />

            <TextValidator
                label="Data de Nascimento"
                onChange={props.handleChange}
                name="birthdate"
                value={props.birthdate}
                className="select-normalize"
                type="date"
                validators={['isDate']}
                errorMessages={['A data não é valida.']}
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <SelectValidator
                label="Gênero"
                onChange={props.handleChange}
                name="idgender"
                value={props.idgender}
                className="select-normalize"
            >
                {props.genders !== undefined && props.genders !== null &&
                    props.genders.map(gender =>
                        <MenuItem key={gender.value} value={Number(gender.value)}>{gender.label}</MenuItem>
                    )
                }
            </SelectValidator>

            <TextValidator
                label="E-mail"
                onChange={props.handleChange}
                name="email"
                value={props.email}
                className="select-normalize"
                validators={['isEmail']}
                errorMessages={['O e-mail não é valido.']}
            />

            <br />

            <SelectValidator
                label="Tipo"
                onChange={props.handleChange}
                name="idtyperesident"
                value={props.idtyperesident}
                className="select-normalize"
                validators={['required']}
                errorMessages={['O tipo é requerido.']}
            >
                {props.typeresidents !== undefined && props.typeresidents !== null &&
                    props.typeresidents.map(typeresident =>
                        <MenuItem key={typeresident.value} value={Number(typeresident.value)}>{typeresident.label}</MenuItem>
                    )
                }
            </SelectValidator>

            <SelectValidator
                label="Responsável"
                onChange={props.handleChangeBoolean}
                name="answerable"
                value={props.answerable}
                className="select-normalize"
                validators={['required']}
                errorMessages={['O nível é requerido.']}
            >
                <MenuItem value="true">Sim</MenuItem>
                <MenuItem value="false">Não</MenuItem>
            </SelectValidator>
            {!props.answerable &&
                <SelectValidator
                    label="Supervisor"
                    onChange={props.handleChange}
                    name="sponsor"
                    value={props.sponsor}
                    className="select-normalize"
                    validators={['required']}
                    errorMessages={['O supervisor é requerido.']}
                >
                    {props.persons !== undefined && props.persons !== null &&
                        props.persons.map(person =>
                            <MenuItem key={person.value} value={person.value}>{person.label}</MenuItem>
                        )
                    }
                </SelectValidator>
            }
            <br />

            <TextValidator
                label="Telefone 1"
                onChange={props.handleChange}
                name="telone"
                value={props.telone}
                className="select-normalize"
                validators={['required']}
                errorMessages={['O tipo é requerido.']}
            />

            <TextValidator
                label="Telefone 2"
                onChange={props.handleChange}
                name="teltwo"
                value={props.teltwo}
                className="select-normalize"
            />

            <TextValidator
                label="Telefone 3"
                onChange={props.handleChange}
                name="telthree"
                value={props.telthree}
                className="select-normalize"
            />

            <br />

            <TextValidator
                label="Empresa"
                onChange={props.handleChange}
                name="company"
                value={props.company}
                className="select-normalize"
            />

            <TextValidator
                label="Departamento"
                onChange={props.handleChange}
                name="department"
                value={props.department}
                className="select-normalize"
            />

            {props.username !== '' &&
                <TextValidator
                    label="Usuário"
                    onChange={props.handleChange}
                    name="username"
                    value={props.username}
                    className="select-normalize"
                    InputProps={{
                        readOnly: true,
                    }}
                />
            }

            <br />

            <TextValidator
                fullWidth
                multiline
                rows="3"
                label="Observações"
                onChange={props.handleChange}
                name="note"
                value={props.note}
            />

            <FormControlLabel
                control={<Checkbox
                    checked={props.active}
                    onChange={props.handleChangeBoolean}
                    value={props.active}
                    name="active"
                    color="primary"
                />
                }
                label="Ativo"
                validators={['required']}
                className="padding-top-check"
            />

            <br />
            <Button variant="outlined" type="submit" className="button-send">Próximo</Button>
        </div>
    );
}

function Step2(props) {
    if (props.currentStep !== 2) {
        return null
    }
    return (
        <div className="inner-div-margin-left">

            {HavePermission(20) && <FormDialogUnity account={props.account} callbackParentCreateEdit={props.onChildCreateUnity} />}

            <br />

            <SelectValidator
                label="Unidade"
                onChange={props.handleChange}
                name="auxUnity"
                value={props.auxUnity}
                className="select-normalize"
            >
                {props.account.unitys !== undefined && props.account.unitys !== null &&
                    props.account.unitys.map(ru =>
                        <MenuItem key={ru.idunity} value={ru.idunity}>{ru.unityname}</MenuItem>
                    )
                }
            </SelectValidator>

            <Button variant="contained" color="primary" type="button" className="button-send" onClick={() => props.handleAddUnity()}>Adicionar</Button>

            <br /><br />

            {props.residentunity !== undefined &&
                props.residentunity.map(ru =>
                    <div className="space-between" key={ru.idunity}>
                        <MenuItem value={ru.idunity}>{ru.unityname} </MenuItem>
                        <span className="margin-left-icon btn-icon" onClick={() => { props.deleteUnity(ru.idunity) }}><DeleteIcon /></span>
                    </div>
                )
            }

            <br /> <br />

            <Button variant="outlined" className="button-send" type="submit">Próximo</Button>
        </div>
    );
}

function Step3(props) {
    if (props.currentStep !== 3) {
        return null
    }
    return (
        <div className="inner-div-margin-left">

            {HavePermission(21) && <FormDialogVehicle account={props.account} callbackParentCreateEdit={props.onChildCreateVehicle} />}

            <br />

            <SelectValidator
                label="Veículo"
                onChange={props.handleChange}
                name="auxVehicle"
                value={props.auxVehicle}
                className="select-normalize"
            >
                {props.account.vehicles !== undefined && props.account.vehicles !== null &&
                    props.account.vehicles.map(vehicle =>
                        <MenuItem key={vehicle.idvehicle} value={vehicle.idvehicle}>{vehicle.licenseplate} - {vehicle.manufacturer} {vehicle.model} - {vehicle.color}</MenuItem>
                    )
                }
            </SelectValidator>

            <Button variant="contained" color="primary" type="button" className="button-send" onClick={() => props.handleAddVehicle()}>Adicionar</Button>

            <br /><br />

            {props.residentvehicle !== undefined && props.residentvehicle !== null &&
                props.residentvehicle.map(vehicle =>
                    <div className="space-between" key={vehicle.idvehicle}>
                        <MenuItem value={vehicle.idvehicle}>{vehicle.licenseplate} - {vehicle.manufacturer} {vehicle.model} - {vehicle.color}</MenuItem>
                        <span className="margin-left-icon btn-icon" onClick={() => { props.deleteVehicle(vehicle.idvehicle) }}><DeleteIcon /></span>
                    </div>
                )
            }

            <br /> <br />

            <Button variant="outlined" className="button-send" type="submit">Próximo</Button>
        </div>
    );
}

function Step4(props) {
    if (props.currentStep !== 4) {
        return null
    }
    return (
        <div className="inner-div-margin-left">

            <div className="between-account">
                <SelectValidator
                    label="Permissão de acesso"
                    onChange={props.handleChangeBoolean}
                    name="accesspermission"
                    value={props.accesspermission}
                    className="select-normalize"
                    validators={['required']}
                    errorMessages={['O nível é requerido.']}
                >
                    <MenuItem value="true">Autorizado</MenuItem>
                    <MenuItem value="false">Não autorizado</MenuItem>
                </SelectValidator>

                <TextValidator
                    label="Início do acesso"
                    onChange={props.handleChange}
                    name="accessstart"
                    value={props.accessstart}
                    className="select-normalize"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextValidator
                    label="Fim do acesso"
                    onChange={props.handleChange}
                    name="accessend"
                    value={props.accessend}
                    className="select-normalize"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </div>
            <br /><br />

            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <h3>Acesso</h3>
                </Grid>

                <Grid item xs={4}>
                    <h3>Zona</h3>
                </Grid>

                <Grid item xs={4}>
                    <h3>Horários</h3>
                </Grid>
            </Grid>

            {props.accesszone !== null && props.accesszone.map((zonemap, i) => {
                return <div key={zonemap.idzone}>
                    {props.accesspermission &&
                        <Grid container spacing={1}>
                            {props.accesszone[i].access &&
                                <Grid item xs={4}>
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={props.accesszone[i].access}
                                            onChange={props.handleChangeBooleanAccess}
                                            value={props.active}
                                            name={String(i)}
                                            color="primary"
                                        />
                                        }
                                        label="Com acesso"
                                        validators={['required']}
                                        className="padding-top-check"
                                    />
                                </Grid>
                            }

                            {!props.accesszone[i].access && props.accesszone !== null &&
                                <Grid item xs={4}>
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={props.accesszone[i].access}
                                            onChange={props.handleChangeBooleanAccess}
                                            value={props.active}
                                            name={String(i)}
                                            color="primary"
                                        />
                                        }
                                        label="Sem acesso"
                                        validators={['required']}
                                        className="padding-top-check"
                                    />
                                </Grid>
                            }

                            <Grid item xs={4}>
                                <ListItemText className="margin-top-align" primary={zonemap.zone} />
                            </Grid>
                            {props.accesszone[i].access && props.accesszone !== null &&
                                <Grid item xs={4}>
                                    <SelectValidator
                                        label="Horário"
                                        onChange={props.handleChangeAccess}
                                        name={String(i)}
                                        value={props.accesszone[i].idschedule}
                                        className="select-normalize"
                                        validators={['required']}
                                        errorMessages={['O horário é requerido.']}
                                    >
                                        {props.account.schedules !== undefined && props.account.schedules !== null &&
                                            props.account.schedules.map(schedule =>
                                                <MenuItem key={schedule.idschedule} value={schedule.idschedule}>{schedule.name}</MenuItem>
                                            )
                                        }
                                    </SelectValidator>
                                </Grid>
                            }
                        </Grid>
                    }
                </div>
            })}



            <br /><br />

            <Button variant="outlined" className="button-send" type="submit">Salvar</Button>
        </div >
    );
}

export default FormPerson;