import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import '../../styles.css';

// import Registered from './registred';
import Visitors from './visitors';
import Unitys from '../../../account-configuration/unitys';
import Persons from '../../../account-configuration/persons';

class People extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueTab: 0
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
        return <div className="main-tab">
            <AppBar position="static">
                <Tabs
                    value={this.state.valueTab}
                    onChange={this.handleChangeTab}
                    variant="scrollable"
                    scrollButtons="off"
                    aria-label="scrollable prevent tabs example"
                >
                    <Tab className="tab-item-person" label="Pessoas cadastradas" value={0} {...this.a11yProps(0)} />
                    <Tab className="tab-item-person" label="Previsões de visitas" value={1} {...this.a11yProps(1)} />
                    <Tab className="tab-item-person" label="Unidades" value={2} {...this.a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={this.state.valueTab} index={0}>
                {/* <Registered account={this.props.account} /> */}
                <Persons account={this.props.account} typebtn={1} />
            </TabPanel>
            <TabPanel value={this.state.valueTab} index={1}>
                <Visitors />
            </TabPanel>
            <TabPanel value={this.state.valueTab} index={2}>
                <Unitys account={this.props.account} typebtn={1} />
            </TabPanel>
        </div>
    }
}

export default People;

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