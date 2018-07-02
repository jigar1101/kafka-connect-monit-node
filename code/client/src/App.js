import React, { Component } from 'react';

import './App.css';

class App extends Component {

  state = {
    connectors: []
  };

  componentDidMount() {
    this.handleApi()
    setInterval(() => this.handleApi, 10000)
  }

  handleApi = async () => {
    this.callApi()
      .then(res => this.setState({ connectors: res }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/connectors');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="app">
        <div className="connectors-list">
          {
            this.state.connectors.map((obj, key) => {
              return <div className="connector"  key={key}>
                <div className="connector-details">
                  <div className="connector-name">{obj.name}</div>
                  <div className={`connector-status ${obj.connector.state.toLowerCase()}`}>{obj.connector.state}</div>
                </div>
                  <div className="tasks"> 
                    {
                      obj.tasks.map((task, key) => {
                        return <div className="task-details" key={key}>
                            <div className="task-title">Worker {key+1}</div>
                            <div className="task-name">{task.worker_id}</div>
                            <div className={`task-status ${task.state.toLowerCase()}`}>{task.state}</div>
                            { 
                              task.trace && 
                                <div className={`task-trace ${task.state.toLowerCase()}`}>{task.trace}</div>
                            }
                        </div>
                      })
                    }
                  </div>
                  <hr />
              </div>
            })
          }
        </div>
      </div>
    );
  }
}

export default App;