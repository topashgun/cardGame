import React, { Component } from 'react'
export default class winner extends Component {
    constructor(props) {
        super(props);
    }
    populatePlayers(players) {
        var returnPlayers = "";
        players.map(player => {
            returnPlayers += "Player " + player + ", "
        })
        return returnPlayers.slice(0, -1);
    }
    render() {
        return (
            <div className={`alert text-center mt-2 mb-0 ${this.props.winner.WinnerPlayers.length == 1 ? `alert-success` : `alert-warning`}`} role="alert" >
                <h4 class="alert-heading font-weight-bold"><u>{this.props.winner.WinnerPlayers.length == 1 ? 'Winner' : 'Qualifiers'}</u></h4>
                {
                    this.props.winner.WinnerPlayers.length == 0
                        ? ''
                        : this.props.winner.WinnerPlayers.length == 1
                            ? <div><p>Player <b>{this.props.winner.WinnerPlayers[0]}</b> is the Winner by case <b>{this.props.winner.winnerCase}</b></p>
                                <hr />
                                <p class="mb-0">Click 'Generate Cards' button to play the game again.</p>
                            </div>
                            : <div>
                                <p>Multiple Qualifiers <b>{this.populatePlayers(this.props.winner.WinnerPlayers)}</b> by case <b>{this.props.winner.winnerCase}</b></p>
                                <hr />
                                <p class="mb-0">Kindly click the 'Play Tie Breaker' button to play the tie breaker game.</p>
                            </div>
                }
            </div >
        )
    }
}
