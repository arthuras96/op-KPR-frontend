import React from 'react';
import Routes from './routes';
import { createMuiTheme, CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { IsAuthenticated } from "./services/auth";


import './styles.css';
import Header from './components/Header';

const dark = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const light = createMuiTheme({
  palette: {
    type: "light",
    background: {
      default: "#fafafa"
    },
  }
});

class App extends React.Component {

  constructor(props) {
    super(props);

    if (localStorage.getItem("theme") === null)
      localStorage.setItem("theme", false);

    if (localStorage.getItem("theme").toString() === "true") {
      this.state = {
        isThemeDark: true
      };
    }
    else {
      this.state = {
        isThemeDark: false
      };
    }
    this.changeTheme = this.changeTheme.bind(this);
  }

  changeTheme() {
    if (localStorage.getItem("theme").toString() === "true") {
      this.setState({ isThemeDark: false });
      localStorage.removeItem("theme");
      localStorage.setItem("theme", false);
    }
    else {
      this.setState({ isThemeDark: true });
      localStorage.removeItem("theme");
      localStorage.setItem("theme", true);
    }
  }

  render() {
    return <div className="App">
      <ThemeProvider theme={this.state.isThemeDark ? dark : light}>
        <CssBaseline />
        {IsAuthenticated() && window.location.pathname !== "/all-cams" && <Header callbackChangeTheme={() => this.changeTheme()} />}
        <Routes />
      </ThemeProvider>
    </div>
  };
}

export default App;
