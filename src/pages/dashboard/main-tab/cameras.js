import React, { Component } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Loading from '../../../components/Loading';

import CamApi from "../../../services/camApi";

import "../styles.css";

class Cameras extends Component {

    constructor(props) {
        super(props);
        this.state = {
            camsdguard: [],

            hostport: "",
            userpass: "",
            camnumber: "",
            SessaoId: "",

            image: "",

            load: false
        };
    }

    handleChangeVideo = async event => {
        this.setState({ load: true });

        const indexCam = this.state.camsdguard.findIndex(c => c.idcamdguard === event.target.value)

        let hostport = this.state.camsdguard[indexCam].host + ":" + this.state.camsdguard[indexCam].port;
        const userpass = btoa(this.state.camsdguard[indexCam].username + ":" + this.state.camsdguard[indexCam].password);

        if (!hostport.toLowerCase().includes("http")) {
            hostport = "http://" + hostport;
        }

        const response = await CamApi.get(hostport + "/servidor.cgi", { headers: { "Authorization": "Basic " + userpass } });

        this.setState({
            load: false,
            hostport: hostport,
            userpass: userpass,
            camnumber: this.state.camsdguard[indexCam].camnumber,
            SessaoId: response.headers.sessaoid
        });

        this.setState({ load: false });
    }

    async componentDidMount() {
        this.setState({ load: true })
        // const response = await CamApi.get("/servidor.cgi", { headers: { "Authorization": "Basic " } });
        // this.setState({ SessaoId: response.headers.sessaoid });

        this.setState({
            camsdguard: this.props.account.camsdguard
        })

        this.setState({
            // cameras: [
            //     { value: "1", label: "Cam1", url: "/camera.cgi?camera=000100&resolucao=320x240&qualidade=70&stream=0" },
            //     // { value: "1", label: "Cam1", url: "/mjpegstream.cgi?camera=000100" },
            // ],
            load: false
        });

        this.intervalID = setInterval(this.updateFrame.bind(this), 999);
    }

    async updateFrame() {
        if (this.state.camnumber !== "") {
            const response = await CamApi.get(this.state.hostport + "/camera.cgi?camera=" + this.state.camnumber + "&resolucao=320x240&qualidade=70&stream=0", { headers: { "SessaoId": this.state.SessaoId } });
            this.setState({
                image: response.data
            });
        }
    }

    componentWillUnmount() {
        /*
            stop getData() from continuing to run even
            after unmounting this component
        */
        clearInterval(this.intervalID);
    }

    render() {
        return <div>
            {this.state.camsdguard !== null && this.state.camsdguard !== undefined && this.state.camsdguard.length > 0 &&
                <div>
                    <FormControl>
                        <InputLabel>Nome da câmera</InputLabel>
                        <Select
                            className="select-normalize"
                            onChange={this.handleChangeVideo}
                        >
                            {
                                // eslint-disable-next-line
                                this.state.camsdguard.map(cam => {
                                    if (cam.idzone === this.props.zone || this.props.zone === 0 || this.props.zone === "") {
                                        return <MenuItem key={cam.idcamdguard} value={cam.idcamdguard}>{cam.camname}</MenuItem>
                                    }
                                })
                            }
                        </Select>
                    </FormControl>
                    <br />
                    <Grid container spacing={1} className="hidden-overflow">
                        <Grid item xs={6} id="iframe">
                            {this.state.image !== "" &&
                                <img alt="Imagens de monitoramento" className="full-width" src={URL.createObjectURL(this.state.image)} />
                            }
                        </Grid>
                        <Grid item xs={6}></Grid>
                    </Grid>
                    <Loading on={this.state.load} />
                </div>
            }
        </div>
    }
}

export default Cameras;
