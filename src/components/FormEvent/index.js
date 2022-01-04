import React from 'react';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';

import './styles.css';
import Loading from '../Loading';
import Api from '../../services/api';

class FormEvent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentStep: 1,
            load: false,
            idperson: 0,
            idevent: 0,
            name: '',
            idpriority: '',
            priority: '',
            manualoccurrence: true,
            manualcreation: true,
            recordimages: false,
            idzone: '',
            active: true,
            contInstructions: 0,
            auxInstruction: '',
            instructions: '',
            actions: [
                {}
            ],
            zones: [
                {}
            ]
        }
    }

    componentDidMount() {
        if (this.props.event !== undefined) {
            const auxInstructions = this.props.event.instructions.split("<br />").join("\n");
            this.setState({
                idevent: this.props.event.idevent,
                name: this.props.event.name,
                idpriority: this.props.event.idpriority,
                priority: this.props.event.priority,
                manualoccurrence: this.props.event.manualoccurrence,
                manualcreation: this.props.event.manualcreation,
                recordimages: this.props.event.recordimages,
                idzone: this.props.event.idzone,
                active: this.props.event.active,
                instructions: auxInstructions,
                actions: this.props.event.actions,
            });
        };

        if (this.props.account !== undefined) {
            this.setState({
                idperson: this.props.account.idperson
            });
        };

        if (this.props.account.zones !== undefined) {
            let auxZones = [];
            // eslint-disable-next-line
            this.props.account.zones.map(zone => {
                if (zone.active) {
                    auxZones.push({
                        value: zone.idzone, label: zone.zone
                    })
                }
            });

            this.setState({
                zones: auxZones
            });
        }
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
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
            const { idperson, idevent, name, idpriority, manualoccurrence, manualcreation, recordimages, idzone, active, instructions } = this.state;
            const auxPriority = Number(idpriority);
            const response = await Api.put("/api/account/add-event", { idevent, name, idpriority: auxPriority, manualoccurrence, manualcreation, recordimages, idzone, active, instructions, idperson });
            alert(response.data.message);

            if (response.data.statuscode === 201) { // Se deu certo
                this.props.callbackParentCreateEdit();
                this.props.closeDialog();
            }

            this.setState({ load: false });
        }
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
            <div className="set-min">
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
                            idpriority={this.state.idpriority}
                            manualoccurrence={this.state.manualoccurrence}
                            recordimages={this.state.recordimages}
                            idzone={this.state.idzone}
                            active={this.state.active}
                            zones={this.state.zones}
                        />
                        <Step2
                            currentStep={this.state.currentStep}
                            handleChange={this.handleChange}
                            instructions={this.state.instructions}
                        />

                        <br />

                        {this.previousButton()}

                    </ValidatorForm>
                    <Loading on={this.state.load} />
                </React.Fragment>
            </div>
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
                label="Nome"
                onChange={props.handleChange}
                name="name"
                value={props.name}
                validators={['required']}
                errorMessages={['O nome do evento é requerido.']}
                className="select-normalize"
            />

            <SelectValidator
                label="Prioridade"
                onChange={props.handleChange}
                name="idpriority"
                value={props.idpriority}
                validators={['required']}
                errorMessages={['A prioridade é requerida.']}
                className="select-normalize"
            >
                <MenuItem value="1">Baixa</MenuItem>
                <MenuItem value="2">Média</MenuItem>
                <MenuItem value="3">Alta</MenuItem>
                <MenuItem value="4">Critica</MenuItem>
            </SelectValidator>

            <SelectValidator
                label="Zona"
                onChange={props.handleChange}
                name="idzone"
                value={props.idzone}
                validators={['required']}
                errorMessages={['A zona é requerida.']}
                className="select-normalize"
            >
                {props.zones !== undefined &&
                    props.zones.map(zone =>
                        <MenuItem key={zone.value} value={zone.value}>{zone.label}</MenuItem>
                    )
                }
            </SelectValidator>

            <br />

            <FormControlLabel
                control={<Checkbox
                    checked={props.manualoccurrence}
                    onChange={props.handleChangeBoolean}
                    value={props.manualoccurrence}
                    name="manualoccurrence"
                    color="primary"
                />
                }
                label="Permite ocorrência manual?"
                className="padding-top-check"
            />

            <FormControlLabel
                control={<Checkbox
                    checked={props.recordimages}
                    onChange={props.handleChangeBoolean}
                    value={props.recordimages}
                    name="recordimages"
                    color="primary"
                />
                }
                label="Grava imagens?"
                className="padding-top-check"
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
                label="Ativo?"
                className="padding-top-check"
            />

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
        <div>
            <form>
                <TextValidator
                    multiline
                    rows="5"
                    label="Instrução"
                    name="instructions"
                    value={props.instructions}
                    onChange={props.handleChange}
                    className="select-normalize"
                />
                <br />
                <div><Button variant="outlined" className="button-send" type="submit">Salvar</Button></div>
            </form>
        </div>
    );
}

export default FormEvent;