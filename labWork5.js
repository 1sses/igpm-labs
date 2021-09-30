function LabWork5() {

  let start, end
  let eps
  let a, b
  let y

  let xArr
  let yArr

  const labwork = document.getElementById('labwork5')

  createH2('Задание: xsin(x)-10sin^2(x), [-6;3], золотое сечение', labwork)
  createInput('Введите функцию', labwork)
  createInput('Введите a', labwork)
  createInput('Введите b', labwork)
  createInput('Введите α', labwork)
  createInput('Введите β', labwork)
  createInput('Введите eps', labwork)
  const submitButton = createButton('Подтвердить', 'submit', labwork)
  const defaultButton = createButton('Тестовое', 'default', labwork)


  const genMin = (X, minX, foo) => {
    const result = []
    for (let i = 0; i < X.length; i++) {
      if (i < X.length - 1) {
        if (+minX >= +X[i] && +minX <= +X[i + 1]) {
          result.push({ x: minX, y: foo(minX) })
        } else {
          result.push({})
        }
      } else {
        result.push({})
      }
    }
    return result
  }

  const genStart = (X, startX, foo) => {
    const result = []
    for (let i = 0; i < X.length; i++) {
      if (i < X.length - 1) {
        if (+startX > +X[i] && +startX <= +X[i + 1]) {
          result.push({ x: startX, y: foo(startX) })
        } else {
          result.push({})
        }
      } else {
        result.push({})
      }
    }
    return result
  }

  const genEnd = (X, endX, foo) => {
    const result = []
    for (let i = 0; i < X.length; i++) {
      if (i < X.length - 1) {
        if (+endX > +X[i] && +endX <= +X[i + 1]) {
          result.push({ x: endX, y: foo(endX) })
        } else {
          result.push({})
        }
      } else {
        result.push({})
      }
    }
    return result
  }


  submitButton.addEventListener('click', () => {
    xArr = []
    yArr = []
    while(submitButton.nextSibling) submitButton.nextSibling.remove()
    const inputs = document.querySelectorAll('.task-input')
    y = new Function('x', `return ${inputs[0].value}`)
    start = +inputs[1].value
    end = +inputs[2].value
    a = +inputs[3].value
    b = +inputs[4].value
    eps = +inputs[5].value
    const startPoint = a
    const endPoint = b

    const [min, ] = findMinimum(a, b, eps)

    // fill function data
    for (let i = start; i <= end; i += (end - start) / 30) {
      const res = +y(i).toFixed(2)
      xArr.push(+i.toFixed(2))
      yArr.push(res)
    }
    printResult(startPoint, endPoint, +min.toFixed(2))
  })

  defaultButton.addEventListener('click', () => {
    xArr = []
    yArr = []
    while(submitButton.nextSibling) submitButton.nextSibling.remove()
    y = new Function('x', 'return x * Math.sin(x) - 10 * (Math.sin(x) ** 2)')
    start = 0
    end = 3
    a = 1
    b = 2
    eps = 0.001
    const startPoint = a
    const endPoint = b
    const [min, ] = findMinimum(a, b, eps)

    // fill function data
    for (let i = start; i <= end; i += (end - start) / 30) {
      const res = +y(i).toFixed(2)
      xArr.push(+i.toFixed(2))
      yArr.push(res)
    }
    printResult(startPoint, endPoint, +min.toFixed(2))
  })

  function findMinimum(start, end, eps) {
    let count = 0
    const zs = 0.381966
    let a = start
    let b = end
    let x1 = a + zs * (b - a)
    let x2 = b - zs * (b - a)
    let y1 = y(x1)
    let y2 = y(x2)
    while (b - a > eps) {
      if (y1 > y2) {
        a = x1
        x1 = x2
        y1 = y2
        x2 = b - zs * (b - a)
        y2 = y(x2)
      } else {
        b = x2
        x2 = x1
        y2 = y1
        x1 = a + zs * (b - a)
        y1 = y(x1)
      }
      count++
    }
    return [(a + b) / 2, count]
  }

  function printResult(start, end, min) {
    createH2(`Минимум функции на промежутке [${start};${end}] => ${y(min).toFixed(2)} в точке ${min}`, labwork)
    const [, count2] = findMinimum(a, b, 10e-2)
    createH2(`Кол-во итераций при eps=10e-2: ${count2}`, labwork)
    const [, count3] = findMinimum(a, b, 10e-3)
    createH2(`Кол-во итераций при eps=10e-3: ${count3}`, labwork)
    const [, count4] = findMinimum(a, b, 10e-4)
    createH2(`Кол-во итераций при eps=10e-4: ${count4}`, labwork)
    const [, count5] = findMinimum(a, b, 10e-5)
    createH2(`Кол-во итераций при eps=10e-5: ${count5}`, labwork)

    const canvas = document.createElement('canvas')
    labwork.append(canvas)
    Chart.defaults.global.defaultFontSize = 30
    const ctx = canvas.getContext('2d')
    const chart = new Chart(ctx, {
      data: {
        labels: xArr,
        datasets: [{
          type: 'scatter',
          label: 'Минимум',
          data: genMin(xArr, min, y),
          backgroundColor: 'red',
          pointBackgroundColor: 'red',
          fill: false,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 1
        }, {
          type: 'scatter',
          label: 'Начало',
          data: genStart(xArr, start, y),
          backgroundColor: 'yellow',
          pointBackgroundColor: 'yellow',
          fill: false,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 1
        }, {
          type: 'scatter',
          label: 'Конец',
          data: genEnd(xArr, end, y),
          backgroundColor: 'green',
          pointBackgroundColor: 'green',
          fill: false,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 1
        }, {
          type: 'line',
          label: 'Функция',
          data: yArr,
          borderColor: [
            'rgba(54, 162, 235, 1)',
          ],
          fill: false,
          borderWidth: 3,
          pointRadius: 2,
          pointHoverRadius: 5
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
}