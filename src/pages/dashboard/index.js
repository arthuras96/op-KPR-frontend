import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import './styles.css';
import { GetIdPerson, HavePermission } from '../../services/auth';
import TaskCard from './taskcard';
import Api from '../../services/api';
import MainTab from './main-tab';
import Loading from '../../components/Loading';
import FormTaskDialog from './dialogTask';

import RecentActorsIcon from '@material-ui/icons/RecentActors';
import WarningIcon from '@material-ui/icons/Warning';
import PhoneIcon from '@material-ui/icons/Phone';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

class Dashboard extends Component {

    state = {
        cardsTaskOpen: [],
        cardsTaskAtWork: [],
        cardsTaskAwait: [],
        listAccounts: [],
        listZones: [],

        load: false,

    };

    constructor(props) {
        super(props);

        this.state = {
            cardsTaskOpen: [],
            cardsTaskAtWork: [],
            cardsTaskAwait: [],
            resolutions: [],
            resolution: '',
            account: {
                idperson: '',
                name: '',
                contact: '',
                cnpj: '',
                telone: '',
                teltwo: '',
                telthree: '',
                email: '',
                duresspassword: '',
                historicpersist: '',
                status: '',
                cep: '',
                address: '',
                number: '',
                reference: '',
                neighborhood: '',
                city: '',
                state: '',
                country: '',
                type: '',

                annotations: []
            },

            idTaskSelected: 0,
            problem: '',
            hour: '',
            clerk: '',
            idClerk: 0,
            btn: '',
            btnFunc: '',
            instructions: '',
            actions: '',
            accountValueSelected: '',
            zoneValueSelected: '',

            selectedAccount: '',
            load: false
        };

        this.openToWork = this.openToWork.bind(this);
        this.viewData = this.viewData.bind(this);
        this.viewDataTK = this.viewDataTK.bind(this);
        this.onChildCreate = this.onChildCreate.bind(this);
        this.updateAccount = this.updateAccount.bind(this);
        this.handleSelectAccount = this.handleSelectAccount.bind(this);
        this.setResolution = this.setResolution.bind(this);

        if (localStorage.getItem("timeRequestTasks") === null)
            localStorage.setItem("timeRequestTasks", "0");
    }

    async openToWork(IdTask) {

        this.setState({
            load: true
        });

        try {
            IdTask = Number(IdTask);
        }
        catch {
            alert("Houve um erro inesperado. Por favor, tente novamente.");
            this.setState({
                load: false
            });
            return;
        }

        const taskOpen = this.state.cardsTaskOpen;
        const indexOpen = taskOpen.findIndex(t => t.idtask === IdTask);

        if (indexOpen === -1) {
            alert("Houve um erro inesperado. Por favor, tente novamente.");
            this.setState({
                load: false
            });
            return;
        }

        const response = await Api.post("/api/task/open-to-work", { id: IdTask });

        if (response.data.statuscode !== 201) {
            this.setState({
                load: false
            });
            alert(response.data.message);
        } else {
            await this.syncTasks();
            this.viewData(IdTask);
        }
    }

    async workToWait(IdTask) {
        this.setState({
            load: true
        });

        try {
            IdTask = Number(IdTask);
        }
        catch {
            alert("Houve um erro inesperado. Por favor, tente novamente.");
            this.setState({
                load: false
            });
            return;
        }

        const taskWork = this.state.cardsTaskAtWork;
        const indexWork = taskWork.findIndex(t => t.idtask === IdTask);

        if (indexWork === -1) {
            alert("Houve um erro inesperado. Por favor, tente novamente.");
            this.setState({
                load: false
            });
            return;
        }

        const response = await Api.post("/api/task/work-to-wait", { id: IdTask });

        if (response.data.statuscode !== 201) {
            this.setState({
                load: false
            });
            alert(response.data.message);
        } else {
            await this.syncTasks();
            this.viewData(IdTask);
        }
    }

    async waitToWork(IdTask) {
        this.setState({
            load: true
        });

        try {
            IdTask = Number(IdTask);
        }
        catch {
            alert("Houve um erro inesperado. Por favor, tente novamente.");
            this.setState({
                load: false
            });
            return;
        }

        const taskWait = this.state.cardsTaskAwait;
        const indexWait = taskWait.findIndex(t => t.idtask === IdTask);

        if (indexWait === -1) {
            alert("Houve um erro inesperado. Por favor, tente novamente.");
            this.setState({
                load: false
            });
            return;
        }

        const response = await Api.post("/api/task/wait-to-work", { id: IdTask });

        if (response.data.statuscode !== 201) {
            this.setState({
                load: false
            });
            alert(response.data.message);
        } else {
            await this.syncTasks();
            this.viewData(IdTask);
        }
    }

    async taskWorkGetToMe(IdTask) {
        this.setState({
            load: true
        });

        try {
            IdTask = Number(IdTask);
        }
        catch {
            alert("Houve um erro inesperado. Por favor, tente novamente.");
            this.setState({
                load: false
            });
            return;
        }

        const taskWork = this.state.cardsTaskAtWork;
        const indexWork = taskWork.findIndex(t => t.idtask === IdTask);

        if (indexWork === -1) {
            alert("Houve um erro inesperado. Por favor, tente novamente.");
            this.setState({
                load: false
            });
            return;
        }

        const response = await Api.post("/api/task/update-user-work", { id: IdTask });

        if (response.data.statuscode !== 201) {
            this.setState({
                load: false
            });
            alert(response.data.message);
        } else {
            await this.syncTasks();
            this.viewData(IdTask);
        }
    }

    async taskWaitGetToMe(IdTask) {
        this.setState({
            load: true
        });

        try {
            IdTask = Number(IdTask);
        }
        catch {
            alert("Houve um erro inesperado. Por favor, tente novamente.");
            this.setState({
                load: false
            });
            return;
        }

        const taskWait = this.state.cardsTaskAwait;
        const indexWait = taskWait.findIndex(t => t.idtask === IdTask);

        if (indexWait === -1) {
            alert("Houve um erro inesperado. Por favor, tente novamente.");
            this.setState({
                load: false
            });
            return;
        }

        const response = await Api.post("/api/task/update-user-wait", { id: IdTask });

        if (response.data.statuscode !== 201) {
            this.setState({
                load: false
            });
            alert(response.data.message);
        } else {
            await this.syncTasks();
            this.viewData(IdTask);
        }
    }

    async closeTask() {
        this.setState({
            load: true
        });

        let IdTask = this.state.idTaskSelected;

        try {
            IdTask = Number(IdTask);
        }
        catch {
            alert("Houve um erro inesperado. Por favor, tente novamente.");
            this.setState({
                load: false
            });
            return;
        }

        if (IdTask === 0) {
            alert("Selecione uma tarefa.");
            this.setState({
                load: false
            });
            return;
        }

        IdTask = IdTask.toString();

        const response = await Api.post("/api/task/work-to-close", { value: IdTask, label: this.state.resolution });

        if (response.data.statuscode !== 201) {
            this.setState({
                load: false
            });
            alert(response.data.message);
        } else {
            this.setState({
                problem: '',
                hour: '',
                clerk: '',
                btn: '',
                instructions: '',
                actions: [],
                idTaskSelected: 0,
                idClerk: 0,
                load: true,
            });
            await this.syncTasks();
            this.viewData(IdTask);
        }
    }

    viewDataTK(IdTask) {
        this.setState({
            load: true
        });

        this.viewData(IdTask);
    }

    viewData(IdTask) {

        const taskOpen = this.state.cardsTaskOpen;
        const taskAtWork = this.state.cardsTaskAtWork;
        const taskAwait = this.state.cardsTaskAwait;

        let idAccount = -1;
        let auxProblem = '';
        let auxHour = '';
        let auxClerk = '';
        let auxBtn = '';
        let auxBtnFunc = '';
        let auxIdTask = 0;
        let auxInstructions = '';
        let auxIdClerk = 0;
        let auxIdZone = 0;

        const indexOpen = taskOpen.findIndex(t => t.idtask === IdTask);
        const indexWork = taskAtWork.findIndex(t => t.idtask === IdTask);
        const indexAwait = taskAwait.findIndex(t => t.idtask === IdTask);

        if (indexOpen !== -1) {
            idAccount = taskOpen[indexOpen].idaccount;
            auxProblem = taskOpen[indexOpen].title;
            auxHour = taskOpen[indexOpen].datetimeopen;
            auxBtn = "Atender";
            auxBtnFunc = "At-" + IdTask;
            auxIdTask = taskOpen[indexOpen].idtask;
            auxInstructions = taskOpen[indexOpen].instructions;
            auxIdZone = taskOpen[indexOpen].idzone;
        }

        if (indexWork !== -1) {
            idAccount = taskAtWork[indexWork].idaccount;
            auxProblem = taskAtWork[indexWork].title;
            auxHour = taskAtWork[indexWork].datetimeopen;
            auxClerk = taskAtWork[indexWork].user;


            if (Number(GetIdPerson()) === taskAtWork[indexWork].iduser) {
                auxBtn = "Em espera";
                auxBtnFunc = "Ee-" + IdTask;
                auxIdClerk = taskAtWork[indexWork].iduser;
            }
            else {
                auxBtn = "Assumir";
                auxBtnFunc = "As-" + IdTask;
            }

            auxIdTask = taskAtWork[indexWork].idtask
            auxInstructions = taskAtWork[indexWork].instructions;
            auxIdZone = taskAtWork[indexWork].idzone;
        }

        if (indexAwait !== -1) {
            idAccount = taskAwait[indexAwait].idaccount;
            auxProblem = taskAwait[indexAwait].title;
            auxHour = taskAwait[indexAwait].datetimeopen;
            auxClerk = taskAwait[indexAwait].user;

            if (Number(GetIdPerson()) === taskAwait[indexAwait].iduser) {
                auxBtn = "Atender";
                auxBtnFunc = "Atw-" + IdTask;
            }
            else {
                auxBtn = "Assumir";
                auxBtnFunc = "Asw-" + IdTask;
            }

            auxIdTask = taskAwait[indexAwait].idtask
            auxInstructions = taskAwait[indexAwait].instructions;
            auxIdZone = taskAwait[indexAwait].idzone;
        }

        if (idAccount !== -1) {
            this.updateAccount(idAccount);

            this.setState({
                problem: auxProblem,
                hour: auxHour,
                clerk: auxClerk,
                btn: auxBtn,
                btnFunc: auxBtnFunc,
                idTaskSelected: auxIdTask,
                instructions: auxInstructions,
                idClerk: auxIdClerk,
                zoneValueSelected: auxIdZone
            });

            localStorage.setItem("accountSelected", idAccount);
            localStorage.setItem("zoneSelected", auxIdZone);
        }
    };

    onChildCreate() {
        this.syncTasks();
    }

    handleSelectAccount(event) {
        this.setState({
            problem: '',
            hour: '',
            clerk: '',
            btn: '',
            instructions: '',
            actions: [],
            idTaskSelected: 0,
            idClerk: 0,
            load: true,
        });
        this.updateAccount(event.target.value);
    }

    handleSelectZone = (event) => {
        this.setState({
            zoneValueSelected: event.target.value
        });

        localStorage.setItem("zoneSelected", event.target.value);
    }

    async updateAccount(value) {
        const response = await Api.get("/api/account/get-complete?Id=" + value + "&Parameters=0");
        this.setState({
            account: response.data,
            listZones: response.data.zones,
            accountValueSelected: value,
            load: false
        });

        localStorage.setItem("accountSelected", value);
        // localStorage.setItem("zoneSelected", "0");
    }

    btnAction(instructions) {
        const command = instructions.split("-")[0].trim();
        const idTask = instructions.split("-")[1].trim();

        if (command === "At")
            this.openToWork(idTask);
        else if (command === "Ee")
            this.workToWait(idTask);
        else if (command === "As" && HavePermission(25))
            this.taskWorkGetToMe(idTask);
        else if (command === "Atw")
            this.waitToWork(idTask);
        else if (command === "Asw" && HavePermission(25))
            this.taskWaitGetToMe(idTask);
    }

    setResolution(auxResolution) {
        this.setState({
            resolution: auxResolution
        })
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({ [name]: value });

        // console.log(this.state.idClerk);
        // console.log(GetIdPerson());
    }

    render() {
        return <div className="hidden-overflow">
            <Grid container spacing={1} className="hidden-overflow">
                <Grid item xs={2} className="hidden-overflow">
                    <div className="rol-class-title">
                        Aberto
                        {this.state.listAccounts !== undefined &&
                            <FormTaskDialog
                                account={this.state.account}
                                accountList={this.state.listAccounts}
                                callbackParentCreate={() => this.onChildCreate()}
                            />
                        }
                    </div>
                    <div className="rol-class-full">
                        {this.state.cardsTaskOpen !== undefined &&
                            this.state.cardsTaskOpen.map(card =>
                                <TaskCard
                                    callbackParentTask={(string) => this.openToWork(string)}
                                    callbackParentView={(string) => this.viewDataTK(string)}
                                    key={card.idtask}
                                    idTask={card.idtask}
                                    title={card.title}
                                    user=""
                                    nameAccount={card.nameaccount}
                                    status="Atender"
                                    idPriority={card.idpriority}
                                    idAccount={card.idaccount}
                                    idZone={card.idzone}
                                    acumulate={card.acumulate}
                                    dateTimeOpen={card.datetimeopen}
                                />
                            )
                        }
                    </div>
                </Grid>

                <Grid item xs={2}>
                    <div className="rol-class-title">
                        Atendimento
                    </div>
                    <div className="rol-class-half">
                        {this.state.cardsTaskAtWork !== undefined &&
                            this.state.cardsTaskAtWork.map(card =>
                                <TaskCard
                                    callbackParentTask={(string) => this.openToWork(string)}
                                    callbackParentView={(string) => this.viewDataTK(string)}
                                    key={card.idtask}
                                    idTask={card.idtask}
                                    title={card.title}
                                    user={card.user}
                                    nameAccount={card.nameaccount}
                                    status=""
                                    idPriority={card.idpriority}
                                    idAccount={card.idaccount}
                                    idZone={card.idzone}
                                    acumulate={card.acumulate}
                                    dateTimeOpen={card.datetimeopen}
                                />
                            )
                        }
                    </div>
                    <div className="rol-class-title divider-top">
                        Espera
                    </div>
                    <div className="rol-class-half">
                        {this.state.cardsTaskAwait !== undefined &&
                            this.state.cardsTaskAwait.map(card =>
                                <TaskCard
                                    callbackParentTask={(string) => this.openToWork(string)}
                                    callbackParentView={(string) => this.viewDataTK(string)}
                                    key={card.idtask}
                                    idTask={card.idtask}
                                    title={card.title}
                                    user={card.user}
                                    nameAccount={card.nameaccount}
                                    status=""
                                    idPriority={card.idpriority}
                                    idAccount={card.idaccount}
                                    idZone={card.idzone}
                                    acumulate={card.acumulate}
                                    dateTimeOpen={card.datetimeopen}
                                />
                            )
                        }
                    </div>
                </Grid>

                <Grid item xs={6}>
                    <div className="rol-class-title">
                        Informações
                    </div>
                    <div className="rol-class-1-3">
                        <div className="information-div negative-top">
                            <FormControl>
                                <InputLabel>Conta</InputLabel>
                                <Select
                                    className="autocomplete-normalize"
                                    value={this.state.accountValueSelected}
                                    onChange={this.handleSelectAccount}
                                    autoWidth
                                >
                                    {this.state.listAccounts !== undefined &&
                                        this.state.listAccounts.map(account =>
                                            <MenuItem key={account.value} value={account.value}>{account.label}</MenuItem>
                                        )
                                    }
                                </Select>
                            </FormControl>

                            <FormControl>
                                <InputLabel>Zona</InputLabel>
                                <Select
                                    className="autocomplete-normalize"
                                    value={this.state.zoneValueSelected}
                                    onChange={this.handleSelectZone}
                                    autoWidth
                                >
                                    {this.state.listZones !== undefined && this.state.listZones !== null &&
                                        <MenuItem value={0}>Todas</MenuItem>
                                    }
                                    {this.state.listZones !== undefined && this.state.listZones !== null &&
                                        this.state.listZones.map(zone =>
                                            <MenuItem key={zone.idzone} value={zone.idzone}>{zone.zone}</MenuItem>
                                        )
                                    }
                                </Select>
                            </FormControl>

                            <p>__:__:__</p>
                        </div>
                        {this.state.account.idperson !== '' &&
                            <div className="information-detail-div">
                                <Grid container spacing={1}>
                                    <Grid container item xs={3}>
                                        <div className="break"><RecentActorsIcon className="icon-detail-div" /> {this.state.account.contact}</div>
                                        <div className="break"><WarningIcon className="icon-detail-div" /> {this.state.problem}</div>
                                    </Grid>
                                    <Grid container item xs={3}>
                                        <div className="break"><PhoneIcon className="icon-detail-div" /> {this.state.account.telone}</div>
                                        <div className="break"><PhoneIcon className="icon-detail-div" /> {this.state.account.teltwo}</div>
                                    </Grid>
                                    <Grid container item xs={3} >
                                        <div className="break"><QueryBuilderIcon className="icon-detail-div" /> {this.state.hour}</div>
                                        <div className="break"><VpnKeyIcon className="icon-detail-div" /> {this.state.account.duresspassword}</div>
                                    </Grid>
                                    <Grid container item xs={3}>
                                        <div className="break"><AccountBoxIcon className="icon-detail-div" /> {this.state.clerk}</div>
                                        {this.state.btn !== '' &&
                                            <div className="break">
                                                <Button variant="outlined" size="small" color="default" onClick={() => this.btnAction(this.state.btnFunc)}>{this.state.btn}</Button>
                                            </div>
                                        }
                                    </Grid>
                                </Grid>
                            </div>
                        }
                    </div>

                    <div className="rol-class-2-3">

                        {this.state.account.idperson !== '' &&
                            <MainTab key={this.state.account.idperson} account={this.state.account} zone={this.state.zoneValueSelected} />
                        }

                    </div>

                </Grid>

                <Grid item xs={2}>
                    <div className="rol-class-title">
                        Instruções
                    </div>
                    <div className="rol-class-trio" dangerouslySetInnerHTML={{ __html: this.state.instructions }}>

                    </div>

                    <div className="rol-class-title divider-top">
                        Ações
                    </div>
                    <div className="rol-class-trio">
                        Content Ações
                    </div>

                    <div className="rol-class-title divider-top">
                        Resoluções
                    </div>
                    <div className="rol-class-trio">
                        <TextField
                            fullWidth
                            multiline
                            value={this.state.resolution}
                            rows="3"
                            id="filled-secondary"
                            placeholder="Por favor, selecione uma ocorrência"
                            color="secondary"
                            size="small"
                            onChange={this.handleChange}
                            name="resolution"
                        />

                        <br />
                        {this.state.resolutions.map(resolution =>
                            <Button
                                key={resolution.idtaskresolution}
                                className="mini-btn"
                                variant="contained"
                                size="small"
                                color="secondary"
                                onClick={() => this.setResolution(resolution.taskresolution)}
                            >
                                {resolution.sequence}
                            </Button>
                        )}

                        <br />

                        {this.state.resolution.length > 5 && this.state.idClerk === Number(GetIdPerson()) &&
                            <Button
                                onClick={() => this.closeTask()}
                                className="finish-btn"
                                variant="contained"
                                size="small"
                                color="secondary"
                            >
                                Finalizar
	                        </Button>
                        }
                    </div>
                </Grid>

            </Grid>
            <Loading on={this.state.load} />
        </div >
    }

    async componentDidMount() {

        this.setState({
            load: true
        });

        const response = await Api.get("/api/account/get-list");

        this.syncTasks();

        const responseResolutions = await Api.get("/api/task/get-resolution")

        this.setState({
            listAccounts: response.data,
            resolutions: responseResolutions.data,
            load: false
        });

        this.intervalID = setInterval(this.getData.bind(this), 2500);
        // this.getData();
    }

    getData = async () => {
        const timeRequestTasks = localStorage.getItem("timeRequestTasks")
        const response = await Api.get("/api/task/get-static?Time=" + timeRequestTasks);

        if (response.data !== "") {
            let auxTasksOpen = [];
            let auxTasksWork = [];
            let auxTasksWait = [];

            if (response.data.opentasks !== undefined)
                auxTasksOpen = response.data.opentasks;

            if (response.data.worktasks !== undefined)
                auxTasksWork = response.data.worktasks;

            if (response.data.waittasks !== undefined)
                auxTasksWait = response.data.waittasks;

            this.setState({
                cardsTaskOpen: auxTasksOpen,
                cardsTaskAtWork: auxTasksWork,
                cardsTaskAwait: auxTasksWait,
            });
            localStorage.setItem("timeRequestTasks", response.data.timerequest);
            if (this.state.idtaskselected !== 0)
                this.viewData(this.state.idtaskselected);
        }
    }

    componentWillUnmount() {
        /*
            stop getData() from continuing to run even
            after unmounting this component
        */
        clearInterval(this.intervalID);
    }

    async syncTasks() {
        this.setState({
            load: true
        });

        const response = await Api.get("/api/task/get");

        this.setState({
            cardsTaskOpen: response.data.opentasks,
            cardsTaskAtWork: response.data.worktasks,
            cardsTaskAwait: response.data.waittasks
        });

        this.setState({
            load: false
        });
    }
}

export default Dashboard;