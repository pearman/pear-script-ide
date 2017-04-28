import React, { Component } from 'react';
import logo from './logo.svg';

import * as _ from 'lodash';

import { Subject } from 'rxjs';

import brace from 'brace';
import AceEditor from 'react-ace';

import JSONTree from 'react-json-tree';

import AppBar from 'material-ui/AppBar';
import {Card, CardHeader, CardText} from 'material-ui/Card';

import { Interpreter } from 'pear-script';

import 'brace/mode/ruby';
import 'brace/theme/github';

import TreeView from './TreeView';

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

  constructor(props) {
    super(props);
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
    try {
      this.state.console = '';
      let result = this.interpreter.eval(code);
      let parseTree = this.interpreter.parseTree;
      this.setState({ 
        output: result, 
        status: 'Successfully Run', 
        statusColor: this.successColor,
        parseTree: parseTree
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
        <TreeView data={this.state.parseTree} />
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
