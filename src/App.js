import React, { useState, useEffect } from 'react';
import FacebookLogin from 'react-facebook-login';
import './App.css';


function App() {
  const [board, setBoard] = useState(new Array(9).fill(null))
  const [isOver, setIsOver] = useState(false)
  const [winner, setWinner] = useState(null)
  const [message, setMessage] = useState([`let's start with X!`])
  const [history, setHistory] = useState([]);
  const [winningPosition, setWinningPosition] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [highScrore, setHighScore] = useState(null);

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
    // console.log(result.items)
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
    // console.log(response);
  }


  useEffect(() => {
    getHighScoreData();
    currentUser && getLocalData();
  }, [])

  console.log(currentUser)

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
          <div id="leftContainer">
            <div id='title'>
              <h2><a href="https://en.wikipedia.org/wiki/Tic-tac-toe" target="_blank">TIC-TXC-TOE</a></h2>
              <small> by <a href="https://github.com/haichungcn/" target="_blank">Hai Chung</a></small>
            </div>
            <h3>Highscore:</h3>
            <div id='hcContainer'>
              <ol id='hc'>
                {highScrore && highScrore.map((el, idx) => { return <li key={`hs${idx}`}>{el.player} <br />: {el.score && el.score}...</li> })}
              </ol>
            </div>
          </div>
          <div id='MidContainer'>
            <div id='info'>
              <img src={currentUser.picture.data.url} alt='avatar' /><h5> Let's play, {currentUser && currentUser.name}</h5>
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
          </div>
          <div id='rightContainer'>
            <button id='NGbutton' onClick={() => {
              setBoard(new Array(9).fill(null));
              setIsOver(false);
              setWinner(null);
              setMessage([`let's start with X!`]);
              setHistory([]);
              setWinningPosition([]);
            }}>New Game</button>
            <ul><h3>History:</h3>
              {history && history.map((el, idx) => {
                return <li key={`history${idx}`} onClick={() => {
                  if (idx === history.length - 1) return
                  setBoard(history[idx]);
                  setIsOver(false);
                  setWinner(null);
                  setMessage(message.filter((val, i) => i <= idx + 1));
                  setHistory(history.filter((val, i) => i <= idx));
                  setWinningPosition([]);
                }}>return to move {idx + 1}</li>
              })}
            </ul>
          </div>
        </>}
    </div>
  );
}

function Board(props) {
  let { board, setBoard, setIsOver, isOver, setWinner, setMessage, message, history, setHistory, winningPosition, setWinningPosition } = props;
  let newBoard = board.slice();
  let winningPattern = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [1, 4, 7],
    [0, 3, 6],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  let win = [];

  const handleClick = (idx) => {
    if (!isOver) {
      let nullNumb = [];
      let isPlayed = false;
      // console.log('this is newBoard', newBoard);
      nullNumb = newBoard.filter(el => el === null).length;
      // console.log(nullNumb%2)
      if (nullNumb !== 0 && newBoard[idx] === null) {
        newBoard[idx] = (nullNumb % 2) ? 'X' : 'O';
        setHistory([...history, newBoard]);
        isPlayed = true;
      } else setIsOver(true);
      // console.log(isPlayed)
      if (isPlayed && newBoard !== board) {
        setBoard(newBoard);
        makeDecision(nullNumb);
      }
    }
  }

  const makeDecision = (x) => {
    win = winningPattern.find(array => newBoard[array[0]] && newBoard[array[0]] === newBoard[array[1]] && newBoard[array[0]] === newBoard[array[2]]);
    if (win) {
      setWinner(newBoard[win[0]]);
      setIsOver(true);
      setMessage(message.concat('THE WINNER IS ' + newBoard[win[0]] + ' 🎉'));
      setWinningPosition(win);
    } else x <= 1 ? setMessage(message.concat(`It's a draw!`)) : setMessage(message.concat(`The next player is ${x % 2 === 0 ? 'X' : 'O'}`));
  }

  return (
    <div id='board'>
      {newBoard.map((el, idx) => {
        return <Square
          key={idx}
          idx={idx}
          el={el}
          handleClick={handleClick}
          id={`square${idx}`}
          color={el === 'X' ? 'X' : 'O'}
          winningPosition={winningPosition}
        />
      })}
      <h4 id="message">Message: <span className='message'>{message[message.length - 1]}</span></h4>
    </div>
  )
}

function Square(props) {
  return (
    <div className={`square ${props.color}`} style={props.winningPosition.includes(props.idx) ? { backgroundColor: 'rgb(250, 53, 53)' } : null} onClick={() => { props.handleClick(props.idx) }}>
      {props.el}
    </div>
  )
}


export default App;
