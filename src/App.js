import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: ""
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });

    this.setState({ message: "You're in the race!" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: "A winner has been picked!" });
  };

  render() {
    return (
      <div className="textBody">
        <h2 id="App-header">Play the guessing game!</h2>
        <p className="headText">
          <div>This game is managed by the contract:</div>
          <div> {this.state.manager}.</div>
          <br />
          <div>Right now {this.state.players.length} people are playing.</div>
          <div>
            Enter to win {web3.utils.fromWei(this.state.balance, "ether")}{" "}
            ether!
          </div>
        </p>

        <hr />

        <div id="bottom">
          <form onSubmit={this.onSubmit}>
            <h4>Submit your guess!</h4>
            <div>
              <label>Pay at least .02 ether to play:</label>
              <input
                value={this.state.value}
                onChange={event => this.setState({ value: event.target.value })}
              />
            </div>
            <button>Play</button>
          </form>

          <hr />
          <h4>Time to pick a winner?</h4>
          <div>
            <button onClick={this.onClick}>Pick a winner!</button>
          </div>

          <h1>{this.state.message}</h1>
        </div>
      </div>
    );
  }
}

export default App;
