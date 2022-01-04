import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import './styles.css';

function TaskCard(props) {

    let cardClassName = "";

    if (props.idPriority === 1) {
        cardClassName = "card-blue";
    } else if (props.idPriority === 2) {
        cardClassName = "card-green";
    } else if (props.idPriority === 3) {
        cardClassName = "card-yellow";
    } else if (props.idPriority === 4) {
        cardClassName = "card-red";
    }

    let buttonClassName = "";

    if (props.status === "Em espera") {
        buttonClassName = "button-block";
    }

    return (

        <Card variant="outlined" className={cardClassName} onClick={() => { props.callbackParentView(props.idTask) }}>
            <CardContent>

                <Typography className="title taskcard-title">
                    <span>{props.title}</span> <span>{props.acumulate !== 1 && "(" + props.acumulate + ")"}</span>
                </Typography>

                <Typography className="user">
                    {props.user}
                </Typography>

                <Typography className="account-title">
                    Conta
                </Typography>

                <Typography className="account">
                    {props.nameAccount}
                </Typography>

            </CardContent>
            {props.status !== '' &&
                <CardActions>
                    <Button onClick={() => { props.callbackParentTask(props.idTask) }} size="small" className={buttonClassName}>{props.status}</Button>
                </CardActions>
            }
        </Card>
    );
}

export default TaskCard;
