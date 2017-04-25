import React, { Component } from 'react';
import logo from './logo.svg';

import * as _ from 'lodash';

import { Subject } from 'rxjs';

import brace from 'brace';
import AceEditor from 'react-ace';

import JSONTree from 'react-json-tree';

import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

import { Interpreter } from 'pear-script';

import 'brace/mode/ruby';
import 'brace/theme/github';

class App extends Component {

  state = {
    output: null,
    code: '',
    status: '',
    statusColor: '',
    parseTree: {},
    console: ''
  }

  successColor = '#43A047';
  failColor = 'red';
  interpreter = new Interpreter();
  codeRunSubject = new Subject();

  theme = {
    scheme: 'bright',
    author: 'chris kempson (http://chriskempson.com)',
    base00: '#000000',
    base01: '#303030',
    base02: '#505050',
    base03: '#b0b0b0',
    base04: '#d0d0d0',
    base05: '#e0e0e0',
    base06: '#f5f5f5',
    base07: '#ffffff',
    base08: '#fb0120',
    base09: '#fc6d24',
    base0A: '#fda331',
    base0B: '#a1c659',
    base0C: '#76c7b7',
    base0D: '#6fb3d2',
    base0E: '#d381c3',
    base0F: '#be643c'
  };

  constructor(props) {
    super(props);
    let oldLog = _.cloneDeep(window.console.log);
    window.console.log = (str) => {
      let curr = this.state.console;
      this.setState({console: `${curr}<br />${str}`});
    }
    this.codeRunSubject
      .debounceTime(100)
      .subscribe(code => this.runCode(code));
  }

  editorOnChange = (code) => {
    this.setState({ code });
    this.codeRunSubject.next(code);
  }

  runCode = (code) => {
    let result = null;
    try {
      this.state.console = '';
      result = this.interpreter.interpret(code);
      this.setState({ 
        output: result, 
        status: 'Successfully Run', 
        statusColor: this.successColor,
        parseTree: this.interpreter.parseTree
      });
    } catch(err) {
      let status = '';
      if (err && err.location && err.location.end) {
        status = `Error on line ${err.location.start.line} at character ${err.location.start.column}`;
      }
      this.setState({ status, statusColor: this.failColor });
    }
  }

  printOutput = (output) => {
    if (output && output.value) return '' + output.value;
    return '';
  }

  render() {
    return (
      <div style={{ width: '100%' }}>
        <AppBar
          style={{ backgroundColor: '#43A047'}}
          title="pear-script"
          iconElementLeft={<img src={logo} style={{height: '2em', padding: '0.5em'}}/>}
        />
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
        <div style={{position: 'absolute', right: '0%', paddingRight: '1em', top: '64px', overflow: 'auto', zIndex: 1}}>
          <JSONTree data={this.state.parseTree} theme={this.theme}/>
        </div>
        <Card style={{position: 'fixed', width: '100%', right: '0%', bottom: '0%', zIndex: '5'}}>
          <CardHeader
            title={<span><b>Output</b> <span style={{color: this.state.statusColor}}>{this.state.status}</span> </span>}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            <span dangerouslySetInnerHTML={{__html: this.state.console}} />
          </CardText>
        </Card>
      </div>
    );
  }
}

export default App;
