import * as React from 'react';
import Postmate from 'postmate';

export interface ChildState {
  items: Array<{ text: string }>;
}

export default class Child extends React.Component<any> {

  state: ChildState = {
    items: [],
  };
  parent?: any;

  async componentDidMount() {
    const parent = await new Postmate.Model({
      // Expose your model to the Parent. Property values may be functions, promises, or regular values
      height: () => document.height || document.body.offsetHeight,
      toggleState: (newState) => this.setState(newState),
      addItem: (item: { text: string }) => this.setState({ items: [...this.state.items, item] }, () => console.log("Added item", item)),
      width: 500,
    });
    this.parent = parent;
    console.log(parent)

    // When parent <-> child handshake is complete, events may be emitted to the parent
    setInterval(() => parent.emit("render", { rendered: true }), 1500)
  }

  render() {
    return <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>I am a React View child and wanna handshake with my parent</h1>
      <h2>My items</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {
          this.state.items.map((i) => <div>{i.text}</div>)
        }
      </div>
    </div>;
  }
}
