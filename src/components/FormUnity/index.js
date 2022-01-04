import React from 'react';

import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import './styles.css';
import Api from "../../services/api";
import Loading from '../../components/Loading';


class FormUnity extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            idunity: 0,
            idaccount: '',
            idtypeunity: '',
            unityname: '',
            idunitystate: '',

            // Preloads
            typeunitys: [],
            unitystates: [],

            load: false
        }
    }

    async componentDidMount() {
        // console.log(this.props.account.idperson);
        if (this.props.account.idperson !== '' && this.props.account.idperson !== undefined) {

            this.setState({
                idaccount: Number(this.props.account.idperson),
                load: true
            })

            const responseTypeUnitys = await Api.get("/api/account/get-type-unity");
            let auxTypeUnitys = [];
            if (responseTypeUnitys.data !== undefined && responseTypeUnitys.data !== null)
                responseTypeUnitys.data.map(
                    // eslint-disable-next-line
                    typeUnity => {
                        auxTypeUnitys.push({ label: typeUnity.label, value: typeUnity.value })
                    }
                );

            const responseUnityStates = await Api.get("/api/account/get-unity-state");
            let auxUnityStates = [];
            if (responseUnityStates.data !== undefined && responseUnityStates.data !== null)
                responseUnityStates.data.map(
                    // eslint-disable-next-line
                    unityStates => {
                        auxUnityStates.push({ label: unityStates.label, value: unityStates.value })
                    }
                );

            this.setState({
                load: false,
                typeunitys: auxTypeUnitys,
                unitystates: auxUnityStates
            });

            if (this.props.data !== null && this.props.data !== undefined) {
                this.setState({
                    idunity: this.props.data.idunity,
                    idtypeunity: this.props.data.idtypeunity,
                    unityname: this.props.data.unityname,
                    idunitystate: this.props.data.idunitystate
                });
            }
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
        const { idunity, idaccount, unityname, idtypeunity, idunitystate } = this.state;

        // const auxIdAccount = Number(idaccount);

        const response = await Api.put("/api/account/add-unity", {
            idunity, idaccount, unityname, idtypeunity, idunitystate
        });

        alert(response.data.message);

        this.setState({ load: false });

        if (response.data.statuscode === 201) {
            this.props.callbackParentCreateEdit();
            this.props.closeDialog();
        }
    }

    render() {
        return (
            <div>
                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}
                    name="formunity">

                    <TextValidator
                        fullWidth
                        label="Nome"
                        name="unityname"
                        value={this.state.unityname}
                        onChange={this.handleChange}
                        className="select-normalize"
                        validators={['required']}
                        errorMessages={['O nome da unidade é requerido.']}
                    />

                    <br />

                    <SelectValidator
                        fullWidth
                        label="Tipo de unidade"
                        onChange={this.handleChange}
                        name="idtypeunity"
                        value={this.state.idtypeunity}
                        className="select-normalize"
                        validators={['required']}
                        errorMessages={['O tipo de unidade é requerido.']}
                    >
                        {this.state.typeunitys !== undefined && this.state.typeunitys.map(
                            type => (<MenuItem key={type.value} value={Number(type.value)}>{type.label}</MenuItem>)
                        )}
                    </SelectValidator>

                    <br />

                    <SelectValidator
                        fullWidth
                        label="Estado da unidade"
                        onChange={this.handleChange}
                        name="idunitystate"
                        value={this.state.idunitystate}
                        className="select-normalize"
                        validators={['required']}
                        errorMessages={['O estado da unidade é requerido.']}
                    >
                        {this.state.unitystates !== undefined && this.state.unitystates.map(
                            ustate => (<MenuItem key={ustate.value} value={Number(ustate.value)}>{ustate.label}</MenuItem>)
                        )}
                    </SelectValidator>

                    <br />

                    <Button variant="outlined" className="button-send" type="submit">Salvar</Button>
                </ValidatorForm>
                <Loading on={this.state.load} />
            </div>
        );
    }
}
export default FormUnity;