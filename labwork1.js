function LabWork1() {

  let eps = 0.001
  let a = [[-3.17, 1, 0, 0, 0], [1, -2, 1, 0, 0], [0, 1, -2, 1, 0], [0, 0, 1, -2, 1], [0, 0, 0, 1, -3.17]]
  let b = [0, 1, 1, 1, 0]
  let x = [1, 1, 1, 1, 1]

  const labwork = document.getElementById('labwork1')
  createH2('Задание: ε = 0,001, метод - MI (простые итерации), q = -3.17, d = 1', labwork)
  createInput('Введите ε', labwork)
  createInput('Введите n', labwork)
  createButton('Подтвердить', 'submit', labwork)
  createButton('Тестовое задание', 'default', labwork)
  createBr(labwork)

  function createTables(n) {
    createBr(labwork)
    createBr(labwork)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        createInputSq(labwork)
      }
      createBr(labwork)
    }

    createBr(labwork)

    for (let i = 0; i < n; i++) {
      createInputSq(labwork)
      createBr(labwork)
    }
  }

  function printResult(size) {
    const results = new Map()
    let min = 666
    let minArrayResult = []
    for (let rel = 0.2; rel < 2; rel += 0.2) {
      let count = computing(size, rel)
      if (count < min) {
        min = count
        minArrayResult = x
      }
      results.set(rel.toFixed(1), count)
    }
    addResult(size, minArrayResult)
    const relaxations = Array.from(results.keys())
    const iterations = Array.from(results.values())
    let minIteration = iterations[0]
    let thisRelaxation = relaxations[0]
    for (let i = 1; i < 10; i++) {
      if (iterations[i] < minIteration) {
        minIteration = iterations[i]
        thisRelaxation = relaxations[i]
      }
    }

    createH2(`Вычисления завершены, количество итераций: ${results.get('1.0')}`, labwork)
    createH2(`Наилучший результат в
        <em>${minIteration}</em> итераций достигается при релаксации 
        <em>${thisRelaxation}</em>`, labwork)
    const canvas = document.createElement('canvas')
    labwork.append(canvas)

    Chart.defaults.global.defaultFontSize = 30
    const ctx = canvas.getContext('2d')
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: relaxations,
        datasets: [{
          label: 'итерации',
          data: iterations,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 3,
          pointRadius: 10,
          pointHoverRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true
          },
          yAxes: [{
            ticks: {
              fontSize: 20
            }
          }],
          xAxes: [{
            ticks: {
              fontSize: 20
            }
          }]
        }
      }
    })
  }

  document.getElementById('submit').addEventListener('click', (event) => {
    while(event.target.nextSibling) event.target.nextSibling.remove()
    const inputs = labwork.querySelectorAll('.task-input')
    eps = inputs[0].value
    const n = inputs[1].value
    createTables(n)

    const submitButton = createButton('Ввести', null, labwork)
    submitButton.addEventListener('click', () => {
      while(submitButton.nextSibling) submitButton.nextSibling.remove()
      a = []
      b = []
      const allInputs = labwork.querySelectorAll('.task-input-sq')
      let counter = 0
      for (let i = 0; i < n; i++) {
        a[i] = new Array(n)
        for (let j = 0; j < n; j++) {
          a[i][j] = allInputs[counter++].value
        }
      }
      for (let i = 0; i < n; i++) {
        b[i] = allInputs[counter++].value
      }
      createBr(labwork)
      createBr(labwork)
      printResult(n)
    })
  })

  document.getElementById('default').addEventListener('click', () => {
    const inputs = labwork.querySelectorAll('.task-input')
    inputs[0].value = ''
    inputs[1].value = ''
    createTables(5)
    const allInputs = labwork.querySelectorAll('.task-input-sq')
    let counter = 0
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        allInputs[counter++].value = a[i][j]
      }
    }
    for (let i = 0; i < 5; i++) {
      allInputs[counter++].value = b[i]
    }
    createBr(labwork)
    printResult(5)
  })

  function addResult(size, array) {
    for (let i = 0; i < size; i++) {
      createInputSq(labwork, array[i])
      createBr(labwork)
    }
  }

  function computing(size, rel = 1) {

    function complete(xOld, xNew) {
      // const subs = xNew.map((item, i) => item - xOld[i])
      // return Math.max(...subs) < eps
      let sumUp = 0, sumLow = 0
      for (let i = 0; i < size; i++) {
        sumUp += (xNew[i] - xOld[i]) ** 2
        sumLow += xNew[i] ** 2
      }
      return Math.sqrt(sumUp / sumLow) < eps
    }

    let count = 0
    x = []
    for (let i = 0; i < size; i++) x.push(0)

    do {
      const xPrev = x.slice(0)
      for (let i = 0; i < size; i++) {
        let sum = 0
        for (let j = 0; j < size; j++) {
          if (i !== j) sum += a[i][j] * x[j]
        }
        x[i] = (b[i] - sum) / a[i][i]
        x[i] = rel * x[i] + (1-rel) * xPrev[i] // релаксация
      }
      count++
      if (complete(xPrev, x)) break;
    } while (count < 666)
    return count
  }
}