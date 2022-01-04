import React from 'react';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import { isCNPJ, isCEP } from 'brazilian-values';

import './styles.css';
import CepApi from '../../services/cepApi';
import Api from "../../services/api";
import Loading from '../../components/Loading';


class FormCompany extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            idperson: 0,
            currentStep: 1,
            name: '',
            contact: '',
            cnpj: '',
            telone: '',
            teltwo: '',
            telthree: '',
            email: '',
            duresspassword: '',
            historicpersist: '',
            active: true,
            cep: '',
            address: '',
            number: '',
            reference: '',
            neighborhood: '',
            city: '',
            state: '',
            country: '',

            load: false
        }
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isCNPJ', (value) => {
            if (isCNPJ(value)) {
                return true;
            }
            return false;
        });

        ValidatorForm.addValidationRule('isCEP', (value) => {
            if (isCEP(value)) {
                this.getCep(value);
                return true;
            }
            return false;
        });

        console.log(this.props.data);
        if (this.props.data !== undefined) {
            this.setState({
                idperson: this.props.data.idperson,
                name: this.props.data.name,
                contact: this.props.data.contact,
                cnpj: this.props.data.cnpj,
                type: this.props.data.type,
                telone: this.props.data.telone,
                teltwo: this.props.data.teltwo,
                telthree: this.props.data.telthree,
                email: this.props.data.email,
                duresspassword: this.props.data.duresspassword,
                historicpersist: this.props.data.historicpersist,
                active: this.props.data.active,
                cep: this.props.data.cep,
                address: this.props.data.address,
                number: this.props.data.number,
                reference: this.props.data.reference,
                neighborhood: this.props.data.neighborhood,
                city: this.props.data.city,
                state: this.props.data.state,
                country: this.props.data.country,
            });
        }

    }

    componentWillUnmount() {
        // remove rule when it is not needed
        ValidatorForm.removeValidationRule('isCNPJ');
        ValidatorForm.removeValidationRule('isCEP');
    }

    async getCep(cep) {
        const response = await CepApi.get("https://api.postmon.com.br/v1/cep/" + cep);
        // console.log(response);
        this.setState({
            address: response.data.logradouro,
            neighborhood: response.data.bairro,
            city: response.data.cidade,
            state: response.data.estado,
            country: 'Brasil'
        })
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
        event.preventDefault();
        this.setState({ load: true });
        let currentStep = this.state.currentStep;
        if (currentStep === 1) {
            currentStep += 1;
            this.setState({
                currentStep: currentStep,
                load: false
            });
        }
        else {
            const { idperson, name, contact, cnpj, telone, teltwo, telthree, email, duresspassword, historicpersist, active, cep, address, number, reference, neighborhood, city, state, country } = this.state;
            const response = await Api.put("/api/account/add", { idperson, name, contact, cnpj, telone, teltwo, telthree, email, duresspassword, historicpersist, active, cep, address, number, reference, neighborhood, city, state, country });
            alert(response.data.message);

            if (response.data.statuscode === 201) { // Se deu certo
                this.props.callbackParentCreateEdit();
                this.props.closeDialog();
            }

            this.setState({ load: false });

        }
    }

    _next = () => {
        let currentStep = this.state.currentStep;
        currentStep = currentStep >= 1 ? 2 : currentStep + 1
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
        if (currentStep < 2) {
            return (
                <Button onClick={this._next}>Próximo</Button>
            )
        }
        return null;
    }

    render() {
        return (
            <React.Fragment>

                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}>

                    <Step1
                        currentStep={this.state.currentStep}
                        handleChange={this.handleChange}
                        handleChangeBoolean={this.handleChangeBoolean}
                        name={this.state.name}
                        contact={this.state.contact}
                        // company={this.state.company}
                        cnpj={this.state.cnpj}
                        type={this.state.type}
                        telone={this.state.telone}
                        teltwo={this.state.teltwo}
                        telthree={this.state.telthree}
                        email={this.state.email}
                        duresspassword={this.state.duresspassword}
                        historicpersist={this.state.historicpersist}
                        active={this.state.active}
                    />
                    <Step2
                        currentStep={this.state.currentStep}
                        handleChange={this.handleChange}
                        cep={this.state.cep}
                        address={this.state.address}
                        number={this.state.number}
                        reference={this.state.reference}
                        neighborhood={this.state.neighborhood}
                        city={this.state.city}
                        state={this.state.state}
                        country={this.state.country}
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
                label="CNPJ"
                onChange={props.handleChange}
                name="cnpj"
                value={props.cnpj}
                validators={['required', 'isCNPJ']}
                errorMessages={['O CNPJ é requerido.', 'O CNPJ não é valido.']}
            />

            <TextValidator
                label="Conta"
                onChange={props.handleChange}
                name="name"
                value={props.name}
                validators={['required', 'minStringLength: 4']}
                errorMessages={['Conta é requerido.', 'O nome é muito curto.']}
            />

            <TextValidator
                label="Contato"
                onChange={props.handleChange}
                name="contact"
                value={props.contact}
                validators={['required', 'minStringLength: 4']}
                errorMessages={['O contato é requerido.', 'O nome é muito curto.']}
            />

            <br />

            <TextValidator
                label="Telefone"
                onChange={props.handleChange}
                name="telone"
                value={props.telone}
                validators={['required']}
                errorMessages={['O telefone é requerido.']}
            />

            <TextValidator
                label="Telefone"
                onChange={props.handleChange}
                name="teltwo"
                value={props.teltwo}
                validators={['required']}
                errorMessages={['O telefone é requerido.']}
            />

            <TextValidator
                label="Telefone"
                onChange={props.handleChange}
                name="telthree"
                value={props.telthree}
            />

            <TextValidator
                label="E-mail"
                onChange={props.handleChange}
                name="email"
                value={props.email}
                validators={['required', 'isEmail']}
                errorMessages={['O e-mail é requerido.', 'O e-mail não é valido.']}
            />

            <TextValidator
                label="Senha de coação"
                onChange={props.handleChange}
                name="duresspassword"
                value={props.duresspassword}
                validators={['required', 'minStringLength: 4']}
                errorMessages={['A senha é requerida.', 'A senha é muito curta.']}
            />

            <TextValidator
                label="Histórico (meses)"
                onChange={props.handleChange}
                name="historicpersist"
                value={props.historicpersist}
                validators={['required', 'isNumber', 'maxNumber:48', 'minNumber:6']}
                errorMessages={['Histórico é requerido.', 'Valores numericos.', 'Máximo: 48 meses', 'Minimo: 6 meses']}
            />

            <SelectValidator
                label="Status"
                onChange={props.handleChangeBoolean}
                name="active"
                value={props.active}
                validators={['required']}
                errorMessages={['O status é requerido.']}
                className="select-normalize"
            >
                <MenuItem value="true">Ativo</MenuItem>
                <MenuItem value="false">Inativo</MenuItem>
            </SelectValidator>
            <br />
            <Button variant="outlined" className="button-send" type="submit">Próximo</Button>
        </div>
    );
}

function Step2(props) {
    if (props.currentStep !== 2) {
        return null
    }
    return (
        <div className="inner-div-margin-left">
            <TextValidator
                label="CEP"
                onChange={props.handleChange}
                name="cep" value={props.cep}
                validators={['required', 'isCEP']}
                errorMessages={['O CEP é requerido.', 'O CEP não é valido.']}
            />

            <TextValidator
                label="Endereço"
                onChange={props.handleChange}
                name="address"
                value={props.address}
                validators={['required', 'minStringLength: 4']}
                errorMessages={['O endereço é requerido.', 'O endereço é muito curto.']}
            />

            <TextValidator
                label="Número"
                onChange={props.handleChange}
                name="number"
                value={props.number}
                validators={['required', 'isNumber']}
                errorMessages={['Histórico é requerido.', 'Valores numericos.']}
            />

            <TextValidator
                label="Referência"
                onChange={props.handleChange}
                name="reference"
                value={props.reference}
            />

            <TextValidator
                label="Bairro"
                onChange={props.handleChange}
                name="neighborhood"
                value={props.neighborhood}
                validators={['required', 'minStringLength: 4']}
                errorMessages={['O bairro é requerido.', 'O nome do bairro é muito curto.']}
            />

            <TextValidator
                label="Cidade"
                onChange={props.handleChange}
                name="city"
                value={props.city}
                validators={['required', 'minStringLength: 4']}
                errorMessages={['A cidade é requerida.', 'O nome da cidade é muito curto.']}
            />

            <TextValidator
                label="Estado"
                onChange={props.handleChange}
                name="state"
                value={props.state}
                validators={['required', 'minStringLength: 2']}
                errorMessages={['O estado é requerido.', 'O nome do Estado é muito curto.']}
            />

            <TextValidator
                label="País"
                onChange={props.handleChange}
                name="country"
                value={props.country}
                validators={['required', 'minStringLength: 4']}
                errorMessages={['O país é requerido.', 'O nome do País é muito curto.']}
            />

            <Button variant="outlined" className="button-send" type="submit">Salvar</Button>

        </div>
    );
}

export default FormCompany;