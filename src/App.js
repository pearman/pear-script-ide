import React, { Component } from 'react';
import logo from './logo.svg';

import * as _ from 'lodash';

import { Subject } from 'rxjs';

import brace from 'brace';
import AceEditor from 'react-ace';

import JSONTree from 'react-json-tree';

import AppBar from 'material-ui/AppBar';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import Help from 'material-ui/svg-icons/action/help';

import { Interpreter } from '../../../../Documents/g-lang/dist/index';
//import { Interpreter } from 'pear-script';

import 'brace/mode/ruby';
import 'brace/theme/github';

import TreeView from './TreeView';
import examples from './examples';

class App extends Component {

  state = {
    code: examples['Getting Started (Hello World)'],
    status: '',
    statusColor: '',
    parseTree: {},
    console: '',
    helpOpen: false
  }

  successColor = 'rgb(124, 160, 67)';
  precomputedColor = 'orange';
  failColor = 'red';
  interpreter = new Interpreter();
  precomputeSubject = new Subject();
  consoleSubject = new Subject();

  constructor(props) {
    super(props);

    let oldLog = window.console.log;
    window.console.log = (str) => {
      oldLog(str);
      this.consoleSubject.next(str);
    }

    this.consoleSubject
      .scan((acc, value) => {
        if (_.isNil(value)) return '';
        return `${acc}<br />${value}`;
      }, '')
      .debounceTime(100)
      .subscribe(data => this.setState({console: data}));

    this.precomputeSubject
      .debounceTime(500)
      .subscribe(code => this.precompute(code));

    this.precomputeSubject.next(this.state.code);
  }

  handleHelpOpen = () => {
    this.setState({helpOpen: true});
  };

  handleHelpClose = () => {
    this.setState({helpOpen: false});
  };

  editorOnChange = (code) => {
    this.setState({ code });
    this.precomputeSubject.next(code);
  }

  setExample = (code) => {
    this.setState({ code, helpOpen: false });
    this.precomputeSubject.next(code);
  }

  precompute = (code) => {
    this.consoleSubject.next(null);
    try {
      let parseTree = this.interpreter.precompute(code);
      this.setState({ 
        status: `Code Precomputed (${this.interpreter.lastExecutionTime}ms)`, 
        statusColor: this.precomputedColor,
        parseTree: parseTree,
      });
    } catch(err) {
      let status = '';
      if (err && err.location && err.location.end) {
        status = `Error on line ${err.location.start.line} at character ${err.location.start.column}`;
      }
      this.setState({ status, statusColor: this.failColor });
    }
  }

  eval = () => {
    this.consoleSubject.next(null);
    try {
      this.interpreter.eval(this.state.code);
      this.setState({
        status: `Successfully Run (${this.interpreter.lastExecutionTime}ms)`, 
        statusColor: this.successColor
      });
    } catch(err) {
      let status = '';
      if (err && err.location && err.location.end) {
        status = `Error on line ${err.location.start.line} at character ${err.location.start.column}`;
      }
      this.setState({ status, statusColor: this.failColor });
    }
  }

  render() {
    return (
      <div style={{ width: '100%' }}>
        <AppBar
          style={{ backgroundColor: 'rgb(124, 160, 67)'}}
          title="pear-script"
          iconElementLeft={<img src={logo} style={{height: '2em', padding: '0.5em'}}/>}
        >
          <div style={{display: 'flex', alignItems: 'center'}}>
            <IconButton iconStyle={{color: 'white'}} onTouchTap={this.handleHelpOpen}> <Help /> </IconButton>
            <IconButton iconStyle={{color: 'white'}} onTouchTap={this.eval}> <PlayArrow/> </IconButton>
          </div>
        </AppBar>
        <AceEditor
          mode='ruby'
          theme='github'
          name='editor'
          width='100%'
          height='calc(100vh - 64px)'
          style={{position: 'absolute'}}
          value={this.state.code}
          onChange={this.editorOnChange}
          highlightActiveLine={false}
        />
        <TreeView data={this.state.parseTree} />
        <Card style={{position: 'fixed', width: '100%', right: '0%', bottom: '0%', zIndex: '5', maxHeight: '50%'}}>
          <CardHeader
            title={<span><b>Output</b> <span style={{color: this.state.statusColor}}>{this.state.status}</span> </span>}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true} style={{overflow: 'auto', maxHeight: 'calc(50vh - 50px)'}}>
            <span dangerouslySetInnerHTML={{__html: this.state.console}} />
          </CardText>
        </Card>
        <Dialog
          title="Examples"
          modal={false}
          open={this.state.helpOpen}
          onRequestClose={this.handleHelpClose}
        >
          Read the documentation <a target="_blank" href='https://pearman.github.io/pear-script/'>here</a>.
          <br /><br />
          <Divider />
          <List>
            { 
              _.map(examples, (prog, name) => 
                <ListItem primaryText={name} key={name} onTouchTap={() => this.setExample(prog)}/>)
            }
          </List>
        </Dialog>
      </div>
    );
  }
}

export default App;
