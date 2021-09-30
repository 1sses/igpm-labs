function Labwork3() {

  const F = x => x * x - 10 * (Math.sin(x) ** 2)
  const dF1 = x => 2 * x - 10 * Math.sin(2 * x)
  const dF2 = x => 2 - 20 * Math.cos(2 * x)
  const a = 0
  const b = 3

  const genX = (a, b, j) => {
    const result = []
    for (let i = 1; i < j + 1; i++) {
      const xi = a + (i - 1) * (b - a) / (j - 1)
      result.push(xi)
    }
    return result
  }
  const genY = (X, foo) => {
    const result = []
    for (const value of X) {
      result.push(foo(value))
    }
    return result
  }

  const X = genX(a, b, 21)
  const fxY = genY(X, F)

  const derF1Y = genY(X, dF1)
  const derF2Y = genY(X, dF2)

  derF2Y[0] = null
  derF2Y[X.length - 1] = null


  const labwork = document.getElementById('labwork3')

  createH2('Задание: [0;3], методом трапеций, x^2-10sin^2(x)', labwork)
  const mInput = createInput('m', labwork, calculation)
  const hInput = createInput('h', labwork, calculation)
  mInput.addEventListener('input', calculation)
  mInput.setAttribute('step', '5')
  mInput.value = 20
  hInput.addEventListener('input', calculation)
  hInput.setAttribute('step', '0.01')
  hInput.value = 0.1

  calculation()

  function calculation() {
    while (hInput.nextSibling) hInput.nextSibling.remove()
    const inputs = document.querySelectorAll('.task-input')
    const m = +inputs[0].value
    const h = +inputs[1].value

    const calc44DF1 = (x) => (F(x + h) - F(x - h)) / (2 * h)
    // const calc45DF1 = (x) => (3 * F(x - h) - 4 * F(x) + F(x + h)) / (2 * h)
    const calc46DF1 = (x) => (F(x - h) - 4 * F(x) + 3 * F(x + h)) / (2 * h)
    const calc47DF2 = (x) => (F(x + h) - 2 * F(x) + F(x - h)) / (h * h)

    const calcDerF1Y = () => {
      const result = []
      for (let i = 0; i < X.length; i++) {
        if (i === X.length - 1) {
          result.push(calc46DF1(X[i]))
          continue
        }
        result.push(calc44DF1(X[i]))
      }
      return result
    }
    const calcDerF2Y = () => {
      const result = []
      for (let i = 0; i < X.length; i++) {
        if (i === 0 || i === X.length - 1) {
          result.push(null)
        } else {
          result.push(calc47DF2(X[i]))
        }
      }
      return result
    }

    const integral = []

    const calcIntegral = () => {
      const hI = (b - a) / m
      let sum = 0
      for (let i = 1; i < m + 1; i++) {
        const x = a + (i - 1) * hI
        const xNext = a + i * hI
        const partSum = 0.5 * (F(x) + F(xNext)) * hI
        if (m < 21) {
          integral.push({ x: x, y: F(x) })
        }
        sum += partSum
      }
      return sum
    }

    const results = {
      calcDerF1: calcDerF1Y(),
      calcDerF2: calcDerF2Y(),
      integral: calcIntegral().toFixed(5)
    }

    const genData = () => ({
      labels: X,
      datasets: [

        {
          type: 'line',
          label: 'f(x)',
          borderColor: 'green',
          pointBackgroundColor: 'green',
          pointBorderColor: 'black',
          borderWidth: 2,
          fill: true,
          data: fxY
        },
        {
          type: 'line',
          label: 'f(1)(x)',
          borderColor: '#CC3333',
          pointBackgroundColor: '#CC3333',
          pointBorderColor: 'black',
          borderWidth: 2,
          fill: false,
          data: derF1Y
        },
        {
          type: 'line',
          label: 'f(2)(x)',
          borderColor: '#FF6600',
          pointBackgroundColor: '#FF6600',
          pointBorderColor: 'black',
          borderWidth: 2,
          fill: false,
          data: derF2Y
        },
        {
          type: 'line',
          label: 'calc f(1)(x)',
          borderColor: '#3F888F',
          pointBackgroundColor: '#3F888F',
          pointBorderColor: 'black',
          borderWidth: 2,
          fill: false,
          data: results.calcDerF1
        },
        {
          type: 'line',
          label: 'calc f(2)(x)',
          borderColor: '#77DDE7',
          pointBackgroundColor: '#77DDE7',
          pointBorderColor: 'black',
          borderWidth: 2,
          fill: false,
          data: results.calcDerF2
        },
        {
          type: 'bar',
          label: 'integral',
          borderColor: '#77DDE7',
          pointBackgroundColor: '#77DDE7',
          pointBorderColor: 'black',
          maxBarThickness: Math.floor(500 / m),
          borderWidth: 2,
          fill: false,
          data: integral,
          stack: 'bar'
        }
      ]
    })
    const data = genData()

    const calcInaccuracy = (arr1, arr2) => {
      let sum = 0
      for (let i = 0; i < arr1.length; i++) {
        sum += Math.abs(arr1[i] - arr2[i])
      }
      return sum / arr1.length
    }
    const inaccuracyD1 = calcInaccuracy(derF1Y, results.calcDerF1).toFixed(5)
    const inaccuracyD2 = calcInaccuracy(derF2Y, results.calcDerF2).toFixed(5)

    createH2(`Погрешность 1: ${inaccuracyD1}`, labwork)
    createH2(`Погрешность 2: ${inaccuracyD2}`, labwork)
    createH2(`Значение интеграла: ${results.integral}
     (погрешность ${(Math.abs(results.integral) - 6.699).toFixed(3)})`, labwork)

    const canvas = document.createElement('canvas')
    labwork.append(canvas)
    const ctx = canvas.getContext('2d')
    new Chart(ctx, {
      data: data,
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