import React from 'react';
import Button from '@material-ui/core/Button';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import './styles.css';
import Api from "../../services/api";
import Loading from '../../components/Loading';


class FormResolution extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            idtaskresolution: 0,
            name: '',
            taskresolution: '',
            sequence: 0,
            load: false
        }
    }

    componentDidMount() {
        if (this.props.data !== undefined) {
            this.setState({
                idtaskresolution: this.props.data.idtaskresolution,
                name: this.props.data.name,
                taskresolution: this.props.data.taskresolution,
                sequence: this.props.data.sequence,
            });
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
        const { idtaskresolution, name, taskresolution, sequence } = this.state;
        const response = await Api.put("/api/task/add-resolution", { idtaskresolution, name, taskresolution, sequence });
        alert(response.data.message);

        if (response.data.statuscode === 201) { // Se deu certo
            this.props.callbackParentCreateEdit();
            this.props.closeDialog();
        }

        this.setState({ load: false });
    }

    render() {
        return (
            <div className="inner-div-margin-left">
                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}>

                    <TextValidator
                        label="Nome"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                        className="select-normalize-form-task"
                        validators={['required', 'minStringLength: 4']}
                        errorMessages={['O nome é requerido.', 'O nome é muito curto.']}
                    />

                    <TextValidator
                        label="Descrição"
                        name="taskresolution"
                        value={this.state.taskresolution}
                        onChange={this.handleChange}
                        className="select-normalize-form-task"
                        validators={['required', 'minStringLength: 4']}
                        errorMessages={['A descrição é requerida.', 'A descrição é muito curta.']}
                    />

                    <br />
                    <Button variant="outlined" className="button-send" type="submit">Salvar</Button>
                </ValidatorForm>
                <Loading on={this.state.load} />
            </div>
        );
    }
}
export default FormResolution;