import React, { Component, FormEvent, ReactNode } from 'react'
import io from 'socket.io-client'
import NavBar from './components/navbar'

import './styles/app.css'

const server: string =
  process.env.REACT_APP_SERVER_URL || `http://127.0.0.1:3000`

const socket = io.connect(server)

interface IState {
  input: string
  msg: string
  output: string
}

class App extends Component<{}, IState> {
  constructor(props: any) {
    super(props)
    this.state = { input: '', msg: '', output: '' }
  }
  public render(): ReactNode {
    socket.on('output', (o: string): any => this.update(o))

    return (
      <div className="App">
        <header className="App-header">
          <NavBar />
          <p>Client connected to {server}...</p>
          <p>{this.state.output}</p>
          <p>{this.state.msg}</p>
          <form onSubmit={this.handleSubmit}>
            Write something:{' '}
            <input
              id="input"
              name="input"
              type="text"
              value={this.state.input}
              onChange={this.handleChange}
            />
          </form>
        </header>
      </div>
    )
  }
  public update = (output: string): void => {
    this.setState({ output })
  }
  public handleChange = (e: FormEvent<HTMLInputElement>): void => {
    const input = e.currentTarget.value
    this.setState({ input })
  }
  public handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    this.handleLine(this.state.input)
  }
  public handleLine = (line: string): void => {
    if (line[0] === '/' && line.length > 1) {
      const launch = /^\/launch/gi
      if (launch.test(line)) {
        const app = line.trim().slice(8)
        this.setState({
          msg: `UNDER CONSTRUCTION: We hope you'll be able to launch ${app} soon!`,
        })
        // changeApp(app)
      } else if (line === '/lobby') {
        this.setState({ input: '', msg: 'You are in the lobby.' })
        // switchConnection(SERVER_URL)
      } else if (line === '/exit') {
        this.setState({ input: '', msg: 'Soon you can exit the program.' })
        // exitCommand()
      } else if (line === '/dev') {
        this.setState({ input: '', msg: 'Definitely development mode.' })
        // switchConnection('http://localhost:4444')
      } else {
        socket.emit('input', line)
        this.setState({ input: '' })
        //       this.setState({ msg: `Will totes perform "${line}"...` })
        // handleCommand(line, socket)
      }
    } else {
      socket.emit('input', line)
      this.setState({ input: '' })
    }
  }
}

export default App
