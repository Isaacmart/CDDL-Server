import React from "react";
import Display from "./display";

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '1a6w'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  fetchFile = async () => {
    fetch("http://34.200.71.31:81/lise/" + this.state.value)
    .then((response) => response.blob())
    .then((url) => this.setState({url: this.state.value.toUpperCase()}));
  };

  handleSubmit(event) {
    if (this.state.value !== '') {
      this.fetchFile();
    }
    event.preventDefault();
  }

  render() {
    return (
      <>
        <div id="input">
          <form onSubmit={this.handleSubmit} encType='multipart/form-data'>
            <label>
              Name:
              <input type="text" value={this.state.value} pattern="^\d\w{3}" onChange={this.handleChange} />
              <input type="file" accept=".pdb" />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
        <Display file={this.state.value.toUpperCase()}/>
      </>
    );
  }
}

