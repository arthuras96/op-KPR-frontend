import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MaterialTable from 'material-table';

import InfoIcon from '@material-ui/icons/Info';
import VideocamIcon from '@material-ui/icons/Videocam';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import PeopleIcon from '@material-ui/icons/People';
import HistoryIcon from '@material-ui/icons/History';

import '../styles.css';
import Data from './data';
import Access from './access';
import People from './people';
import Cameras from './cameras';

class MainTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueTab: 1,
            columns: [
                { title: 'Data / Hora', field: 'datetime' },
                { title: 'Conta', field: 'account' },
                { title: 'Mensagem', field: 'message' },
            ],
            data: [],
            account: this.props.account
        };
    }

    // componentDidUpdate(prevProps) {
    //     // Uso típico, (não esqueça de comparar as props):
    //     if (this.props.account.idPerson !== this.state.account.idPerson) {
    //         this.setState({
    //             account: this.props.account
    //         });
    //     }
    // }

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
        return <div className="main-tab root-tab-border">
            <AppBar position="static">
                <Tabs
                    value={this.state.valueTab}
                    onChange={this.handleChangeTab}
                    variant="scrollable"
                    scrollButtons="off"
                    aria-label="scrollable prevent tabs example"
                >
                    <Tab className="tab-item-5" icon={<InfoIcon />} aria-label="phone" value={0} {...this.a11yProps(0)} />
                    <Tab className="tab-item-5" icon={<VideocamIcon />} aria-label="favorite" value={1} {...this.a11yProps(1)} />
                    <Tab className="tab-item-5" icon={<MeetingRoomIcon />} aria-label="person" value={2} {...this.a11yProps(2)} />
                    <Tab className="tab-item-5" icon={<PeopleIcon />} aria-label="help" value={3} {...this.a11yProps(3)} />
                    <Tab className="tab-item-5" icon={<HistoryIcon />} aria-label="shopping" value={4} {...this.a11yProps(4)} />
                </Tabs>
            </AppBar>

            <TabPanel value={this.state.valueTab} index={0}>
                <Data account={this.state.account} />
            </TabPanel>

            <TabPanel value={this.state.valueTab} index={1}>
                <Cameras account={this.state.account} zone={this.props.zone} />
            </TabPanel>

            <TabPanel value={this.state.valueTab} index={2}>
                <Access account={this.state.account} />
            </TabPanel>

            <TabPanel value={this.state.valueTab} index={3}>
                <People account={this.state.account} />
            </TabPanel>

            <TabPanel value={this.state.valueTab} index={4}>
                <MaterialTable
                    title="Histórico"
                    columns={this.state.columns}
                    data={this.state.data}
                    account={this.props.account}
                />
            </TabPanel>
        </div>
    }
}

export default MainTab;

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
