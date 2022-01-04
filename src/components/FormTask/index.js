import React from 'react';

import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import './styles.css';
import Api from "../../services/api";
import Loading from '../../components/Loading';


class FormTask extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            idaccount: '',
            idevent: '',
            idzone: '',
            idpriority: '',
            description: '',
            eventList: [],
            zoneList: [],
            priorityList: [
                { value: 1, label: "Baixa" },
                { value: 2, label: "Média" },
                { value: 3, label: "Alta" },
                { value: 4, label: "Critica" },
            ],
            zoneEvent: '',
            priorityEvent: '',
            load: false
        }
    }

    componentDidMount() {
        if (this.props.account.idperson !== '' && this.props.account.idperson !== undefined) {

            let auxEvents = [];
            if (this.props.account.events !== undefined && this.props.account.events !== null)
                this.props.account.events.map(
                    // eslint-disable-next-line
                    event => {
                        if (event.active)
                            auxEvents.push({ label: event.name, value: event.idevent, zone: event.idzone, priority: event.idpriority })
                    }
                );

            let auxZones = [];

            if (this.props.account.zones !== undefined && this.props.account.zones !== null)
                this.props.account.zones.map(
                    // eslint-disable-next-line
                    zone => {
                        if (zone.active)
                            auxZones.push({ label: zone.zone, value: zone.idzone })
                    }
                );

            this.setState({
                idaccount: this.props.account.idperson,
                eventList: auxEvents,
                zoneList: auxZones
            });
        }
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        if (name === 'idaccount')
            this.loadEventZone(value);

        if (name === 'idevent')
            this.handleChangeEvent(value);

        this.setState({ [name]: value });
    }

    handleChangeEvent(idEvent) {
        const auxEvent = this.state.eventList;
        const index = auxEvent.findIndex(e => e.value === idEvent);

        if (index > -1)
            this.setState({
                idzone: auxEvent[index].zone,
                idpriority: auxEvent[index].priority
            });
    }

    async loadEventZone(idAccount) {
        this.setState({
            load: true
        })

        let response = await Api.get("/api/account/get-complete?Id=" + idAccount + "&Parameters=3,4");

        let auxEvents = [];
        if (response.data.events !== undefined && response.data.events !== null)
            response.data.events.map(
                // eslint-disable-next-line
                event => {
                    if (event.active)
                        auxEvents.push({ label: event.name, value: event.idevent, zone: event.idzone, priority: event.idpriority })
                }
            );

        let auxZones = [];
        if (response.data.zones !== undefined && response.data.zones !== null)
            response.data.zones.map(
                // eslint-disable-next-line
                zone => {
                    if (zone.active)
                        auxZones.push({ label: zone.zone, value: zone.idzone })
                }
            );

        this.setState({
            load: false,
            eventList: auxEvents,
            zoneList: auxZones
        })
    }

    handleSubmit = async event => {
        event.preventDefault();
        const auxIdAccount = Number(this.state.idaccount);
        this.setState({ load: true, idaccount: auxIdAccount });
        const { idaccount, idevent, idzone, idpriority, description } = this.state;
        // const auxActive = active.toString();
        // const auxIsRestricted = isRestricted.toString();

        const response = await Api.put("/api/task/add", {
            idaccount, idevent, idzone, idpriority, description
        });
        alert(response.data.message);
        // console.log(response.data);
        if (response.data.statuscode === 201) {
            this.props.callbackParentCreate();
            this.props.closeDialog();
        }
        this.setState({ load: false });
        // window.location.reload();
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
                        label="Conta"
                        onChange={this.handleChange}
                        name="idaccount"
                        value={this.state.idaccount}
                        validators={['required']}
                        errorMessages={['A conta é requerida.']}
                        className="select-normalize-form-task"
                    >
                        {this.props.accountList.map(
                            account => (<MenuItem key={account.value} value={account.value}>{account.label}</MenuItem>)
                        )}
                    </SelectValidator>

                    <br />

                    <SelectValidator
                        fullWidth
                        label="Evento"
                        onChange={this.handleChange}
                        name="idevent"
                        value={this.state.idevent}
                        validators={['required']}
                        errorMessages={['O evento é requerido.']}
                        className="select-normalize-form-task"
                    >
                        {this.state.eventList.map(event =>
                            <MenuItem key={event.value} value={event.value}>{event.label}</MenuItem>
                        )}
                    </SelectValidator>

                    <br />

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
                        {this.state.zoneList.map(zone =>
                            <MenuItem key={zone.value} value={zone.value}>{zone.label}</MenuItem>
                        )}
                    </SelectValidator>

                    <br />

                    <SelectValidator
                        fullWidth
                        label="Prioridade"
                        onChange={this.handleChange}
                        name="idpriority"
                        value={this.state.idpriority}
                        validators={['required']}
                        errorMessages={['A prioridade é requerida.']}
                        className="select-normalize-form-task"
                    >
                        {this.state.priorityList.map(priority =>
                            <MenuItem key={priority.value} value={priority.value}>{priority.label}</MenuItem>
                        )}
                    </SelectValidator>

                    <br />

                    <TextValidator
                        fullWidth
                        multiline
                        rows="3"
                        label="Descrição"
                        name="description"
                        value={this.state.description}
                        onChange={this.handleChange}
                        className="select-normalize-form-task"
                    />

                    <br />
                    <Button variant="outlined" className="button-send" type="submit">Criar</Button>
                </ValidatorForm>
                <Loading on={this.state.load} />
            </div>
        );
    }
}
export default FormTask;