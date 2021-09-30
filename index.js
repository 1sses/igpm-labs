function main() {
  document.getElementById('nav').addEventListener('click', (event) => {
    const main = document.getElementById('main')
    const labworks = main.childNodes
    labworks.forEach(section => {
      while (section.firstChild) section.firstChild.remove()
    })
    switch (event.target.innerHTML[2]) {
      case '1':
        LabWork1()
        break
      case '2':
        Labwork2()
        break
      case '3':
        Labwork3()
        break
      case '4':
        Labwork4()
        break
      case '5':
        LabWork5()
        break
      case '6':
        Labwork6()
        break
    }
  })
}

main()