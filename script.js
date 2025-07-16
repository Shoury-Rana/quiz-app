let questions = []
let n = 0
let score = 0

fetch("ques.json")
.then(response => response.json())
.then(data => {
    questions = data
    main()
})

function displayQues(n) {
    const quest = questions[n]

    document.querySelector("#progress").textContent = `Question: ${n+1}/${questions.length}`
    
    document.getElementById("ques").textContent = quest["question"]
    document.querySelectorAll(".opt-btn").forEach((element, index) => {
        element.textContent = quest["options"][index]
    })

    document.querySelector("#next").hidden = true

    check(quest)
}

function check(quest) {
    let selectedID = null
    const buttons = document.querySelectorAll(".opt-btn")
    let correctAnswer = parseInt(quest["answer"])


    const oldSubmitButton = document.querySelector("#submit")
    const newSubmitButton = oldSubmitButton.cloneNode(true)
    oldSubmitButton.parentNode.replaceChild(newSubmitButton, oldSubmitButton)
    

    newSubmitButton.hidden = false
    newSubmitButton.disabled = true
    document.querySelector("#skip").hidden = false

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            selectedID = parseInt(button.id)
            newSubmitButton.disabled = false
        })
    })

    newSubmitButton.addEventListener("click", () => {
        newSubmitButton.hidden = true
        document.querySelector("#skip").hidden = true
        
        buttons.forEach((button) => {
            button.textContent = button.textContent.replace(/[✅❌⛔]/g, "").trim()
        })

        if (selectedID === correctAnswer) {
            score += 1
            buttons.forEach((button) => {
                if (parseInt(button.id) === selectedID) {
                    button.classList.add("correct")
                    button.textContent += "✅"
                } else {
                    button.classList.add("incorrect")
                    button.textContent += "❌"
                }
            })
        } else {
            score -= 1
            buttons.forEach((button) => {
                if (parseInt(button.id) === selectedID) {
                    button.classList.add("incorrect") 
                    button.textContent += "⛔"
                } else if (parseInt(button.id) === correctAnswer) {
                    button.classList.add("correct")
                    button.textContent += "✅"
                } else {
                    button.classList.add("incorrect")
                    button.textContent += "❌"
                }
            })
        }
        document.querySelector("#score").textContent = `Score: ${score}`
        document.querySelector("#next").hidden = false
    })
}

function nextQues() {
    if (n+1 >= questions.length) {
        document.querySelector("#end").textContent = "Quiz is completed."
        return;
    }
    
    buttons = document.querySelectorAll(".opt-btn")

    buttons.forEach((button) => {
        button.classList.remove("correct", "incorrect")
    })

    n += 1
    displayQues(n);
}

function main() {
    document.querySelectorAll("#next, #skip").forEach((el) => {
    el.addEventListener("click", () => nextQues())
    })

    displayQues(n)
}