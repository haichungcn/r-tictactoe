import React, {useState, useEffect} from 'react';
import FacebookLogin from 'react-facebook-login';
import './App.css';


function App() {
  const [board,setBoard] = useState(new Array(9).fill(null))
  const [isOver, setIsOver] = useState(false)
  const [winner, setWinner] = useState(null)
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState([]);
  const [winningPosition, setWinningPosition] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [highScrore, setHighScore] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const saveData = (user) => {
    localStorage.setItem('tictactoeUserData', JSON.stringify(user));
  }

  const getLocalData = () => {
    setCurrentUser(JSON.parse(localStorage.getItem('tictactoeUserData')));
  }

  const getHighScoreData = async () => {
    const response = await fetch('https://ftw-highscores.herokuapp.com/tictactoe-dev');
    const result = await response.json();
    result && setHighScore(result.items);
    console.log(result.items)
  }

  const updateHighScoreData = async () => {
    let data = new URLSearchParams();
    data.append('player', 'Look Mom, Im on the list');
    data.append('score', 999);
    const response = await fetch('https://ftw-highscores.herokuapp.com/tictactoe-dev', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data.toString(),
      json: true
    })
    console.log(response);
  }

  const update = setInterval(() => {
    setCurrentTime(new Date());
  }, 1 * 1000);

  useEffect(() => {
    getHighScoreData();
    currentUser && getLocalData();
  }, [])

  return (
    <div className="App">
      {!currentUser ?
      <FacebookLogin
        autoLoad={true}
        appId="2149880158452070"
        fields="name,email,picture"
        callback={(resp) => {
          setCurrentUser(resp);
          saveData(resp);
        }}
      />
      : <>
          <div id="infoContainer">
            <div>
              <textarea rows="20" cols="40">`Tic-tac-toe is a fun game that you can play any time and anywhere as long as you have a piece of paper, a pencil, and an opponent. Tic-tac-toe is a zero sum game, which means that if both players are playing their best, that neither player will win. However, if you learn how to play tic-tac-toe and master some simple strategies, then you'll be able to not only play, but to win the majority of the time. HISTORY: Games played on three-in-a-row boards can be traced back to ancient Egypt,[5] where such game boards have been found on roofing tiles dating from around 1300 BCE.[6]

An early variation of tic-tac-toe was played in the Roman Empire, around the first century BC. It was called terni lapilli (three pebbles at a time) and instead of having any number of pieces, each player only had three, thus they had to move them around to empty spaces to keep playing.[7] The game's grid markings have been found chalked all over Rome. Another closely related ancient game is three men's morris which is also played on a simple grid and requires three pieces in a row to finish,[8] and Picaria, a game of the Puebloans.

The different names of the game are more recent. The first print reference to "noughts and crosses" (nought being an alternative word for zero), the British name, appeared in 1858, in an issue of Notes and Queries.[9] The first print reference to a game called "tick-tack-toe" occurred in 1884, but referred to "a children's game played on a slate, consisting in trying with the eyes shut to bring the pencil down on one of the numbers of a set, the number hit being scored". "Tic-tac-toe" may also derive from "tick-tack", the name of an old version of backgammon first described in 1558. The US renaming of "noughts and crosses" as "tic-tac-toe" occurred in the 20th century.[10]

In 1952, OXO (or Noughts and Crosses), developed by British computer scientist Alexander S. Douglas for the EDSAC computer at the University of Cambridge, became one of the first known video games.[11][12] The computer player could play perfect games of tic-tac-toe against a human opponent.[11]

In 1975, tic-tac-toe was also used by MIT students to demonstrate the computational power of Tinkertoy elements. The Tinkertoy computer, made out of (almost) only Tinkertoys, is able to play tic-tac-toe perfectly.[13] It is currently on display at the Museum of Science, Boston.`</textarea>
            </div>
            <div id='info'>
              <h5>Let's play, {currentUser && currentUser.name}</h5>
              <p>{currentTime.toLocaleTimeString()}</p>
              <ul><strong>Highscore:</strong>
                {highScrore && highScrore.map(el => {return <li>{el.player} : {el.score && el.score}...</li>})}
              </ul>
              <button id='NGbutton' onClick={() => {
                setBoard(new Array(9).fill(null));
                setIsOver(false);
                setWinner(null);
                setMessage('');
                setHistory([]);
                setWinningPosition([]);
              }}>New Game</button>
            </div>
          </div>
          <div className='boardContainer'>
            <Board
            board={board}
            setBoard={setBoard}
            setIsOver={setIsOver}
            isOver={isOver}
            setWinner={setWinner}
            winner={winner}
            setMessage={setMessage}
            message={message}
            history={history}
            setHistory={setHistory}
            winningPosition={winningPosition}
            setWinningPosition={setWinningPosition}
            />
          </div>
          <ul><h3>History:</h3>
            {history && history.map((el,idx) => {
              return <li key={`history${idx}`} onClick={()=>{
                if(idx===history.length-1) return
                setBoard(history[idx]);
                setIsOver(false);
                setWinner(null);
                setMessage('');
                setHistory(history.filter((val,i) => i <= idx));
                setWinningPosition([]);
              }}>return to move {idx+1}</li>
            })}
          </ul>
        </>}
    </div>
  );
}

function Board (props) {
  let {board, setBoard, setIsOver, isOver, setWinner, setMessage, message, history, setHistory, winningPosition, setWinningPosition} = props;
  let newBoard = board.slice();
  let winningPattern = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [1,4,7],
    [0,3,6],
    [2,5,8],
    [0,4,8],
    [2,4,6] 
  ];
  let win = [];

  const handleClick = (idx) => {
    if(!isOver){
      let nullNumb = [];
      console.log('this is newBoard', newBoard);
      nullNumb = newBoard.filter(el => el === null).length;
      console.log(nullNumb%2)
      
      nullNumb !== 0 && newBoard[idx] === null ? (newBoard[idx] = (nullNumb % 2) ? 'X' : 'O') && setHistory([...history,newBoard]) : setIsOver = true;
      
      if (newBoard !== board) {
        setBoard(newBoard);
        makeDecision(nullNumb%2);
      }
    }
  }

  const makeDecision = (x) => {
    win = winningPattern.find(array => newBoard[array[0]] && newBoard[array[0]] === newBoard[array[1]] && newBoard[array[0]] === newBoard[array[2]]);
    if(win) {
      setWinner(newBoard[win[0]]);
      setIsOver(true);
      setMessage('THE WINNER IS ' + newBoard[win[0]] + ' 🎉');
      setWinningPosition(win);
    } else setMessage(`The next player is ${x === 0 ? 'X' : 'O'}`);
  }


  return (
    <div id='board'>
      {newBoard.map((el,idx) => {
        return <Square
          key={idx}
          idx={idx}
          el={el}
          handleClick={handleClick}
          id={`square${idx}`}
          winningPosition={winningPosition}
          />
      })}
      <h4>Message:<span className='message'>{message}</span></h4>
    </div>
  )
}

function Square (props) {
  return (
    <div className='square' style={props.winningPosition.includes(props.idx) ? {backgroundColor: 'rgb(250, 53, 53)'} : null} onClick={() => {props.handleClick(props.idx)}}>
        {props.el}
    </div>
  )
}


export default App;
