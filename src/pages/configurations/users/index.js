import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Loading from '../../../components/Loading';
import '../styles.css';

import UserRegistration from './users';
import Profile from './profile';
import { HavePermission } from '../../../services/auth';
import { IsRoot } from '../../../services/auth';

export default class Users extends Component {
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
                        // variant="scrollable"
                        scrollButtons="off"
                        aria-label="scrollable prevent tabs example"
                        centered
                    >
                        {(IsRoot() || HavePermission(26)) && <Tab className="tab-item-2" label="Usuários" value={0} {...this.a11yProps(0)} />}
                        {!IsRoot() && HavePermission(27) && <Tab className="tab-item-2" label="Perfis" value={1} {...this.a11yProps(1)} />}
                    </Tabs>
                </AppBar>

                {(IsRoot() || HavePermission(26)) &&
                    <TabPanel value={this.state.valueTab} index={0}>
                        <UserRegistration />
                    </TabPanel>
                }

                {!IsRoot() && HavePermission(27) &&
                    <TabPanel value={this.state.valueTab} index={1}>
                        <Profile />
                    </TabPanel>
                }

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