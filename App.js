import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";

export default function App() {
  const [player, setPlayer] = useState(""); // X or O
  const [cpu, setCpu] = useState("");
  const [board, setBoard] = useState(Array(9).fill(""));
  const [gameActive, setGameActive] = useState(false);
  const [yourScore, setYourScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [result, setResult] = useState("");

  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // choose X
  const theX = () => {
    setPlayer("X");
    setCpu("O");
    startGame();
  };

  // choose O
  const theO = () => {
    setPlayer("O");
    setCpu("X");
    startGame();
  };

  const startGame = () => {
    setBoard(Array(9).fill(""));
    setResult("");
    setGameActive(true);
  };

  const handleMove = (index) => {
    if (!gameActive || board[index] !== "") return;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    if (checkWinner(newBoard, player)) {
      setYourScore((prev) => prev + 1);
      endGame("YOU WIN!");
      return;
    }

    if (isDraw(newBoard)) {
      endGame("DRAW");
      return;
    }

    setTimeout(() => cpuPlay(newBoard), 600);
  };

  const cpuPlay = (currentBoard) => {
    if (!gameActive) return;

    const emptyIndices = currentBoard
      .map((val, i) => (val === "" ? i : null))
      .filter((i) => i !== null);

    // Try to win
    for (let i of emptyIndices) {
      const testBoard = [...currentBoard];
      testBoard[i] = cpu;
      if (checkWinner(testBoard, cpu)) {
        finalizeMove(testBoard, i);
        setCpuScore((prev) => prev + 1);
        endGame("CPU WINS!");
        return;
      }
    }

    // Block player
    for (let i of emptyIndices) {
      const testBoard = [...currentBoard];
      testBoard[i] = player;
      if (checkWinner(testBoard, player)) {
        const blockBoard = [...currentBoard];
        blockBoard[i] = cpu;
        finalizeMove(blockBoard, i);
        return;
      }
    }

    // Random move
    const randomIndex =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...currentBoard];
    newBoard[randomIndex] = cpu;
    finalizeMove(newBoard, randomIndex);
  };

  const finalizeMove = (newBoard, index) => {
    setBoard(newBoard);

    if (checkWinner(newBoard, cpu)) {
      setCpuScore((prev) => prev + 1);
      endGame("CPU WINS!");
    } else if (isDraw(newBoard)) {
      endGame("DRAW");
    }
  };

  const checkWinner = (board, mark) => {
    return winCombos.some((combo) =>
      combo.every((index) => board[index] === mark)
    );
  };

  const isDraw = (board) => {
    return board.every((cell) => cell !== "");
  };

  const endGame = (message) => {
    setResult(message);
    setGameActive(false);

    // restart after 1s
    setTimeout(() => {
      startGame();
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {!gameActive && player === "" ? (
        <>
          <Text style={styles.header}>Tik-Tak-Toe</Text>
          <Text style={styles.subheading}>Choose X or O</Text>
          <View style={styles.buttons}>
            <View style={styles.box}>
              <Button title="X" onPress={theX} />
            </View>
            <View style={styles.box}>
              <Button title="O" onPress={theO} />
            </View>
          </View>
        </>
      ) : (
        <>
          {/* Scores */}
          <View style={styles.scores}>
            <Text style={styles.myScore}>CPU: {cpuScore}</Text>
            <Text style={styles.YourScore}>YOU: {yourScore}</Text>
          </View>

          {/* Game board */}
          <View style={styles.TikTakToe}>
            {board.map((value, index) => (
              <TouchableOpacity
                key={index}
                style={styles.square}
                onPress={() => handleMove(index)}
                disabled={value !== "" || !gameActive}
              >
                <Text style={styles.mark}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Result */}
          {result !== "" && <Text style={styles.result}>{result}</Text>}
        </>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Montserrat",
  },
  header: {
    fontSize: 30,
    marginBottom: 20,
  },
  subheading: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 220,
    marginVertical: 10,
  },
  scores: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    marginVertical: 10,
  },
  myScore: {
    fontSize: 18,
    color: "blue",
  },
  YourScore: {
    fontSize: 18,
    color: "green",
  },
  box: {
    width: 90,
    height: 90,
    borderWidth: 1.5,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    color: "black",
  },
  TikTakToe: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 180,
    height: 180,
    marginVertical: 20,
  },
  square: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  mark: {
    fontSize: 26,
    fontWeight: "bold",
  },
  result: {
    fontSize: 28,
    color: "black",
    marginVertical: 20,
    textAlign: "center",
  },
});
