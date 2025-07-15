const imageMap = {
  dot: "images/dot.jpg",
  one: "images/one.jpg",
  two: "images/two.jpg",
  three: "images/three.jpg",
  four: "images/four.jpg",
  five: "images/five.jpg",
  six: "images/six.jpg",
  hitWicket: "images/hitWicket.jpg",
  logo: "images/logo.jpg",
};

const wordToNumber = {
  dot: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
};

let userScore = 0;
let computerScore = 0;
let inning = 1;
let welcome = document.querySelector(".welcome");
let startToss = document.querySelector(".startToss");
let tossButtons = document.querySelectorAll(".toss");
let tossDecision = document.getElementById("tossDecision");

// Toss Logic
const getComputerChoice = () => {
  const options = ["Head", "Tail"];
  return options[Math.floor(Math.random() * options.length)];
};

const determineWinner = (user, computer) => {
  return user === computer ? "user" : "computer";
};

const updateUI = (winner) => {
  welcome.classList.add("hidden");

  startToss.innerHTML = "";

  if (winner === "computer") {
    tossDecision.innerHTML = `You lose the toss. You have to bowl first.`;
    tossDecision.className = "text-red-700 font-bold text-lg text-center mt-4";
    startCricket("Bowling", 1);
    let final = document.getElementById("resultMsg");
    final.classList.remove("hidden");
  } else {
    tossDecision.innerHTML = `
      <div class="mt-6 flex flex-col items-center justify-center">
        <p class="text-xl font-bold pb-3">You won the toss! Choose:</p>
        <div class="grid grid-cols-2 gap-4">
          <button id="Bat" class="chooseInning bg-green-200 hover:bg-green-600 hover:text-white p-3 rounded-xl font-bold">Bat First</button>
          <button id="Bowl" class="chooseInning bg-green-200 hover:bg-green-600 hover:text-white p-3 rounded-xl font-bold">Bowl First</button>
        </div>
      </div>
    `;

    document.querySelectorAll(".chooseInning").forEach((btn) => {
      btn.addEventListener("click", () => {
        const choice = btn.getAttribute("id");
        tossDecision.innerHTML = `You have elected to ${choice === "Bat" ? "bat" : "bowl"} first.`;
        startCricket(choice === "Bat" ? "Batting" : "Bowling", 1);
        let final = document.getElementById("resultMsg");
       final.classList.remove("hidden");
      });
    });
  }
}
// Core Game Function (Your Logic Preserved)
function startCricket(mode, inningNum) {
  let out = false;
  inning = inningNum;

  const battingUI = document.getElementById("BattingInterface");
  const bowlingUI = document.getElementById("BowlingInterface");
  const resultMsg = document.getElementById("result-message");

  // Show correct interface
  if (mode === "Batting") {
    battingUI.classList.remove("hidden");
    bowlingUI.classList.add("hidden");
  } else {
    bowlingUI.classList.remove("hidden");
    battingUI.classList.add("hidden");
  }

  // Clear previous message
  document.getElementById("vs-container").innerHTML = "";
  resultMsg.textContent = "";

  const getRandomRun = () => {
    const options = ["one", "two", "three", "four", "five", "six"];
    return options[Math.floor(Math.random() * options.length)];
  };

  // Remove all previous click listeners to avoid duplicates
  document.querySelectorAll(".choice1").forEach((btn) => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });

  document.querySelectorAll(".choice1").forEach((btn) => {
    btn.addEventListener("click", () => {
      const userChoice = btn.getAttribute("id");
      const computerChoice = getRandomRun();

      document.getElementById("vs-container").innerHTML = `
        <div class="text-lg font-bold">You: <img src="${imageMap[userChoice]}" class="inline-block h-10" /></div>
        <div class="text-lg font-bold">Computer: <img src="${imageMap[computerChoice]}" class="inline-block h-10" /></div>
      `;
      
      // OUT Conditions
      if (userChoice === "hitWicket" || userChoice === computerChoice) {
        resultMsg.textContent = "OUT!";
        out = true;
      } else {
        const run = wordToNumber[userChoice] || 0;
        const computerRun = wordToNumber[computerChoice] || 0;
        if (mode === "Batting") {
          userScore += run;
          document.getElementById("player-score").textContent = userScore;
          resultMsg.textContent = `You scored ${run} run(s)!`;
        } else {
          computerScore += computerRun;
          document.getElementById("computer-score").textContent = computerScore;
          resultMsg.textContent = `Computer scored ${computerRun} run(s)!`;
        }
      }

      // Handle OUT
   if (out) {
  if (inning === 1) {
    // 🔊 Play music before second innings
    const music = document.getElementById("inningsMusic");
    music.currentTime = 0;
    music.play();
    battingUI.classList.add("hidden");
    bowlingUI.classList.add("hidden");
    // ⏱ Delay next innings start so music plays a bit
    setTimeout(() => {
      if (mode === "Batting") {
        startCricket("Bowling", 2);
      } else {
        startCricket("Batting", 2);
      }
    }, 6000); // 6 seconds delay
  } else {
    // Match ends
    document.getElementById("BattingInterface").classList.add("hidden");
    document.getElementById("BowlingInterface").classList.add("hidden");
    tossDecision.innerHTML =``;
    document.getElementById("vs-container").innerHTML =`` ;

    if (userScore > computerScore) {
      resultMsg.textContent = "🎉 You won the match!";
      document.getElementById("gamewon").play();
    } else if (userScore < computerScore) {
      resultMsg.textContent = "😢 Computer won the match!";
      document.getElementById("gameover").play();

    } else {
      resultMsg.textContent = "🤝 It's a tie!";
    }
  }
}

    });
  });
}

// Toss Play Trigger
const playGame = (userChoice) => {
  const computerChoice = getComputerChoice();
  const winner = determineWinner(userChoice, computerChoice);
  updateUI(winner);
};

// Toss Buttons
tossButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    playGame(btn.id);
  });
});

// Reset Button
document.querySelector(".reset").addEventListener("click", () => {
  location.reload();
});
