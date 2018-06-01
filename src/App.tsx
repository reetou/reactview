import * as React from 'react';
import Postmate from 'postmate';

export default class App extends React.Component<any, any> {

  state = {
    typed: '',
    url: 'http://localhost:1235',
  }
  child?: any;

  async componentDidMount() {
    const child = await new Postmate({
      container: document.getElementById('another'), // Element to inject frame into
      url: 'http://localhost:1235' // Page to load, must have postmate.js. This will also be the origin used for communication.
    });
    this.child = child;
    console.log("Set this child")
    // When parent <-> child handshake is complete, data may be requested from the child
    const height = await child.get('height');
    console.log("height", height);
    const toggleState = await child.get('toggleState');
    const width = await child.get('width');
    child.frame.style.height = `${height}px`;
    child.frame.style.width = `${width}px`;
    console.log("toggle state", toggleState, "width", width)
    // Listen to a particular event from the child
    child.on('render', data => console.log("data", data)); // Logs "Hello, World!"
  }

  render() {
    return <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>React View</h1>
      <form
        style={{ display: 'flex', flexDirection: 'row' }}
        onSubmit={(e) => {
          e.preventDefault()
          this.child.call('addItem', { text: this.state.typed })
          this.setState({ typed: '' })
        }}
      >
        <input
          style={{ padding: 15, fontSize: 16 }}
          value={this.state.typed}
          onChange={(e) => this.setState({ typed: e.target.value })}
          placeholder={'Item name'}
        />
        <button
          style={{ padding: 15, fontSize: 16 }}
          type={'submit'}
        >
          Add item to child state
        </button>
      </form>
      <div id={'another'}>

      </div>
    </div>;
  }
}
