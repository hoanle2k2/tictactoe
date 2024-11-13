import { useState } from 'react'
import './App.css'

function Square({ value, onSquareClick }: { value: string, onSquareClick: () => void }) {
  return (
    <div className='square' onClick={onSquareClick}>
      {value}
    </div>
  )
}

function App() {
  const [currentPlayer, setCurrentPlayer] = useState(true)
  const [squares, setSquares] = useState(Array(9).fill(null))

  let gameStatus: number
  let gameStatusTitle: string

  if (calculateWinner(squares)) {
    gameStatus = 1
    gameStatusTitle = `Winner: ${calculateWinner(squares)}`
  }
  else if (squares.every(v => v != null)) {
    gameStatus = 0
    gameStatusTitle = 'Draw'
  }
  else {
    gameStatus = 2
    gameStatusTitle = `Player: ${currentPlayer ? 'X' : 'O'}`
  }


  const handleClick = (i: number) => {
    const currentSquares = squares.slice()
    console.log(calculateWinner(squares));

    if (squares[i] || calculateWinner(squares)) {
      return
    }
    if (currentPlayer) {
      currentSquares[i] = 'X'
      setSquares(currentSquares)
      setCurrentPlayer(false)
    }

    setTimeout(() => {
      const aiMove = findBestMove(currentSquares)
      if (aiMove !== null) {
        const aiSquares = currentSquares.slice()
        aiSquares[aiMove] = 'O'
        setSquares(aiSquares)
        setCurrentPlayer(true)
      }
    }, 1000);
  }

  return (
    <div className='app'>
      <div className='board-game'>
        <div className='game-status'>
          {gameStatus !== 2 && (
            <button className='restart-button' onClick={() => {
              setSquares(Array(9).fill(null))
              setCurrentPlayer(true)
            }}
            >
              Restart game
            </button>
          )}
          <div className='game-status-title'>{gameStatusTitle}</div>
        </div>

        <div className='board-row'>
          {
            squares?.map((value: string, index: number) => (
              <Square key={index} value={value} onSquareClick={() => handleClick(index)} />
            ))
          }
        </div>
      </div>
    </div>
  )
}
export default App

const calculateWinner = (squares: (null | string)[]) => {
  const winLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const line of winLines) {
    const [cel1, cel2, cel3] = line
    if (squares[cel1] && squares[cel1] == squares[cel2] && squares[cel2] == squares[cel3]) {
      return squares[cel1]
    }
  }
  return null
}

function minimax(squares: (string | null)[], depth: number, isMaximizing: boolean) {
  const winner = calculateWinner(squares)

  if (winner === 'O') return 10 - depth
  if (winner === 'X') return depth - 10
  if (squares.every(square => square !== null)) return 0

  if (isMaximizing) {
    let bestScore = -Infinity
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        const score = minimax(squares, depth + 1, false)
        squares[i] = null
        bestScore = Math.max(score, bestScore)
      }
    }
    return bestScore
  } else {
    let bestScore = Infinity
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = 'X'
        const score = minimax(squares, depth + 1, true)
        squares[i] = null
        bestScore = Math.min(score, bestScore)
      }
    }
    return bestScore
  }
}

function findBestMove(squares: (null | string)[]) {
  let bestScore = -Infinity
  let bestMove = null

  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      squares[i] = 'O'
      const score = minimax(squares, 0, false)
      squares[i] = null

      if (score > bestScore) {
        bestScore = score
        bestMove = i
      }
    }
  }
  return bestMove
}
