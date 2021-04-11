

$(".btn").hide()
$(".easy").click(easyGame)
$(".hard").click(hardGame)

// EASY GAME //

function easyGame(){
    
    $(".difficulty").hide()
    $(".btn").show()

    var gamePattern = []
    var playerClicks = []
    var roundNumber = 1
    var numOfClicks = 0
    var gamePatternSlice = gamePattern.slice(0, numOfClicks)
    let aniSpeed = 400
    let gameSpeed = 356.1426/(1 + Math.pow((roundNumber/3.595134), 4.73491)) + 382.4997  
    console.log(gamePatternSlice)
    const sleep = (time) => {
        return new Promise((resolve) => {
            return setTimeout(function () {
                resolve()
            }, time)
        })
    }

    function nextSequence() {
        if (gamePattern.length < 1){
        var randomNum = Math.floor(Math.random() * 4)
        var buttonColors = ["Do", "Mi", "So", "highDo"]
        var randomChosenColor = buttonColors[randomNum]
        gamePattern.push(randomChosenColor)
        return gamePattern    
        }
        else {
        var randomNum = Math.floor(Math.random() * 8)
        var buttonColors = ["Do", "Re", "Mi", "Fa", "So", "La", "Ti", "highDo"]

        var randomChosenColor = buttonColors[randomNum]

        gamePattern.push(randomChosenColor)
        return gamePattern
        }
    }

    nextSequence()
    console.log(gamePattern)


    async function simonGame() {
        $("h1").text("Round " + roundNumber)
        for (var i = 0; i < gamePattern.length; i++){
            await sleep(gameSpeed)
            console.log(gamePattern[i])
            $("." + gamePattern[i]).animate({opacity: .1}, aniSpeed).animate({opacity: 1}, aniSpeed)
            var audioObj = new Audio("sounds/sine/" + gamePattern[i] + ".mp3")
            audioObj.play()


        }
        
    }
    simonGame()


    $(".btn").click(function (){
        numOfClicks++    
        playerClicks.push(this.id)
        gameSpeed = 356.1426/(1 + Math.pow((roundNumber/3.595134), 4.73491)) + 382.4997   
        
        var audioObj = new Audio("sounds/sine/" + this.id + ".mp3")
        

        // don't want audio to play if game over
        gamePatternSlice = gamePattern.slice(0, numOfClicks)  
        if (numOfClicks > 0 && JSON.stringify(playerClicks)==JSON.stringify(gamePatternSlice)){
            audioObj.play()
            $(this).animate({opacity: .1}, aniSpeed).animate({opacity: 1}, aniSpeed)  
        }


        if (numOfClicks > 0 && JSON.stringify(playerClicks)==JSON.stringify(gamePatternSlice) &&
        JSON.stringify(playerClicks)==JSON.stringify(gamePattern)) {
            roundNumber++
            aniSpeed = ((120/(.5 * roundNumber)) + 100)     
                    
            setTimeout(function() {
            $("h1").text("Round " + roundNumber)
            nextSequence()
            simonGame()
            console.log(gamePattern)
            playerClicks = []
            numOfClicks = 0
            }, 1000)
        }
        else if (numOfClicks > 0 && JSON.stringify(playerClicks)!=JSON.stringify(gamePatternSlice)){
            $("h1").text("GAME OVER")
            $("body").css("background-color", "red")
            var audioObj = new Audio("sounds/wrong.mp3")
            audioObj.play()
            $(".btn").hide()
            $("#high-score").html("Easy Mode High Score!<p>" + (roundNumber - 1) + "</p>")
            $("#high-score").show()
            setTimeout(function (){
                $("#restart").text("Press any key to restart!").show()
            }, 1000)
            document.addEventListener("keydown", function (){
                location.reload()
            })

        }
    })
}


//HARD GAME//

function hardGame(){

    $(".difficulty").hide()
    $(".btn").show()

    var gamePattern = []
    var playerClicks = []
    var roundNumber = 1
    var numOfClicks = 0
    var gamePatternSlice = gamePattern.slice(0, numOfClicks)
    let aniSpeed = 400
    let gameSpeed = 356.1426/(1 + Math.pow((roundNumber/3.595134), 4.73491)) + 382.4997  
    console.log(gamePatternSlice)
    const sleep = (time) => {
        return new Promise((resolve) => {
            return setTimeout(function () {
                resolve()
            }, time)
        })
    }

    function nextSequence() {
        if (gamePattern.length < 1){
        var randomNum = Math.floor(Math.random() * 2)
        var buttonColors = ["Do", "highDo"]
        var randomChosenColor = buttonColors[randomNum]
        gamePattern.push(randomChosenColor)
        return gamePattern    
        }
        else {
        var randomNum = Math.floor(Math.random() * 8)
        var buttonColors = ["Do", "Re", "Mi", "Fa", "So", "La", "Ti", "highDo"]

        var randomChosenColor = buttonColors[randomNum]

        gamePattern.push(randomChosenColor)
        return gamePattern
        }
    }

    nextSequence()
    console.log(gamePattern)


    async function simonGame() {
        $(".btn").animate({opacity: .1})
        $("h1").text("Round " + roundNumber)
        for (var i = 0; i < gamePattern.length; i++){
            await sleep(gameSpeed)
            console.log(gamePattern[i])
        
            var audioObj = new Audio("sounds/sine/" + gamePattern[i] + ".mp3")
            audioObj.play()


        }
        $(".btn").animate({opacity: 1})       
    }

    simonGame()
    $(".btn").show()


    $(".btn").click(function (){
        numOfClicks++    
        playerClicks.push(this.id)
        gameSpeed = 356.1426/(1 + Math.pow((roundNumber/3.595134), 4.73491)) + 382.4997   
        
        var audioObj = new Audio("sounds/sine/" + this.id + ".mp3")
        

        // don't want audio to play if game over
        gamePatternSlice = gamePattern.slice(0, numOfClicks)  
        if (numOfClicks > 0 && JSON.stringify(playerClicks)==JSON.stringify(gamePatternSlice)){
            audioObj.play()
            $(this).animate({opacity: .1}, aniSpeed).animate({opacity: 1}, aniSpeed)  
        }


        if (numOfClicks > 0 && JSON.stringify(playerClicks)==JSON.stringify(gamePatternSlice) &&
        JSON.stringify(playerClicks)==JSON.stringify(gamePattern)) {
            roundNumber++
            aniSpeed = ((120/(.5 * roundNumber)) + 100)     
            setTimeout(function() {
            $("h1").text("Round " + roundNumber)
            nextSequence()
            simonGame()
            console.log(gamePattern)
            playerClicks = []
            numOfClicks = 0
            }, 1000)
        }
        else if (numOfClicks > 0 && JSON.stringify(playerClicks)!=JSON.stringify(gamePatternSlice)){
            $("body").css("background-color", "red")
            var audioObj = new Audio("sounds/wrong.mp3")
            audioObj.play()
            $(".btn").hide()
            $("#high-score").html("Hard Mode High Score!<p>" + (roundNumber - 1) + "</p>")
            $("#high-score").show()
            setTimeout(function (){
                $("#restart").text("Press any key to restart!").show()
            }, 1000)
            document.addEventListener("keydown", function (){
                location.reload()
            })

        }
    })
}
