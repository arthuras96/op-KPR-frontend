import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import './styles.css';
import Api from "../../services/api";
import { SaveKeys, HavePermission, Logout, IsAuthenticated, IsAdmin } from "../../services/auth";
import Loading from '../../components/Loading';

class Login extends Component {

    state = {
        USERNAME: "",
        PASSWORD: "",
        error: "",
        load: false
    };

    handleSignIn = async e => {
        this.setState({ load: true });
        e.preventDefault();
        const { USERNAME, PASSWORD } = this.state;
        if (!USERNAME || !PASSWORD) {
            this.setState({ error: "Preencha usuário e senha para continuar!" });
            this.setState({ load: false });
        } else {
            try {
                const response = await Api.post("/api/users/authenticate", { USERNAME, PASSWORD });
                SaveKeys(response.data);
                this.setState({ load: false });

                if (response.data.role === "root" || response.data.role === "admin") {
                    this.props.history.push("/configurations");
                } else if (HavePermission(24)) {
                    this.props.history.push("/dashboard");
                } else if (HavePermission(4)) {
                    this.props.history.push("/reports");
                } else if (HavePermission(1)) {
                    this.props.history.push("/audits");
                } else if (HavePermission(8)) {
                    this.props.history.push("/accounts");
                } else if (HavePermission(26) || HavePermission(27) || HavePermission(28) || HavePermission(29)) {
                    this.props.history.push("/configurations");
                } else {
                    alert("Seu usuário não possui permissões para acessar o sistema. Se acha que isto é um erro, contate o administrador.");
                    Logout();
                }

                window.location.reload();

                // console.log(HavePermission(19));
                // console.log(HavePermission(1));

            } catch (err) {
                this.setState({
                    error:
                        "Houve um problema com o login, verifique suas credenciais.",
                    load: false
                });
            }
        }
    };

    componentDidMount() {
        if (IsAuthenticated()) {
            if (IsAdmin()) {
                this.props.history.push("/configurations");
            } else if (HavePermission(24)) {
                this.props.history.push("/dashboard");
            } else if (HavePermission(4)) {
                this.props.history.push("/reports");
            } else if (HavePermission(1)) {
                this.props.history.push("/audits");
            } else if (HavePermission(8)) {
                this.props.history.push("/accounts");
            } else if (HavePermission(26) || HavePermission(27) || HavePermission(28) || HavePermission(29)) {
                this.props.history.push("/configurations");
            } else {
                alert("Seu usuário não possui permissões para acessar o sistema. Se acha que isto é um erro, contate o administrador.");
                Logout();
            }

            window.location.reload();
        }
    }

    render() {
        return <div className="login-menu">
            <Avatar>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                KPR Lobby | Entrar
            </Typography>
            <form noValidate className="form-login" onSubmit={this.handleSignIn}>
                {this.state.error && <p className="error-informer">{this.state.error}</p>}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="USER"
                    label="Usuário"
                    name="USER"
                    autoComplete="USER"
                    autoFocus
                    onChange={e => this.setState({ USERNAME: e.target.value })}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="PASSWORD"
                    label="Senha"
                    type="PASSWORD"
                    id="PASSWORD"
                    autoComplete="current-password"
                    onChange={e => this.setState({ PASSWORD: e.target.value })}
                />
                <div>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="btn-login"
                    >
                        Entrar
                    </Button>

                </div>
                <br />
                {this.state.error && <Link to="/dashboard">Esqueceu sua senha?</Link>}
            </form>
            <Box mt={8}>
                <Copyright />
            </Box>

            <Loading on={this.state.load} />

        </div>
    }
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <a href="https://github.com/arthuras96">
                Arthur Alencar
        </a>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Login;