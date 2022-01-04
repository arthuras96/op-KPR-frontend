import React from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import './styles.css';
import Api from "../../services/api";
import Loading from '../../components/Loading';


class FormZone extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            idzone: 0,
            // idPerson: 0,
            zone: '',
            active: true,
            isrestricted: false,

            load: false
        }
    }

    componentDidMount() {
        if (this.props.account !== undefined) {
            console.log(this.props.account);
            this.setState({
                idperson: this.props.account.idperson,
            });

            if (this.props.account.idzone !== undefined) {

                // const auxActive = this.stringToBoolean(this.props.account.active);
                // const auxIsRestricted = this.stringToBoolean(this.props.account.isRestricted);

                this.setState({
                    idzone: this.props.account.idzone,
                    zone: this.props.account.zone,
                    active: this.props.account.active,
                    isrestricted: this.props.account.isrestricted,
                });
            }

        } else {
            alert("Houve uma falha ao executar ação. Por favor, tente novamente.\nCaso o problema persista, contate a TI.");
        }

    }

    stringToBoolean(string) {
        switch (string.toLowerCase().trim()) {
            case "true": case "yes": case "1": return true;
            case "false": case "no": case "0": case null: return false;
            default: return Boolean(string);
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
        event.preventDefault();
        this.setState({ load: true });
        const { idzone, idperson, zone, active, isrestricted } = this.state;

        // const auxActive = active.toString();
        // const auxIsRestricted = isRestricted.toString();

        const response = await Api.put("/api/account/add-zone", { idzone, idperson, zone, active, isrestricted });
        alert(response.data.message);

        if (response.data.statuscode === 201) { // Se deu certo
            this.props.callbackParentCreateEdit();
            this.props.closeDialog();
        }

        this.setState({ load: false });
    }

    render() {
        return (
            <React.Fragment>

                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}>

                    <Step1
                        handleChange={this.handleChange}
                        handleChangeBoolean={this.handleChangeBoolean}
                        zone={this.state.zone}
                        active={this.state.active}
                        isrestricted={this.state.isrestricted}
                    />

                </ValidatorForm>
                <Loading on={this.state.load} />
            </React.Fragment>
        );
    }
}

function Step1(props) {
    return (
        <div>
            <TextValidator
                label="Zona"
                onChange={props.handleChange}
                name="zone"
                value={props.zone}
                validators={['required']}
                errorMessages={['A zona é requerida.']}
                className="padding-right-text"
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

            <FormControlLabel
                control={<Checkbox
                    checked={props.isrestricted}
                    onChange={props.handleChangeBoolean}
                    value={props.isrestricted}
                    name="isrestricted"
                    color="primary"
                />
                }
                label="Zona restrita"
                validators={['required']}
                className="padding-top-check"
            />

            <br />
            <Button variant="outlined" className="button-send" type="submit">Salvar</Button>
        </div>
    );
}

export default FormZone;