import React, {useState} from 'react';
import './App.css';


function App() {
  const [board,setBoard] = useState(new Array(9).fill(null))
  const [isOver, setIsOver] = useState(false)
  const [winner, setWinner] = useState(null)
  const [message, setMessage] = useState('')
  const [winStyle, setWinStyle] = useState({});
  const [history, setHistory] = useState([]);
  const [winningPosition, setWinningPosition] = useState([]);

  return (
    <div className="App">
      <button id='NGbutton' onClick={() => {
        setBoard(new Array(9).fill(null));
        setIsOver(false);
        setWinner(null);
        setMessage('');
        setWinStyle({});
        setHistory([]);
        setWinningPosition([]);
      }}>New Game</button>
      <Board
      board={board}
      setBoard={setBoard}
      setIsOver={setIsOver}
      isOver={isOver}
      setWinner={setWinner}
      winner={winner}
      setMessage={setMessage}
      message={message}
      winStyle={winStyle}
      setWinStyle={setWinStyle}
      history={history}
      setHistory={setHistory}
      winningPosition={winningPosition}
      setWinningPosition={setWinningPosition}
      />
      <ul><h3>History:</h3>
        {history && history.map((el,idx) => {
          return <li key={`history${idx}`} onClick={()=>{
            setBoard(history[idx]);
            setIsOver(false);
            setWinner(null);
            setMessage('');
            setWinStyle({});
            setHistory(history.filter((val,i) => i <= idx));
            setWinningPosition([]);
          }}>return to move {idx+1}</li>
        })}
        
      </ul>
    </div>
  );
}

function Board (props) {
  let {board, setBoard, setIsOver, isOver, setWinner, winner, setMessage, message, winStyle, setWinStyle, history, setHistory, winningPosition, setWinningPosition} = props;
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
        makeDecision();
      }
    }
  }

  const makeDecision = () => {
    win = winningPattern.find(array => newBoard[array[0]] && newBoard[array[0]] === newBoard[array[1]] && newBoard[array[0]] === newBoard[array[2]]);
    if(win) {
      setWinner(newBoard[win[0]]);
      setIsOver(true);
      setMessage('THE WINNER IS ' + newBoard[win[0]] + '🎉');
      setWinStyle({
        backgroundColor: 'rgb(250, 53, 53)'
      });
      setWinningPosition(win);
    } 
  }


  return (
    <div id='board'>
      {newBoard.map((el,idx) => {
        if (winningPosition.includes(idx)) {
          return <Square
            key={idx}
            idx={idx}
            el={el}
            handleClick={handleClick}
            id={`square${idx}`}
            winStyle={winStyle}
            />
        } else return <Square
          key={idx}
          idx={idx}
          el={el}
          handleClick={handleClick}
          id={`square${idx}`}
          />
      })}
      <h4>Message:<span className='message'>{message}</span></h4>
    </div>
  )
}

function Square (props) {
  return (
    <div className='square' style={props.winStyle} onClick={() => {props.handleClick(props.idx)}}>
        {props.el}
    </div>
  )
}


export default App;
