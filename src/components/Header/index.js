import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VideocamIcon from '@material-ui/icons/Videocam';
import SubjectIcon from '@material-ui/icons/Subject';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import BusinessIcon from '@material-ui/icons/Business';
import SettingsIcon from '@material-ui/icons/Settings';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import HelpIcon from '@material-ui/icons/Help';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import InvertColorsIcon from '@material-ui/icons/InvertColors';

import './styles.css';
import logotipokpr from '../../assets/img/logokpr.png';
import { Logout } from "../../services/auth";
import { IsAuthenticated, IsRoot, HavePermission } from "../../services/auth";


const Header = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        if (IsAuthenticated())
            setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return <header id="main-header">

        <img
            className="img-header"
            src={logotipokpr}
            onClick={event => window.location.href = '/dashboard'}
            alt="Logo da empresa"
        />

        <div>
            <IconButton
                aria-controls="customized-menu"
                aria-label="more"
                aria-haspopup="true"
                onClick={() => { props.callbackChangeTheme() }}
            >
                <InvertColorsIcon className="icon-white" />
            </IconButton>

            {IsAuthenticated() && (
                <IconButton
                    aria-controls="customized-menu"
                    aria-label="more"
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon className="icon-white" />
                </IconButton>
            )}

            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >

                {HavePermission(24) &&
                    <StyledMenuItem onClick={event => window.location.href = '/dashboard'}>
                        <ListItemIcon>
                            <VideocamIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Monitoramento" />
                    </StyledMenuItem>
                }

                {HavePermission(4) &&
                    <StyledMenuItem onClick={event => window.location.href = '/reports'}>
                        <ListItemIcon>
                            <SubjectIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Relatórios" />
                    </StyledMenuItem>
                }

                {HavePermission(1) && (
                    <StyledMenuItem onClick={event => window.location.href = '/audits'}>
                        <ListItemIcon>
                            <VerifiedUserIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Auditorias" />
                    </StyledMenuItem>
                )}

                {HavePermission(8) && (
                    <StyledMenuItem onClick={event => window.location.href = '/accounts'}>
                        <ListItemIcon>
                            <BusinessIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Contas" />
                    </StyledMenuItem>
                )}

                {(HavePermission(32) || IsRoot()) && (
                    <StyledMenuItem className="margin-bottom" onClick={event => window.location.href = '/configurations'}>
                        <ListItemIcon>
                            <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Configurações" />
                    </StyledMenuItem>
                )}

                <StyledMenuItem className="margin-bottom" onClick={event => window.location.href = '/password'}>
                    <ListItemIcon>
                        <VpnKeyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Alterar senha" />
                </StyledMenuItem>

                <StyledMenuItem>
                    <ListItemIcon>
                        <HelpIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Ajuda" />
                </StyledMenuItem>

                <StyledMenuItem onClick={Logout}>
                    <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Sair" />
                </StyledMenuItem>

            </StyledMenu>

        </div>
    </header>
}
//#region complemento Menu

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})(props => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles(theme => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

//#endregion

export default Header;