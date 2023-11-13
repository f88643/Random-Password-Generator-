const express = require("express")
const { engine } = require("express-handlebars")
const app = express()
const port = 3000

app.engine(".hbs", engine({ extname: ".hbs" }))
app.set("view engine", ".hbs")
app.set("views", "./views")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: false })); //解析POST請求

let password = ""
const listNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const listLow = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
const listUpp = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
const listSym = ["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "{", "}", ":", "?", ">", "<", "`", "/", ".", ",", ";", "]", "["];
let filteredList = []
let list = []
app.get("/", (req, res) => {
  res.render("index")
})

app.post("/codePage", (req, res) => {
  let info = req.body
  checkIfEmpty(info)
  res.render("codePage", { password, info })
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})

function checkIfEmpty(info) {
  const numValues = Object.values(info)
  for (let i = 0; i < numValues.length; i++) {
    if (!numValues[i]) {
      password = "You must select at least one character set"
    }
    else if (numValues[i]) {
      genNum(info)
      return;
    }
  }
}

function genNum(info) {
  list = []
  password = ''
  if (!info.inputPasswordLength) {
    password = "Please input Password Length"
    return;
  }
  if (info.lowerCase) {
    list.push(...listLow)
  }
  if (info.upperCase) {
    list.push(...listUpp)
  }
  if (info.number) {
    list.push(...listNum)
  }
  if (info.symbol) {
    list.push(...listSym)
  }
  if (list.length === 0) {
    password = "You must select at least one character set"
    return;
  }
  for (let z = 0; z < info.excludeCharacters.length; z++) {
    filteredList = list.filter(item => item != info.excludeCharacters[z]);
    list = filteredList
  }


  if (info.inputPasswordLength) {
    for (let x = 0; x < info.inputPasswordLength; x++) {
      let newNum = Math.floor(Math.random() * list.length)
      password += list[newNum]
    }
  }


}
