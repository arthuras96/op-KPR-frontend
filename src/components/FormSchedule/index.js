import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import TimeRangeSlider from 'react-time-range-slider';

import './styles.css';
import Api from "../../services/api";
import Loading from '../../components/Loading';


class FormSchedule extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            load: false,
            idschedule: 0,
            idperson: 0,
            name: '',
            description: '',
            boolsunday: false,
            boolmonday: false,
            booltuesday: false,
            boolwednesday: false,
            boolthursday: false,
            boolfriday: false,
            boolsaturday: false,
            timesunday: { start: "00:00", end: "23:59" },
            timemonday: { start: "00:00", end: "23:59" },
            timetuesday: { start: "00:00", end: "23:59" },
            timewednesday: { start: "00:00", end: "23:59" },
            timethursday: { start: "00:00", end: "23:59" },
            timefriday: { start: "00:00", end: "23:59" },
            timesaturday: { start: "00:00", end: "23:59" },
        }
    }

    componentDidMount() {
        if (this.props.account.idperson !== undefined)
            this.setState({
                idperson: Number(this.props.account.idperson)
            });

        if (this.props.data !== undefined) {
            this.setState({
                idschedule: this.props.data.idschedule,
                name: this.props.data.name,
                description: this.props.data.description,
                boolsunday: this.props.data.boolsunday,
                boolmonday: this.props.data.boolmonday,
                booltuesday: this.props.data.booltuesday,
                boolwednesday: this.props.data.boolwednesday,
                boolthursday: this.props.data.boolthursday,
                boolfriday: this.props.data.boolfriday,
                boolsaturday: this.props.data.boolsaturday,
                timesunday: this.props.data.timesunday,
                timemonday: this.props.data.timemonday,
                timetuesday: this.props.data.timetuesday,
                timewednesday: this.props.data.timewednesday,
                timethursday: this.props.data.timethursday,
                timefriday: this.props.data.timefriday,
                timesaturday: this.props.data.timesaturday
            });
        }
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({ [name]: value });
    }

    // #region handleChangeDays
    handleChangeSunday = (event) => {
        const value = event;
        this.setState({ timesunday: value });
    }

    handleChangeMonday = (event) => {
        const value = event;
        this.setState({ timemonday: value });
    }

    handleChangeTuesday = (event) => {
        const value = event;
        this.setState({ timetuesday: value });
    }

    handleChangeWednesday = (event) => {
        const value = event;
        this.setState({ timewednesday: value });
    }

    handleChangeThursday = (event) => {
        const value = event;
        this.setState({ timethursday: value });
    }

    handleChangeFriday = (event) => {
        const value = event;
        this.setState({ timefriday: value });
    }

    handleChangeSaturday = (event) => {
        const value = event;
        this.setState({ timesaturday: value });
    }

    // #endregion

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
        const { idschedule, idperson, name, description, boolsunday, boolmonday, booltuesday, boolwednesday, boolthursday, boolfriday, boolsaturday, timesunday, timemonday, timetuesday, timewednesday, timethursday, timefriday, timesaturday } = this.state;
        const response = await Api.put("/api/account/add-schedule", { idschedule, idperson, name, description, boolsunday, boolmonday, booltuesday, boolwednesday, boolthursday, boolfriday, boolsaturday, timesunday, timemonday, timetuesday, timewednesday, timethursday, timefriday, timesaturday });
        alert(response.data.message);

        if (response.data.statuscode === 201) { // Se deu certo
            this.props.callbackParentCreateEdit();
            this.props.closeDialog();
        }

        this.setState({ load: false });
    }

    render() {
        return (
            <div className="inner-div-margin-left">
                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}>

                    <TextValidator
                        label="Nome"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                        validators={['required']}
                        errorMessages={['O nome é requerido.']}
                    // className="select-normalize-form-task"
                    />

                    <TextValidator
                        label="Descrição"
                        name="description"
                        value={this.state.description}
                        onChange={this.handleChange}
                    // className="select-normalize-form-task"
                    />

                    <br /><br />

                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.boolsunday}
                            onChange={this.handleChangeBoolean}
                            value={this.state.boolsunday}
                            name="boolsunday"
                            color="primary"
                        />
                        }
                        label="Domingo"
                        className="padding-top-check"
                    />
                    <br />
                    {this.state.boolsunday === true &&
                        <div>
                            <TimeRangeSlider
                                disabled={!this.state.boolsunday}
                                format={24}
                                maxValue={"23:59"}
                                minValue={"00:00"}
                                name={"timesunday"}
                                onChange={this.handleChangeSunday}
                                step={15}
                                value={this.state.timesunday}
                            />

                            <div className="sub-time">
                                <span>De: {this.state.timesunday.start}</span>
                                <span>Até: {this.state.timesunday.end}</span>
                            </div>
                        </div>
                    }

                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.boolmonday}
                            onChange={this.handleChangeBoolean}
                            value={this.state.boolmonday}
                            name="boolmonday"
                            color="primary"
                        />
                        }
                        label="Segunda-feira"
                        className="padding-top-check"
                    />
                    <br />
                    {this.state.boolmonday === true &&
                        <div>
                            <TimeRangeSlider
                                disabled={!this.state.boolmonday}
                                format={24}
                                maxValue={"23:59"}
                                minValue={"00:00"}
                                name={"timemonday"}
                                onChange={this.handleChangeMonday}
                                step={15}
                                value={this.state.timemonday}
                            />

                            <div className="sub-time">
                                <span>De: {this.state.timemonday.start}</span>
                                <span>Até: {this.state.timemonday.end}</span>
                            </div>
                        </div>
                    }

                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.booltuesday}
                            onChange={this.handleChangeBoolean}
                            value={this.state.booltuesday}
                            name="booltuesday"
                            color="primary"
                        />
                        }
                        label="Terça-feira"
                        className="padding-top-check"
                    />
                    <br />
                    {this.state.booltuesday === true &&
                        <div>
                            <TimeRangeSlider
                                disabled={!this.state.booltuesday}
                                format={24}
                                maxValue={"23:59"}
                                minValue={"00:00"}
                                name={"timetuesday"}
                                onChange={this.handleChangeTuesday}
                                step={15}
                                value={this.state.timetuesday}
                            />

                            <div className="sub-time">
                                <span>De: {this.state.timetuesday.start}</span>
                                <span>Até: {this.state.timetuesday.end}</span>
                            </div>
                        </div>
                    }

                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.boolwednesday}
                            onChange={this.handleChangeBoolean}
                            value={this.state.boolwednesday}
                            name="boolwednesday"
                            color="primary"
                        />
                        }
                        label="Quarta-feira"
                        className="padding-top-check"
                    />
                    <br />
                    {this.state.boolwednesday === true &&
                        <div>
                            <TimeRangeSlider
                                disabled={!this.state.boolwednesday}
                                format={24}
                                maxValue={"23:59"}
                                minValue={"00:00"}
                                name={"timeWednesday"}
                                onChange={this.handleChangeWednesday}
                                step={15}
                                value={this.state.timewednesday}
                            />

                            <div className="sub-time">
                                <span>De: {this.state.timewednesday.start}</span>
                                <span>Até: {this.state.timewednesday.end}</span>
                            </div>
                        </div>
                    }

                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.boolthursday}
                            onChange={this.handleChangeBoolean}
                            value={this.state.boolthursday}
                            name="boolthursday"
                            color="primary"
                        />
                        }
                        label="Quinta-feira"
                        className="padding-top-check"
                    />
                    <br />
                    {this.state.boolthursday === true &&
                        <div>
                            <TimeRangeSlider
                                disabled={!this.state.boolthursday}
                                format={24}
                                maxValue={"23:59"}
                                minValue={"00:00"}
                                name={"timethursday"}
                                onChange={this.handleChangeThursday}
                                step={15}
                                value={this.state.timethursday}
                            />

                            <div className="sub-time">
                                <span>De: {this.state.timethursday.start}</span>
                                <span>Até: {this.state.timethursday.end}</span>
                            </div>
                        </div>
                    }

                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.boolfriday}
                            onChange={this.handleChangeBoolean}
                            value={this.state.boolfriday}
                            name="boolfriday"
                            color="primary"
                        />
                        }
                        label="Sexta-feira"
                        className="padding-top-check"
                    />
                    <br />
                    {this.state.boolfriday === true &&
                        <div>
                            <TimeRangeSlider
                                disabled={!this.state.boolfriday}
                                format={24}
                                maxValue={"23:59"}
                                minValue={"00:00"}
                                name={"timeFriday"}
                                onChange={this.handleChangeFriday}
                                step={15}
                                value={this.state.timefriday}
                            />

                            <div className="sub-time">
                                <span>De: {this.state.timefriday.start}</span>
                                <span>Até: {this.state.timefriday.end}</span>
                            </div>
                        </div>
                    }

                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.boolsaturday}
                            onChange={this.handleChangeBoolean}
                            value={this.state.boolsaturday}
                            name="boolsaturday"
                            color="primary"
                        />
                        }
                        label="Sábado"
                        className="padding-top-check"
                    />
                    <br />
                    {this.state.boolsaturday === true &&
                        <div>
                            <TimeRangeSlider
                                disabled={!this.state.boolsaturday}
                                format={24}
                                maxValue={"23:59"}
                                minValue={"00:00"}
                                name={"timesaturday"}
                                onChange={this.handleChangeSaturday}
                                step={15}
                                value={this.state.timesaturday}
                            />

                            <div className="sub-time">
                                <span>De: {this.state.timesaturday.start}</span>
                                <span>Até: {this.state.timesaturday.end}</span>
                            </div>
                        </div>
                    }

                    <br />
                    <Button variant="outlined" className="button-send" type="submit">Salvar</Button>
                </ValidatorForm>
                <Loading on={this.state.load} />
            </div>
        );
    }
}
export default FormSchedule;