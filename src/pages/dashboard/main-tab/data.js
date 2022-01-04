import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Api from '../../../services/api';
import Loading from '../../../components/Loading';
import { GetUsername } from '../../../services/auth';

import '../styles.css';

class Data extends Component {

    constructor(props) {
        super(props);
        this.state = {
            valueTab: 0,
            annotationHandle: '',
            IdAccount: props.account.idperson,
            annotations: props.account.annotations,
            account: props.account,
            load: false
        };
    }

    handleChangeTab = (event, newValue) => {
        this.setState({
            valueTab: newValue
        });
    };

    handleChangeAnnotation = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value });
    }

    a11yProps(index) {
        return {
            id: `scrollable-prevent-tab-${index}`,
            'aria-controls': `scrollable-prevent-tabpanel-${index}`,
        };
    };

    addAnnotation = async () => {
        this.setState({
            load: true
        });

        if (this.state.annotationHandle.length > 0) {

            const Affected = this.state.IdAccount.toString();
            const Annotation = this.state.annotationHandle;

            const response = await Api.put("/api/account/add-annotation", { Affected, Annotation });
            alert(response.data.message);

            const newDate = new Date()
            const date = newDate.getDate();
            const month = newDate.getMonth() + 1;
            const year = newDate.getFullYear();
            const hour = newDate.getHours();
            const minute = newDate.getMinutes();
            const second = newDate.getSeconds();
            const user = GetUsername();

            let auxAnnotationAdd = this.state.annotations;

            if (auxAnnotationAdd !== null && auxAnnotationAdd !== undefined) {
                auxAnnotationAdd.unshift({
                    affected: this.state.IdAccount,
                    annotation: this.state.annotationHandle,
                    dateTime: date + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second,
                    executant: user
                });
                this.setState({
                    annotations: auxAnnotationAdd,
                    annotationHandle: ''
                })
            } else {
                let auxAnnotationCreate = [{
                    affected: this.state.IdAccount,
                    annotation: this.state.annotationHandle,
                    dateTime: date + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second,
                    executant: user
                }];
                this.setState({
                    annotations: auxAnnotationCreate,
                    annotationHandle: ''
                })
            }
        }
        else {
            alert("Preencha a anotação");
        }

        this.setState({
            load: false
        });
    }

    render() {
        return <div className="main-tab">
            <AppBar position="static">
                <Tabs
                    value={this.state.valueTab}
                    onChange={this.handleChangeTab}
                    variant="scrollable"
                    scrollButtons="off"
                    aria-label="scrollable prevent tabs example"
                >
                    <Tab className="tab-item-2" label="Dados da empresa" value={0} {...this.a11yProps(0)} />
                    <Tab className="tab-item-2" label="Anotações" value={1} {...this.a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={this.state.valueTab} index={0}>
                <Grid container spacing={0}>

                    <Grid container item xs={4}>
                        <TextField
                            label="Nome"
                            defaultValue={this.state.account.name}
                            className="data-input divider-top space-separator"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    <Grid container item xs={4}>
                        <TextField
                            label="CNPJ"
                            defaultValue={this.state.account.cnpj}
                            className="data-input divider-top space-separator"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    <Grid container item xs={4}>
                        <TextField
                            label="E-mail"
                            defaultValue={this.state.account.email}
                            className="data-input divider-top space-separator"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    <Grid container item xs={2}>
                        <TextField
                            label="Tipo"
                            defaultValue={this.state.account.typeperson}
                            className="data-input divider-top space-separator"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    <Grid container item xs={3}>
                        <TextField
                            label="CEP"
                            defaultValue={this.state.account.cep}
                            className="data-input divider-top space-separator"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    <Grid container item xs={5}>
                        <TextField
                            label="Endereço"
                            defaultValue={this.state.account.address}
                            className="data-input divider-top space-separator"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    <Grid container item xs={2}>
                        <TextField
                            label="Número"
                            defaultValue={this.state.account.number}
                            className="data-input divider-top space-separator"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    <Grid container item xs={3}>
                        <TextField
                            label="País"
                            defaultValue={this.state.account.country}
                            className="data-input divider-top space-separator"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    <Grid container item xs={3}>
                        <TextField
                            label="Estado"
                            defaultValue={this.state.account.state}
                            className="data-input divider-top space-separator"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    <Grid container item xs={3}>
                        <TextField
                            label="Cidade"
                            defaultValue={this.state.account.city}
                            className="data-input divider-top space-separator"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                    <Grid container item xs={3}>
                        <TextField
                            label="Bairro"
                            defaultValue={this.state.account.neighborhood}
                            className="data-input divider-top space-separator"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>

                </Grid>
            </TabPanel>
            <TabPanel value={this.state.valueTab} index={1}>
                <TextField
                    label="Anotação"
                    className="data-input"
                    multiline
                    rows="4"
                    name="annotationHandle"
                    value={this.state.annotationHandle}
                    onChange={this.handleChangeAnnotation}
                />

                <Button variant="contained" color="primary" className="btn-anno-pad" onClick={() => { this.addAnnotation(); }}>
                    Adicionar
                </Button>


                {this.state.annotations !== null &&
                    this.state.annotations.map(annotations =>
                        <div className="annotations" key={annotations.dateTime}>
                            <b>{annotations.dateTime} - Anotação feita por {annotations.executant}</b><br />
                            {annotations.annotation}
                        </div>
                    )
                }

            </TabPanel>

            <Loading on={this.state.load} />

        </div>
    }

    // componentDidMount() {
    //     this.
    // }
}

export default Data;

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-prevent-tabpanel-${index}`}
            aria-labelledby={`scrollable-prevent-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};