import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import CamApi from '../../services/camApi';
import Api from '../../services/api';

import Loading from '../../components/Loading';

import './styles.css';


class AllCams extends Component {

    constructor(props) {
        super(props);
        this.state = {
            image: "",
            camnumber: "",
            SessaoId: "",
            hostport: "",

            listAccounts: [],
            listCams: [],
            accountSelect: "",
            zoneSelected: "",

            load: false,

            message: '',

            some: ''
        };
    }


    render() {
        return <div className="hidden-overflow-all-cams">
            <Grid container spacing={1} className="hidden-overflow-all-cams">
                <Grid item xs={3} className="hidden-overflow-all-cams">
                    <div className="rol-class-title">
                        Lista de câmeras
                    </div>
                    <div className="rol-class-2-3-all-cams">
                        {this.state.listCams !== undefined &&
                            this.state.listCams.map(cam => <div key={cam.camnumber} onClick={() => (this.changeCam(cam))}>
                                <img alt="Câmera de seleção" className="full-width-all-cams" src={URL.createObjectURL(cam.image)} />
                            </div>)
                        }
                    </div>
                    <div className="rol-class-title">
                        Contas
                    </div>
                    <div className="rol-class-1-3-all-cams">
                        {this.state.listAccounts !== undefined &&
                            this.state.listAccounts.map(account => <div key={account.value}>
                                {
                                    this.state.accountSelect === account.value &&
                                    <Button
                                        fullWidth
                                        className="margin-top"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => this.loadCamsAccount(account.value)}
                                    >
                                        {account.label}
                                    </Button>
                                }
                            </div>
                            )
                        }

                        {this.state.listAccounts !== undefined &&
                            this.state.listAccounts.map(account => <div key={account.value}>
                                {
                                    this.state.accountSelect !== account.value &&
                                    <Button
                                        fullWidth
                                        className="margin-top"
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => this.loadCamsAccount(account.value)}
                                    >
                                        {account.label}
                                    </Button>
                                }
                            </div>
                            )
                        }
                    </div>
                </Grid>
                <Grid item xs={9} className="hidden-overflow-all-cams">
                    <div className="rol-class-title">
                        Câmera selecionada
                    </div>
                    <div className="rol-class-full">
                        <div>
                            {this.state.image !== "" &&
                                <img alt="Imagens de monitoramento" className="full-width-all-cams" src={URL.createObjectURL(this.state.image)} />
                            }
                            {this.state.message !== '' && <h2>{this.state.message}</h2>}
                        </div>
                    </div>

                </Grid>
            </Grid>
            <Loading on={this.state.load} />
        </div>
    }


    loadCamsAccount(idAccount) {
        this.setState({ accountSelect: idAccount });
        localStorage.setItem("accountSelected", idAccount);
        localStorage.setItem("zoneSelected", "0");

        this.updateAccount(idAccount);
    }

    async updateFrame() {
        if (this.state.camnumber !== "") {
            const response = await CamApi.get(this.state.hostport + "/camera.cgi?camera=" + this.state.camnumber + "&resolucao=640x480&qualidade=75&stream=0", { headers: { "SessaoId": this.state.SessaoId } });
            this.setState({
                image: response.data
            });
        } else {
            this.setState({
                image: ""
            });
        }
    }

    updateAccountSession() {
        const accountSession = localStorage.getItem("accountSelected");
        if (accountSession !== null) {
            if (accountSession !== this.state.accountSelect) {
                this.setState({ accountSelect: accountSession });
                this.updateAccount(accountSession);
            }
        }

        const zoneSelected = localStorage.getItem("zoneSelected");
        if (zoneSelected !== null && zoneSelected !== "0" && zoneSelected !== this.state.zoneSelected) {
            const indexCamZone = this.state.listCams.findIndex(sc => sc.idzone === Number(zoneSelected));
            if (indexCamZone !== -1) {
                this.setState({
                    image: this.state.listCams[indexCamZone].image,
                    camnumber: this.state.listCams[indexCamZone].camnumber,
                    SessaoId: this.state.listCams[indexCamZone].SessaoId,
                    hostport: this.state.listCams[indexCamZone].hostport,
                    zoneSelected: zoneSelected
                });
            }
        }
    }

    async componentDidMount() {
        this.setState({ load: true });
        const response = await Api.get("/api/account/get-list");

        this.setState({
            listAccounts: response.data,
            load: false
        });

        this.intervalSyncVideo = setInterval(this.updateFrame.bind(this), 999);
        this.intervalSyncAccount = setInterval(this.updateAccountSession.bind(this), 1500);
    }

    async updateAccount(idAccount) {
        this.setState({ load: true, message: '' });
        const response = await Api.get("/api/account/get-complete?Id=" + idAccount + "&Parameters=9");
        if (response.data.camsdguard === null || response.data.camsdguard.length === 0) {
            this.setState({
                listCams: [],
                image: "",
                camnumber: "",
                SessaoId: "",
                hostport: "",
                message: "Não há câmeras cadastradas para está conta"
            });
        } else {

            let cams = response.data.camsdguard;
            let selectedCams = [];

            for (let index = 0; index < cams.length; index++) {
                if (cams[index].activeuser) {
                    let hostport = cams[index].host + ":" + cams[index].port;
                    if (!hostport.toLowerCase().includes("http")) {
                        hostport = "http://" + hostport;
                    }

                    if (index > 0 && index < cams.length) {
                        if (cams[index].host === cams[index - 1].host &&
                            cams[index].port === cams[index - 1].port &&
                            cams[index].username === cams[index - 1].username &&
                            cams[index].password === cams[index - 1].password) {
                            const responseCam = await CamApi.get(hostport + "/camera.cgi?camera=" + cams[index].camnumber, { headers: { "SessaoId": cams[index - 1].SessaoId } });
                            cams[index].image = responseCam.data;
                            cams[index].SessaoId = responseCam.headers.sessaoid;
                            cams[index].hostport = hostport;
                        } else {
                            const responseCam = await CamApi.get(hostport + "/camera.cgi?camera=" + cams[index].camnumber, { headers: { "Authorization": "Basic " + btoa(cams[index].username + ":" + cams[index].password) } });
                            cams[index].image = responseCam.data;
                            cams[index].SessaoId = responseCam.headers.sessaoid;
                            cams[index].hostport = hostport;
                        }

                    } else {
                        const responseCam = await CamApi.get(hostport + "/camera.cgi?camera=" + cams[index].camnumber, { headers: { "Authorization": "Basic " + btoa(cams[index].username + ":" + cams[index].password) } });
                        cams[index].image = responseCam.data;
                        cams[index].SessaoId = responseCam.headers.sessaoid;
                        cams[index].hostport = hostport;
                    }

                    selectedCams.push(cams[index]);
                }
            }

            if (selectedCams === undefined || selectedCams.length === 0) {
                this.setState({
                    listCams: [],
                    image: "",
                    camnumber: "",
                    SessaoId: "",
                    hostport: "",
                    message: "Não há câmeras ativas para está conta"
                });
            } else {
                const zoneSelected = localStorage.getItem("zoneSelected");
                if (zoneSelected === null || zoneSelected === "0") {
                    this.setState({
                        listCams: selectedCams,
                        image: selectedCams[0].image,
                        camnumber: selectedCams[0].camnumber,
                        SessaoId: selectedCams[0].SessaoId,
                        hostport: selectedCams[0].hostport
                    });
                } else {
                    const indexCamZone = selectedCams.findIndex(sc => sc.idzone === Number(zoneSelected));
                    if (indexCamZone !== -1) {
                        this.setState({
                            listCams: selectedCams,
                            image: selectedCams[indexCamZone].image,
                            camnumber: selectedCams[indexCamZone].camnumber,
                            SessaoId: selectedCams[indexCamZone].SessaoId,
                            hostport: selectedCams[indexCamZone].hostport,
                            zoneSelected: indexCamZone.toString()
                        });
                    } else {
                        this.setState({
                            listCams: selectedCams,
                            image: selectedCams[0].image,
                            camnumber: selectedCams[0].camnumber,
                            SessaoId: selectedCams[0].SessaoId,
                            hostport: selectedCams[0].hostport
                        });
                    }
                }
            }
        }
        this.setState({ load: false });
    }

    changeCam = (cam) => {
        this.setState({
            image: cam.image,
            camnumber: cam.camnumber,
            SessaoId: cam.SessaoId,
            hostport: cam.hostport
        })
    }

    componentWillUnmount() {
        /*
            stop getData() from continuing to run even
            after unmounting this component
        */
        clearInterval(this.intervalSyncVideo);
        clearInterval(this.intervalSyncAccount);
    }


}

export default AllCams;