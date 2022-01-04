import React from 'react';

import { ValidatorForm } from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';

import './styles.css';


class Steper extends React.Component {

    handleSubmit = async event => {
        event.preventDefault();
        return null;
    }

    render() {
        return (
            <div className="between-account">

                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}
                    name="1">
                    {this.props.step !== 1 &&
                        <Button variant="outlined" className="button-step" type="submit">Dados pessoais</Button>
                    }
                    {this.props.step === 1 &&
                        <Button variant="contained" color="primary" className="button-step" type="submit">Dados pessoais</Button>
                    }
                </ValidatorForm>

                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}
                    name="2">

                    {this.props.step !== 2 &&
                        <Button variant="outlined" className="button-step" type="submit">Unidades</Button>
                    }
                    {this.props.step === 2 &&
                        <Button variant="contained" color="primary" className="button-step" type="submit">Unidades</Button>
                    }
                </ValidatorForm>

                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}
                    name="3">

                    {this.props.step !== 3 &&
                        <Button variant="outlined" className="button-step" type="submit">Veículos</Button>
                    }
                    {this.props.step === 3 &&
                        <Button variant="contained" color="primary" className="button-step" type="submit">Veículos</Button>
                    }
                </ValidatorForm>

                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}
                    name="4">

                    {this.props.step !== 4 &&
                        <Button variant="outlined" className="button-step" type="submit">Acessos</Button>
                    }
                    {this.props.step === 4 &&
                        <Button variant="contained" color="primary" className="button-step" type="submit">Acessos</Button>
                    }
                </ValidatorForm>

            </div>
        );
    }
}
export default Steper;