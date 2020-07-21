import React, { Component } from 'react'
const baseUrl = "../images/";
export default class player extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="col-6 mt-2">
                <div className="row">
                    <div className="col-12">
                        <div className="disabledOverlay" style={{ display: (this.props.winners.indexOf(this.props.player) == -1 && this.props.winners.length != 0) ? 'block' : 'none' }}></div>
                        <h5 className="text-center">Player : {this.props.player}</h5>
                    </div>
                    <div className="col-12 d-flex justifyContentCenter">
                        <div className="disabledOverlay" style={{ display: (this.props.winners.indexOf(this.props.player) == -1 && this.props.winners.length != 0) ? 'block' : 'none' }}></div>
                        {
                            this.props.assignedCardsToPlayers == undefined
                                ? ''
                                : this.props.assignedCardsToPlayers.cards.map((card, index) => {
                                    var cardAttributes = card.split('_');
                                    var imageName = baseUrl + cardAttributes[0] + ".png";
                                    return (
                                        <div className="card playerCard" key={index} style={{ width: (100 / this.props.numberOfCards) + "%" }}>
                                            <div className="card-body">
                                                <div className="topLeftPosition">
                                                    <img src={require(`../images/` + cardAttributes[0] + `.png`)} className="img-fluid cardFace"></img>
                                                    <p className="text-center font-weight-bold">{cardAttributes[1]}</p>
                                                </div>
                                                <img src={require(`../images/` + cardAttributes[0] + `.png`)} className="img-fluid cardFace"></img>
                                                <div className="bottomRightPosition">
                                                    <img src={require(`../images/` + cardAttributes[0] + `.png`)} className="img-fluid cardFace"></img>
                                                    <p className="text-center m-0 font-weight-bold">{cardAttributes[1]}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                        }
                    </div>
                </div >
            </div>
        )
    }
}
