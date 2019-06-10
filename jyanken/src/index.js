import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {BrowserRouter, Route, Redirect, Link} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import Jyanken from './Jyanken'



class JyankenGamePage extends Component {
    constructor(props) {
        super(props) 
        this.jyanken = new Jyanken()
        this.state = {scores: [], status: {}, tabIndex: 0}
    }
    componentDidMount() {
        this.getResult()
    }
    tagChange(ix) {
        this.setState({tabIndex: ix})
        this.getResult()
    }
    getResult() {
        this.setState({scores: this.jyanken.getScores()})
        this.setState({status: this.jyanken.getStatuses()})
    }
    pon(te) {
        this.jyanken.pon(te)
        this.getResult()
    }
    render() {
        const tabStyle={width: 200, height: 50, textAlign: 'center', color: '#fff', backgroundColor: '#01bcd4'}
        const activeStyle=(path) => Object.assign({borderBottom: `solid 2px ${this.props.location.pathname.match(path) ? '#f00' : '#01bcd4'}`}, tabStyle)
        
        return (
            <MuiThemeProvider>
                <div styles={{marginLeft: 30}}>
                    <Header>じゃんけん　ぽん！</Header>
                    <JyankenBox actionPon={(te) => this.pon(te)} />
                    <Paper style={{width: 400}} zDepth={2}>
                        <Link to="/scores">
                            <FlatButton label="対戦結果" style={activeStyle('scores')}/>
                        </Link>
                        <Link to="/status">
                            <FlatButton label="対戦成績" style={activeStyle('status')}/>
                        </Link>
                        <Route path="/scores" component={() => <ScoreList scores={this.state.scores} />} />
                        <Route path="/status" component={() => <StatesBox status={this.state.status} />} />
                        <Route exact path="/" component={() => <Redirect to="/scores" />} />
                    </Paper>
                </div>
            </MuiThemeProvider>
        )
    }
}
JyankenGamePage.propTypes = {
    location: PropTypes.object
}

const Header = (props) => (<h1>{props.children}</h1>)
Header.propTypes = {
    children: PropTypes.string
}

const StatesBox = (props) => (
    <Table>
        <TableBody displayRowCheckbox={false}>
            <TableRow displayBorder={false}>
                <TableHeaderColumn>勝ち</TableHeaderColumn>
                <TableRowColumn style={judgementStyle(1)}>{props.status.win}</TableRowColumn>
            </TableRow>
            <TableRow displayBorder={false}>
                <TableHeaderColumn>負け</TableHeaderColumn>
                <TableRowColumn style={judgementStyle(2)}>{props.status.lose}</TableRowColumn>
            </TableRow>
            <TableRow displayBorder={false}>
                <TableHeaderColumn>引き分け</TableHeaderColumn>
                <TableRowColumn style={judgementStyle(0)}>{props.status.draw}</TableRowColumn>
            </TableRow>
        </TableBody>
    </Table>
)
StatesBox.propTypes = {
    status: PropTypes.object
}

const JyankenBox = (props) => {
    const style = {marginLeft: 20}
    return (
        <div style={{marginTop: 40, marginBottom: 30, marginLeft: 30}}>
            <RaisedButton onClick={() => props.actionPon(0)} label="グー" style={style}/>
            <RaisedButton onClick={() => props.actionPon(1)} label="チョキ" style={style}/>
            <RaisedButton onClick={() => props.actionPon(2)} label="パー" style={style}/>
        </div>
    )
}

JyankenBox.propTypes = {
    actionPon: PropTypes.func
}
const ScoreList = (props) => (
    <Table>
        <TableHeader adjustForCheckBox={false} displaySelectAll={false}>
            <TableRow>
                <TableHeaderColumn>時間</TableHeaderColumn>
                <TableHeaderColumn>人間</TableHeaderColumn>
                <TableHeaderColumn>コンピュータ</TableHeaderColumn>
                <TableHeaderColumn>結果</TableHeaderColumn>
            </TableRow>
        </TableHeader>
        <TableBody>
            {props.scores.map((score, ix) => <ScoreListItem key={ix} score={score} />)}
        </TableBody>
    </Table>
    
)
ScoreList.propTypes = {
    scores: PropTypes.array
}

const ScoreListItem = (props) => {
    const teString = ["ぐー", "チョキ", "パー"]
    const judgementString = ["引き分け", "勝ち", "負け"]
    const dateHHMMSS = (d) => d.toTimeString().substr(0,8)
    return (
        <TableRow style={judgementStyle(props.score.judgement)}>
            <TableRowColumn>{dateHHMMSS(props.score.created_at)}</TableRowColumn>
            <TableRowColumn>{teString[props.score.human]}</TableRowColumn>
            <TableRowColumn>{teString[props.score.computer]}</TableRowColumn>
            <TableRowColumn>{judgementString[props.score.judgement]}</TableRowColumn>
        </TableRow>
    )
}
ScoreListItem.propTypes = {
    score: PropTypes.object
}
const judgementStyle = (judgement) => ({color: ["#000", "#2979FF", "FF1744"][judgement]})

ReactDOM.render(
    <BrowserRouter>
        <Route path="/" component={JyankenGamePage} />
    </BrowserRouter>,
    document.getElementById('root')
)
