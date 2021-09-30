function Labwork4() {

  const genX = (a, b, j) => {
    const result = []
    for (let i = 1; i < j + 1; i++) {
      const xi = a + (i - 1) * (b - a) / (j - 1)
      result.push(+xi.toFixed(3))
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

  const genPoints = (X, num, foo) => {
    const result = []
    for (const value of X) {
      if (Math.abs(value - num) < (b - a) / (1.8 * m)) {
        result.push(foo(num))
        break
      } else {
        result.push(null)
      }
    }
    return result
  }

  const a = -1
  const b = 3
  const m = 100
  const X = genX(a, b, m)
  const Y = genY(X, f)
  const axisX = genY(X, () => 0)

  const labwork = document.getElementById('labwork4')

  createH2('Задание: x^2-10sin^2(x)+2, [-1;3], метод Ньютона', labwork)
  const start = createInput('Старт', labwork)
  start.setAttribute('type', 'number')
  start.setAttribute('step', '0.1')
  start.value = '0.1'
  start.addEventListener('input', calculate)
  calculate()

  function f (x) {
    return x * x - 10 * (Math.sin(x) ** 2) + 2
  }

  function fi (x) {
    return x - (x * x - 10 * (Math.sin(x) ** 2) + 2) / (2 * x - 10 * Math.sin(2 * x))
  }

  function findZero (fi, x) {
    const eps = 0.0001
    let delta = 1 // delta > eps
    let i
    for (i = 0; !(delta < eps || i > 100); i++) {
      const xNext = fi(x)
      delta = Math.abs(xNext - x)
      x = xNext
    }
    return { iterations: i, root: x }
  }

  function calculate() {

    while (start.nextSibling) start.nextSibling.remove()

    const startX = +document.querySelector('.task-input').value
    const { root: minimum, iterations } = findZero(fi, startX)

    const genData = () => ({
      labels: X,
      datasets: [
        {
          type: 'line',
          label: 'f(x)',
          indexAxis: 'x',
          backgroundColor: 'green',
          borderColor: 'green',
          pointBackgroundColor: 'green',
          pointBorderColor: 'black',
          pointRadius: 0,
          borderWidth: 2,
          fill: false,
          data: Y
        },
        {
          type: 'line',
          label: 'startX',
          borderColor: 'black',
          backgroundColor: 'yellow',
          pointBackgroundColor: 'yellow',
          order: -1,
          pointBorderColor: 'black',
          pointRadius: 10,
          borderWidth: 1,
          fill: false,
          data: genPoints(X, startX, f)
        },
        {
          type: 'line',
          label: 'root',
          borderColor: 'black',
          backgroundColor: 'red',
          pointBackgroundColor: 'red',
          order: -2,
          pointBorderColor: 'black',
          pointRadius: 10,
          borderWidth: 1,
          fill: false,
          data: genPoints(X, minimum, f)
        },
        {
          type: 'line',
          label: 'x axis',
          backgroundColor: 'black',
          borderColor: 'black',
          pointBackgroundColor: 'green',
          pointBorderColor: 'black',
          pointRadius: 0,
          borderWidth: 1,
          fill: false,
          data: axisX
        }

      ]
    })
    const data = genData()

    createH2(`f(x) = 0, x: ${minimum.toFixed(3)} за ${iterations} итераций`, labwork)

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