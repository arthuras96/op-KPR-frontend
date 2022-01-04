import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import './styles.css';
import Zones from './zones';
import Events from './events';
import Schedules from './schedules';
import Unitys from './unitys';
import Vehicles from './vehicles';
import Persons from './persons';
import Devices from './devices';
import DGuard from './dguard';
import Api from '../../services/api';
import Loading from '../../components/Loading';
import { HavePermission } from '../../services/auth';

class AccountConfiguration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            valueTab: 0,
            account: {},
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
            <div className="account-header">
                <span className="account-back" onClick={() => window.history.back()}><ArrowBackIcon /> VOLTAR</span>
                <h2 className="center-title">{this.state.account.name}</h2>
                <span></span>
            </div>

            <div className="main-tab">
                <AppBar position="static">
                    <Tabs
                        value={this.state.valueTab}
                        onChange={this.handleChangeTab}
                        scrollButtons="off"
                        aria-label="scrollable prevent tabs example"
                        centered
                    >
                        {HavePermission(11) && <Tab className="tab-item-8" label="Dispositivos" value={0} {...this.a11yProps(0)} />}
                        {HavePermission(12) && <Tab className="tab-item-8" label="D-Guard" value={1} {...this.a11yProps(1)} />}
                        {HavePermission(13) && <Tab className="tab-item-8" label="Zonas" value={2} {...this.a11yProps(2)} />}
                        {HavePermission(14) && <Tab className="tab-item-8" label="Horários" value={3} {...this.a11yProps(3)} />}
                        {HavePermission(15) && <Tab className="tab-item-8" label="Pessoas" value={4} {...this.a11yProps(4)} />}
                        {HavePermission(20) && <Tab className="tab-item-8" label="Unidades" value={5} {...this.a11yProps(5)} />}
                        {HavePermission(21) && <Tab className="tab-item-8" label="Veículos" value={6} {...this.a11yProps(6)} />}
                        {HavePermission(22) && <Tab className="tab-item-8" label="Eventos" value={7} {...this.a11yProps(7)} />}
                    </Tabs>
                </AppBar>

                {HavePermission(11) &&
                    <TabPanel value={this.state.valueTab} index={0}>
                        {this.state.account.zones !== undefined &&
                            <Devices account={this.state.account} />
                        }
                    </TabPanel>
                }

                {HavePermission(12) &&
                    <TabPanel value={this.state.valueTab} index={1}>
                        {this.state.account.zones !== undefined &&
                            <DGuard account={this.state.account} />
                        }
                    </TabPanel>
                }

                {HavePermission(13) &&
                    <TabPanel value={this.state.valueTab} index={2}>
                        {this.state.account.zones !== undefined &&
                            <Zones account={this.state.account} />
                        }
                    </TabPanel>
                }

                {HavePermission(14) &&
                    <TabPanel value={this.state.valueTab} index={3}>
                        {this.state.account.schedules !== undefined &&
                            <Schedules account={this.state.account} />
                        }
                    </TabPanel>
                }

                {HavePermission(15) &&
                    <TabPanel value={this.state.valueTab} index={4}>
                        {this.state.account.schedules !== undefined &&
                            <Persons account={this.state.account} typebtn={2} />
                        }
                    </TabPanel>
                }

                {HavePermission(20) &&
                    <TabPanel value={this.state.valueTab} index={5}>
                        {this.state.account.unitys !== undefined &&
                            <Unitys account={this.state.account} typebtn={2} />
                        }
                    </TabPanel>
                }

                {HavePermission(21) &&
                    <TabPanel value={this.state.valueTab} index={6}>
                        {this.state.account.vehicles !== undefined &&
                            <Vehicles account={this.state.account} />
                        }
                    </TabPanel>
                }

                {HavePermission(22) &&
                    <TabPanel value={this.state.valueTab} index={7}>
                        {this.state.account.events !== undefined &&
                            <Events account={this.state.account} />
                        }
                    </TabPanel>
                }
            </div>
            <Loading on={this.state.load} />
        </div>
    }

    async componentDidMount() {
        this.setState({
            load: true
        })
        const { id } = this.props.match.params
        const response = await Api.get("/api/account/get-complete?Id=" + id + "&Parameters=0");

        this.setState({
            account: response.data,
            load: false
        });
    }
}

export default AccountConfiguration;

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