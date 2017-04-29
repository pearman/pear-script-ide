import React, { Component } from 'react';
import JSONTree from 'react-json-tree';

import * as _ from 'lodash';

class TreeView extends Component {
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

  clean = (object) => {
    if (_.isArray(object)) return object;
    return _.mapValues(
      _.omitBy(object, value => _.isFunction(value)), 
      value => {
        if (_.isObject(value)) return this.clean(value);
        return value;
      }
    );
  }

  getItemString = (type, data, itemType, itemString) => {
    let psType = '';
    if (type === 'Object') psType = 'Table';
    if (type === 'Array') psType = 'Method Chain';
    return (<span>{psType}</span>)
  };

  render() {
    return (
      <div style={{position: 'absolute', right: '0%', paddingRight: '1em', top: '64px', overflow: 'auto', maxWidth: '25%', zIndex: 1}}>
        <JSONTree 
            data={this.clean(this.props.data)} 
            theme={this.theme}
            getItemString={this.getItemString}
            />
      </div>
    );
  }
}

export default TreeView;