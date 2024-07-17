let currentPlayer = "";
let computerPlayer = "";
let playerScore = localStorage.getItem('playerScore') ? parseInt(localStorage.getItem('playerScore')) : 0;
let currentLevel = localStorage.getItem('currentLevel') || "easy";
const levelRewards = {
  easy: 200,
  medium: 400,
  hard: 600
};

function showLogin() {
  $('.login-container').show();
  $('.level-selector').hide();
  $('.initial-selector').hide();
  $('.gameboard').hide();
}

function showLevelSelector() {
  $('.login-container').hide();
  $('.level-selector').show();
}

function showSelector() {
  $('.gameboard').hide();
  $('.initial-selector').show();
}

function checkForVictory(currentSymbol) {
  var indices = [];
  var victory = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  $('.game-button').each(function(index) {
    if ($(this).html() == currentSymbol) {
      indices.push(index);
    }
  });

  if (indices.length > 2) {
    var victory_found = victory.map(function(victory_combo) {
      return ((indices.indexOf(victory_combo[0]) >= 0) && (indices.indexOf(victory_combo[1]) >= 0) && (indices.indexOf(victory_combo[2]) >= 0));
    });
    if (victory_found.indexOf(true) >= 0) return true;
    else if (indices.length < 5) return false;
    else {
      $('#message').text("Draw! Try again.");
      $('.game-button').off("click");
    }
  } else return false;
}

function computerTurn(computer_symbol) {
  var freeSquares = [];
  $('.game-button').each(function(index) {
    if ($(this).html() === "") freeSquares.push(index);
  });

  if (freeSquares.length > 0) {
    var randomIndex = Math.floor(Math.random() * freeSquares.length);
    $('#square' + freeSquares[randomIndex]).html(computer_symbol);
  }
}

function startGame(player_symbol, computer_symbol) {
  $('.gameboard').show();
  $('.initial-selector').hide();
  $('.game-button').click(function() {
    if ($(this).html() === "") {
      $(this).html(player_symbol);
      if (checkForVictory(player_symbol)) {
        $('#message').text("Victory!\nYou Won Player1!");
        playerScore += levelRewards[currentLevel];
        updateScore();
        $('.game-button').off("click");
      } else {
        computerTurn(computer_symbol);
        if (checkForVictory(computer_symbol)) {
          $('#message').text("Defeat! The Positronic Brain Wins!");
          $('.game-button').off("click");
        }
      }
    }
  });
}

function restartGame() {
  $('.game-button').off("click");
  $('.game-button').html("");
  $('#message').text(" Choose your weapon!");
  showSelector();
}

function updateScore() {
  $('#score').text(playerScore);
  localStorage.setItem('playerScore', playerScore);
}

function handleLogin() {
  const username = $('#username').val();
  const password = $('#password').val();

  // هنا يمكن إضافة طلب Ajax للتحقق من بيانات المستخدم من الخادم
  // إذا كانت بيانات المستخدم صحيحة، قم بإظهار اختيار المستوى
  if (username && password) { // للتحقق السريع بدون قاعدة بيانات
    showLevelSelector();
    $('#message').text("Welcome " + username + "! Choose your level.");
  } else {
    alert("Please enter a valid username and password.");
  }
}

$(document).ready(function() {
  showLogin();

  $('#login-button').click(function() {
    handleLogin();
  });

  $('.level-button').click(function() {
    currentLevel = $(this).hasClass('easy') ? 'easy' : $(this).hasClass('medium') ? 'medium' : 'hard';
    $('.container').removeClass('easy medium hard').addClass(currentLevel);
    localStorage.setItem('currentLevel', currentLevel);
    showSelector();
    $('#message').text("Level selected: " + currentLevel + ". Choose your weapon.");
  });

  var player_symbol = "";
  var computer_symbol = "";

  $('.weapon-button').click(function() {
    player_symbol = $(this).html();
    computer_symbol = player_symbol == "X" ? "O" : "X";
    $('#message').text("Your turn Player1");
    startGame(player_symbol, computer_symbol);
  });

  $('#restart-button').click(function() {
    restartGame();
  });

  // تحديث الرصيد عند تحميل الصفحة
  updateScore();
});
