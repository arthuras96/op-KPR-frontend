import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { HavePermission } from '../../services/auth';

import Loading from '../../components/Loading';
import './styles.css';

export default class Reports extends Component {

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
            <AppBar position="static">
                <Tabs
                    value={this.state.valueTab}
                    onChange={this.handleChangeTab}
                    scrollButtons="off"
                    aria-label="scrollable prevent tabs example"
                    centered
                >
                    {HavePermission(5) && <Tab className="tab-item-3" label="Acessos" value={0} {...this.a11yProps(0)} />}
                    {HavePermission(6) && <Tab className="tab-item-3" label="Ocorrências" value={1} {...this.a11yProps(1)} />}
                    {HavePermission(7) && <Tab className="tab-item-3" label="Pessoas" value={2} {...this.a11yProps(2)} />}
                </Tabs>
            </AppBar>

            {HavePermission(5) &&
                <TabPanel value={this.state.valueTab} index={0}>
                    Acesso
            </TabPanel>
            }

            {HavePermission(6) &&
                <TabPanel value={this.state.valueTab} index={1}>
                    Ocorrência
            </TabPanel>
            }

            {HavePermission(7) &&
                <TabPanel value={this.state.valueTab} index={2}>
                    Pessoa
            </TabPanel>
            }
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