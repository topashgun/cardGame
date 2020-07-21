import React, { Component } from 'react'
import Player from './player';
import Winner from './winner';
var numberOfPlayers = 6;
export default class body extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numberOfPlayers: this.populatePlayersArray(numberOfPlayers),
            numberOfCards: 3,
            cards: [{
                faces: ['club', 'heart', 'diamond', 'club'],
                values: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
                numericValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

            }],
            allAssignedCards: [],
            assignedCardsToPlayers: [],
            winners: {
                winnerCase: '',
                WinnerPlayers: []
            },
            tieBreaker: false

        }
        this.assignCardsToPlayers = this.assignCardsToPlayers.bind(this);
        this.generateCard = this.generateCard.bind(this);
        this.determineWinner = this.determineWinner.bind(this);
        this.playTieBreaker = this.playTieBreaker.bind(this);
        this.populatePlayersArray = this.populatePlayersArray.bind(this);
        this.getTieBreakerResult = this.getTieBreakerResult.bind(this);
    }

    populatePlayersArray(numberOfPlayers) {
        var playersArray = [];
        for (var i = 1; i <= numberOfPlayers; i++) {
            playersArray.push(i)
        }
        return playersArray
    }

    async assignCardsToPlayers(numberOfCards) {
        var assignedCards = [];
        var checkAssignedCards = [];
        await this.setState({
            assignedCardsToPlayers: []
        });
        if (this.state.winners.WinnerPlayers.length == 1) {
            await this.setState({
                numberOfPlayers: this.populatePlayersArray(numberOfPlayers)
            });
        }
        for (var i = 0; i < this.state.numberOfPlayers.length; i++) {
            var assignedCards = [];
            var playerObject = new Object();
            playerObject.player = this.state.numberOfPlayers[i];
            while (assignedCards.length < numberOfCards) {
                var card = this.generateCard();
                if (checkAssignedCards.indexOf(card) == "-1") {
                    assignedCards.push(card);
                    checkAssignedCards.push(card);
                }
            }
            playerObject.cards = assignedCards;
            var assignedCardsToPlayers = this.state.assignedCardsToPlayers;
            assignedCardsToPlayers.push(playerObject)
            this.setState(prevState => ({
                allAssignedCards: checkAssignedCards,
                assignedCardsToPlayers: assignedCardsToPlayers
            }))
        }

        this.setState({
            winners: {
                winnerCase: '',
                WinnerPlayers: []
            }
        });
    }

    generateCard() {
        var getRandomFaceIndex = this.getRandomIndex(0, (this.state.cards[0].faces.length - 1));
        var getRandomCardIndex = this.getRandomIndex(0, (this.state.cards[0].values.length - 1));
        var cards = this.state.cards[0];
        return cards.faces[getRandomFaceIndex] + "_" + cards.values[getRandomCardIndex] + "_" + cards.numericValues[getRandomCardIndex];
    }

    getRandomIndex(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    determineWinner() {
        var assignedCardsToPlayers = this.state.assignedCardsToPlayers;
        if (this.checkCase1(assignedCardsToPlayers).length != 0) {
            this.setState({
                winners: {
                    winnerCase: "1",
                    WinnerPlayers: this.checkCase1(assignedCardsToPlayers)
                }
            });
        } else if (this.checkCase2(assignedCardsToPlayers).length != 0) {
            this.setState({
                winners: {
                    winnerCase: "2",
                    WinnerPlayers: this.checkCase2(assignedCardsToPlayers)
                }
            });
        } else if (this.checkCase3(assignedCardsToPlayers).length != 0) {
            this.setState({
                winners: {
                    winnerCase: "3",
                    WinnerPlayers: this.checkCase3(assignedCardsToPlayers)
                }
            });
        } else if (this.checkCase4(assignedCardsToPlayers).length != 0) {
            this.setState({
                winners: {
                    winnerCase: "4",
                    WinnerPlayers: this.checkCase4(assignedCardsToPlayers)
                }
            });
        }
    }

    checkCase1(array) {
        //return arr.every(v => v === arr[0])
        var playersArray = [];
        array.map(cards => {
            var cardValueArray = [];
            cards.cards.map(card => {
                var cardAttributes = card.split('_');
                cardValueArray.push(cardAttributes[1]);
            });
            if (cardValueArray.every(v => v === cardValueArray[0])) {
                playersArray.push(cards.player);
            }
        })
        return playersArray;
    }

    checkCase2(array) {
        var playersArray = [];
        array.map(cards => {
            var indexArray = []
            cards.cards.map(card => {
                var cardAttributes = card.split('_');
                indexArray.push(Number(this.state.cards[0].values.indexOf(cardAttributes[1])));
            })
            indexArray.sort(function (a, b) { return a - b });
            if (!this.hasDuplicates(indexArray) && (Math.max(...indexArray) - Math.min(...indexArray)) + 1 == indexArray.length) {
                playersArray.push(cards.player);
            }
        });
        return playersArray;
    }

    hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }

    checkCase3(array) {
        var playersArray = [];
        array.map(cards => {
            var cardFaceArray = []
            cards.cards.map(card => {
                var cardAttributes = card.split('_');
                cardFaceArray.push(cardAttributes[1]);
            });
            for (var i = 0; i < cardFaceArray.length; i++) {
                if (cardFaceArray.filter(x => x == cardFaceArray[i]).length == 2) {
                    playersArray.push(cards.player)
                    break;
                }
            }
        });
        return playersArray;
    }

    checkCase4(totalArray) {
        var players = [];
        var topCardPLayersArray = [];

        totalArray.map(playerDetails => {
            var cards = playerDetails.cards;
            var topCard = 0;
            cards.map(card => {
                var cardAttributes = card.split('_');
                topCard += Number(cardAttributes[2])
            });

            var playerObject = new Object();
            playerObject.topCard = topCard;
            playerObject.player = playerDetails.player;
            players.push(playerObject)
        });

        var topCardValue = Math.max.apply(Math, players.map(function (o) { return o.topCard; }));
        players.map(playerDetails => {
            if (playerDetails.topCard == topCardValue) {
                topCardPLayersArray.push(playerDetails.player)
            }
        })

        return topCardPLayersArray;
    }

    playTieBreaker() {
        var winners = this.state.winners.WinnerPlayers;
        console.log(winners)
        var assignedCards = [];
        for (var i = 0; i < winners.length; i++) {
            var playerObject = new Object();
            playerObject.player = winners[i];
            playerObject.cards = [];
            assignedCards.push(playerObject);
        }

        this.setState({
            tieBreaker: true,
            allAssignedCards: [],
            assignedCardsToPlayers: assignedCards,
            numberOfPlayers: winners
        })

        this.assignCardsToPlayers(1);
    }

    async getTieBreakerResult() {
        var assignedCardsToPlayers = this.state.assignedCardsToPlayers;
        await this.setState({
            winners: {
                winnerCase: "4",
                WinnerPlayers: this.checkCase4(assignedCardsToPlayers)
            }
        });
        if (this.state.winners.WinnerPlayers.length == 1) {
            this.setState({
                tieBreaker: false
            })
        }
    }

    render() {
        return (
            <div className="container">
                <div class="btn-group d-flex mt-3" role="group">
                    <button type="button" className="btn btn-primary w-100" disabled={(this.state.assignedCardsToPlayers.length == 0 && this.state.winners.WinnerPlayers.length == 0) ? '' : this.state.winners.WinnerPlayers.length == 1 ? '' : 'disabled'} onClick={() => this.assignCardsToPlayers(this.state.numberOfCards)}>Generate Cards</button>
                    <button type="button" className="btn btn-primary w-100" onClick={this.determineWinner} disabled={(this.state.winners.WinnerPlayers.length == 0 && this.state.allAssignedCards.length != 0) ? this.state.tieBreaker ? 'disbaled' : '' : 'disabled'}>Determine Winner</button>
                    <button type="button" className="btn btn-primary w-100" onClick={this.playTieBreaker} disabled={this.state.winners.WinnerPlayers.length >> 1 ? '' : 'disabled'}>Play Tie Breaker</button>
                    <button type="button" className="btn btn-primary w-100" onClick={this.getTieBreakerResult} disabled={this.state.tieBreaker ? this.state.winners.WinnerPlayers.length == 1 ? 'disbaled' : '' : 'disabled'}>Get Tie Breaker Result</button>
                </div>
                <div className={`row ${this.state.winners.WinnerPlayers.length == 0 ? 'd-none' : ''}`}>
                    <div className="col-12">
                        <Winner winner={this.state.winners}></Winner>
                    </div>
                </div>
                <div className="row mb-3">
                    {
                        this.state.numberOfPlayers.map(player => {
                            return (
                                <Player player={player} winners={this.state.winners.WinnerPlayers} numberOfCards={this.state.numberOfCards} assignedCardsToPlayers={this.state.assignedCardsToPlayers[this.state.assignedCardsToPlayers.findIndex(x => x.player == player)]} key={player}></Player>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
