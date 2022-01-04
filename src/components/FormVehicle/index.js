import React from 'react';

import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import './styles.css';
import Api from "../../services/api";
import Loading from '../../components/Loading';


class FormVehicle extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            idvehicle: 0,
            licenseplate: '',
            model: '',
            manufacturer: '',
            color: '',
            comments: '',
            idaccount: 0,
            active: true,

            load: false
        }
    }

    async componentDidMount() {
        // console.log(this.props.account.idperson);
        if (this.props.account.idperson !== '' && this.props.account.idperson !== undefined) {
            this.setState({
                idaccount: Number(this.props.account.idperson)
            });

            if (this.props.data !== null && this.props.data !== undefined) {
                this.setState({
                    idvehicle: this.props.data.idvehicle,
                    licenseplate: this.props.data.licenseplate,
                    model: this.props.data.model,
                    manufacturer: this.props.data.manufacturer,
                    color: this.props.data.color,
                    comments: this.props.data.comments,
                    active: this.props.data.active,
                });
            }
        }
    }


    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({ [name]: value });
    }

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
        const { idvehicle, licenseplate, model, manufacturer, color, comments, idaccount, active } = this.state;

        const response = await Api.put("/api/account/add-vehicle", {
            idvehicle, licenseplate, model, manufacturer, color, comments, idaccount, active
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
                    name="formvehicle">

                    <TextValidator
                        fullWidth
                        label="Placa"
                        name="licenseplate"
                        value={this.state.licenseplate}
                        onChange={this.handleChange}
                        className="select-normalize"
                        validators={['required', 'matchRegexp:^[A-Za-z0-9]*$', 'minStringLength: 7', 'maxStringLength: 7']}
                        errorMessages={['A placa é requerida.', 'Apenas letras e números', 'Deve conter 7 caracteres', 'Deve conter 7 caracteres']}
                    />

                    <br />

                    <TextValidator
                        fullWidth
                        label="Modelo"
                        name="model"
                        value={this.state.model}
                        onChange={this.handleChange}
                        className="select-normalize"
                        validators={['required']}
                        errorMessages={['O modelo é requerido.']}
                    />

                    <br />

                    <TextValidator
                        fullWidth
                        label="Fabricante"
                        name="manufacturer"
                        value={this.state.manufacturer}
                        onChange={this.handleChange}
                        className="select-normalize"
                    />

                    <br />

                    <SelectValidator
                        fullWidth
                        label="Cor"
                        onChange={this.handleChange}
                        name="color"
                        value={this.state.color}
                        className="select-normalize"
                    >
                        <MenuItem value="Branco"><span className="span-base span-white"></span> Branco</MenuItem>
                        <MenuItem value="Azul"><span className="span-base span-blue"></span> Azul</MenuItem>
                        <MenuItem value="Cinza"><span className="span-base span-grey"></span> Cinza</MenuItem>
                        <MenuItem value="Prata"><span className="span-base span-silver"></span> Prata</MenuItem>
                        <MenuItem value="Preto"><span className="span-base span-black"></span> Preto</MenuItem>
                        <MenuItem value="Bege"><span className="span-base span-beige"></span> Bege</MenuItem>
                        <MenuItem value="Vermelho"><span className="span-base span-red"></span> Vermelho</MenuItem>
                        <MenuItem value="Amarelo"><span className="span-base span-yellow"></span> Amarelo</MenuItem>
                        <MenuItem value="Bordo"><span className="span-base span-wine"></span> Bordo</MenuItem>
                        <MenuItem value="Dourado"><span className="span-base span-golden"></span> Dourado</MenuItem>
                        <MenuItem value="Laranja"><span className="span-base span-orange"></span> Laranja</MenuItem>
                        <MenuItem value="Marrom"><span className="span-base span-brown"></span> Marrom</MenuItem>
                        <MenuItem value="Rosa"><span className="span-base span-pink"></span> Rosa</MenuItem>
                        <MenuItem value="Verde"><span className="span-base span-green"></span> Verde</MenuItem>
                    </SelectValidator>

                    <br />

                    <TextValidator
                        fullWidth
                        label="Notas"
                        name="comments"
                        value={this.state.comments}
                        onChange={this.handleChange}
                        className="select-normalize"
                    />

                    <br />

                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.active}
                            onChange={this.handleChangeBoolean}
                            value={this.state.active}
                            name="active"
                            color="primary"
                        />
                        }
                        label="Ativo"
                        validators={['required']}
                        className="padding-top-check"
                    />

                    <br />

                    <Button variant="outlined" className="button-send" type="submit">Salvar</Button>
                </ValidatorForm>
                <Loading on={this.state.load} />
            </div>
        );
    }
}
export default FormVehicle;