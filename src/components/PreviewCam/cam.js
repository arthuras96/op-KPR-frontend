import React from 'react';
import Loading from '../Loading';
import CamApi from '../../services/camApi';

class Cam extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            load: false,
            hostport: "",
            userpass: "",
            camnumber: "",
            SessaoId: "",

            image: ""
        }
    }

    async componentDidMount() {
        this.setState({ load: true });

        let hostport = this.props.data.host + ":" + this.props.data.port;
        const userpass = btoa(this.props.data.username + ":" + this.props.data.password);

        if (!hostport.toLowerCase().includes("http")) {
            hostport = "http://" + hostport;
        }

        const response = await CamApi.get(hostport + "/servidor.cgi", { headers: { "Authorization": "Basic " + userpass } });

        this.setState({
            load: false,
            hostport: hostport,
            userpass: userpass,
            camnumber: this.props.data.camnumber,
            SessaoId: response.headers.sessaoid
        });
        this.intervalID = setInterval(this.updateFrame.bind(this), 999);
    }

    componentWillUnmount() {
        /*
            stop getData() from continuing to run even
            after unmounting this component
        */
        clearInterval(this.intervalID);
    }

    async updateFrame() {
        const response = await CamApi.get(this.state.hostport + "/camera.cgi?camera=" + this.state.camnumber + "&resolucao=320x240&qualidade=70&stream=0", { headers: { "SessaoId": this.state.SessaoId } });
        this.setState({
            image: response.data
        });
    }



    render() {
        return (
            <div>
                {this.state.image !== "" &&
                    <img alt="Imagens de monitoramento" className="full-width" src={URL.createObjectURL(this.state.image)} />
                }
                <Loading on={this.state.load} />
            </div>
        );
    }
}
export default Cam;