import React, { Component } from 'react';
import CamApi from '../../services/camApi';


class Cameras extends Component {

    constructor(props) {
        super(props);
        this.state = {
            image: "",
            camnumber: "",
            SessaoId: "",
            hostport: ""
        };
    }

    render() {
        return <div>
            {this.state.image !== "" &&
                <img alt="Imagens de monitoramento" className="full-width" src={URL.createObjectURL(this.state.image)} />
            }
        </div>
    }

    async updateFrame() {
        if (this.state.camnumber !== "") {
            const response = await CamApi.get(this.state.hostport + "/camera.cgi?camera=" + this.state.camnumber, { headers: { "SessaoId": this.state.SessaoId } });
            this.setState({
                image: response.data
            });
        }
    }

    async componentDidMount() {
        const { camnumber, sessionid, http, baseauth } = this.props.match.params
        if (camnumber !== "" && camnumber !== undefined &&
            sessionid !== "" && sessionid !== undefined &&
            http !== "" && http !== undefined) {
            try {
                const response = await CamApi.get("http://" + http + "/camera.cgi?camera=" + camnumber, { headers: { "SessaoId": sessionid } });
                if (response.status === 200) {
                    this.setState({
                        SessaoId: sessionid,
                        hostport: "http://" + http,
                        image: response.data,
                        camnumber: camnumber,
                    });
                    this.intervalID = setInterval(this.updateFrame.bind(this), 999);
                } else {
                    this.getKeyStart(baseauth, http, camnumber);
                }
            }
            catch (e) {
                this.getKeyStart(baseauth, http, camnumber);
            }

        }
    }

    async getKeyStart(baseauth, http, camnumber) {
        let keyCript = "Yehl_@/Bu5sS@OtA)NJRVKwB6lS-G]DF8LFAUj9-_obR#},r(Fy5tY!yyoeJ{";
        let encryptAuth = atob(baseauth).split`,`.map(x => +x);

        encryptAuth.forEach(function (value, i) {
            if (i < keyCript.length) {
                encryptAuth[i] = encryptAuth[i] - keyCript.charCodeAt(i);
            }
        });

        const responseSession = await CamApi.get("http://" + http + "/servidor.cgi", { headers: { "Authorization": "Basic " + this.Utf8ArrayToStr(encryptAuth) } });

        this.setState({
            SessaoId: responseSession.headers.sessaoid,
            hostport: "http://" + http,
            camnumber: camnumber,
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

    Utf8ArrayToStr(array) {
        var out, i, len, c;
        var char2, char3;

        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12: case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }

        return out;
    }
}

export default Cameras;