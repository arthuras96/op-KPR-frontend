import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Loading from '../../components/Loading';
import './styles.css';
import { HavePermission, IsRoot } from '../../services/auth';
import GlobalConfiguration from './global-configuration';
import Users from './users';

export default class Configurations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueTab: 0,
            load: false
        };
    }

    handleChangeTab = (event, newValue) => {
        this.setState({
            valueTab: newValue
        });
        console.log(event);
        console.log(newValue);
    };

    a11yProps(index) {
        return {
            id: `scrollable-prevent-tab-${index}`,
            'aria-controls': `scrollable-prevent-tabpanel-${index}`,
        };
    }

    render() {
        return <div>
            <div className="main-tab">
                <AppBar position="static">
                    <Tabs
                        value={this.state.valueTab}
                        onChange={this.handleChangeTab}
                        scrollButtons="off"
                        aria-label="scrollable prevent tabs example"
                        centered
                    >
                        {(IsRoot() || HavePermission(26) || HavePermission(27)) && <Tab className="tab-item-3" label="Usuários" value={0} {...this.a11yProps(0)} />}
                        {HavePermission(31) && <Tab className="tab-item-3" label="Integrações" value={1} {...this.a11yProps(1)} />}
                        <Tab className="tab-item-3" label="Configurações Globais" value={2} {...this.a11yProps(2)} />
                    </Tabs>
                </AppBar>

                {(IsRoot() || HavePermission(26) || HavePermission(27)) &&
                    <TabPanel value={this.state.valueTab} index={0}>
                        <Users />
                    </TabPanel>
                }
                {HavePermission(31) &&
                    <TabPanel value={this.state.valueTab} index={1}>
                        Integrações.
                    </TabPanel>
                }

                <TabPanel value={this.state.valueTab} index={2}>
                    <GlobalConfiguration />
                </TabPanel>
            </div>
            <Loading on={this.state.load} />
        </div>
    }
}

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