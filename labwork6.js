function Labwork6() {

  const labwork = document.getElementById('labwork6')

  createH2('Метод: неявная схема 1-го порядка, U1=2x, U2=e^x', labwork)
  createInput('Введите eps', labwork)
  const submit = createButton('Ввести', 'submit', labwork)

  // WORKING FUNCTIONS
  function OUT (x, Y) {
    const y1 = Y[0]
    const u1 = 2 * x
    const d1 = Math.abs(u1 - y1)
    const y2 = Y[1]
    const u2 = Math.exp(x)
    const d2 = Math.abs(u2 - y2)
    console.dir({ x, y1, u1, d1, y2, u2, d2 })
    return {x, y1, y2, u1, u2, d1, d2 }
  }

  function FPR (x, Y) { // система уравнений
    const F = []
    F[0] = Y[0] + Y[1] - 2 * x - Math.exp(x) + 2
    F[1] = Y[0] + Y[1] - 2 * x
    return F
  }

  function calculateM2V2 (eps) {
    const result = []
    const a = 1
    const b = 2
    let Y = [2 * a, Math.exp(a)]
    let iteration = 0
    let x = a
    do {
      const nx = 10 * (2 ** iteration)
      Y = [2 * a, Math.exp(a)]
      const h = (b - a) / nx
      x = a
      for (let n = 0; n < nx; n++) {
        const F = FPR(x, Y)
        Y[0] += h * F[0]
        Y[1] += h * F[1]
        x += h
        if (iteration === 2)
          result.push({ ...OUT(x, Y), iteration })
      }
      iteration++

    } while (Math.abs(Math.exp(x) - Y[1]) > eps || Math.abs(2 * x - Y[0]) > eps)
    return result
  }

  function calculateM2 (eps) {
    const result = []
    const a = 1
    const b = 2
    let Y = [2 * a, Math.exp(a)]
    let iteration = 0
    let x = a
    do {
      const nx = 10 * (2 ** iteration)
      Y = [2 * a, Math.exp(a)]
      const h = (b - a) / nx
      x = a
      for (let n = 0; n < nx; n++) {
        const F = FPR(x, Y)
        Y[0] += h * F[0]
        Y[1] += h * F[1]
        x += h
      }
      iteration++
      result.push({ ...OUT(x, Y), iteration })
    } while (Math.abs(Math.exp(x) - Y[1]) > eps || Math.abs(2 * x - Y[0]) > eps)
    return result
  }

  submit.addEventListener('click', () => {
    while (submit.nextSibling) submit.nextSibling.remove()
    const eps = document.querySelector('.task-input').value
    const result = calculateM2(eps)
    const result2 = calculateM2V2(eps)

    const genData = () => ({
      labels: result.map(item => item.iteration),
      datasets: [
        {
          type: 'line',
          label: 'Погрешность d1',
          indexAxis: 'x',
          backgroundColor: 'limegreen',
          borderColor: 'black',
          pointBackgroundColor: 'limegreen',
          pointBorderColor: 'black',
          pointRadius: 5,
          borderWidth: 1,
          fill: false,
          data: result.map(item => item.d1)
        },
        {
          type: 'line',
          label: 'Погрешность d2',
          indexAxis: 'x',
          backgroundColor: 'yellow',
          borderColor: 'black',
          pointBackgroundColor: 'yellow',
          pointBorderColor: 'black',
          pointRadius: 5,
          borderWidth: 1,
          fill: false,
          data: result.map(item => item.d2)
        }
      ]
    })
    const data = genData()

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

    const otherData = {
      labels: result.map(item => item.iteration),
      datasets: [
        {
          type: 'line',
          label: 'y1',
          indexAxis: 'x',
          backgroundColor: 'red',
          borderColor: 'black',
          pointBackgroundColor: 'red',
          pointBorderColor: 'black',
          pointRadius: 5,
          borderWidth: 1,
          fill: false,
          data: result.map(item => item.y1)
        },
        {
          type: 'line',
          label: 'y2',
          indexAxis: 'x',
          backgroundColor: 'orange',
          borderColor: 'black',
          pointBackgroundColor: 'orange',
          pointBorderColor: 'black',
          pointRadius: 5,
          borderWidth: 1,
          fill: false,
          data: result.map(item => item.y2)
        },
        {
          type: 'line',
          label: 'u1',
          indexAxis: 'x',
          backgroundColor: 'skyblue',
          borderColor: 'black',
          pointBackgroundColor: 'skyblue',
          pointBorderColor: 'black',
          pointRadius: 5,
          borderWidth: 1,
          fill: false,
          data: result.map(item => item.u1)
        },
        {
          type: 'line',
          label: 'u2',
          indexAxis: 'x',
          backgroundColor: 'violet',
          borderColor: 'black',
          pointBackgroundColor: 'violet',
          pointBorderColor: 'black',
          pointRadius: 5,
          borderWidth: 1,
          fill: false,
          data: result.map(item => item.u2)
        }
      ]
    }

    const otherCanvas = document.createElement('canvas')
    labwork.append(otherCanvas)
    const otherCtx = otherCanvas.getContext('2d')
    new Chart(otherCtx, {
      data: otherData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: false
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

    function getExData() {
      const labels = []
      const results = []
      for (let i = 1; i <= 2.01; i+=0.05) {
        labels.push(+i.toFixed(2))
        results.push(Math.exp(i))
      }
      return [labels, results]
    }

    function get2xData() {
      const labels = []
      const results = []
      for (let i = 1; i <= 2.01; i+=0.05) {
        labels.push(+i.toFixed(2))
        results.push(2 * i)
      }
      return [labels, results]
    }

    const [labelsEx, resultsEx] = getExData()
    const [labels2x, results2x] = get2xData()

    const funcData = {
      labels: result2.map(item => item.x),
      datasets: [
        {
          type: 'line',
          label: 'y1',
          indexAxis: 'x',
          backgroundColor: 'red',
          borderColor: 'black',
          pointBackgroundColor: 'red',
          pointBorderColor: 'black',
          pointRadius: 5,
          borderWidth: 1,
          fill: false,
          data: result2.map(item => item.y1)
        },
        {
          type: 'line',
          label: 'y2',
          indexAxis: 'x',
          backgroundColor: 'orange',
          borderColor: 'black',
          pointBackgroundColor: 'orange',
          pointBorderColor: 'black',
          pointRadius: 5,
          borderWidth: 1,
          fill: false,
          data: result2.map(item => item.y2)
        },
        {
          type: 'line',
          label: 'u1',
          indexAxis: 'x',
          backgroundColor: 'red',
          borderColor: 'black',
          pointBackgroundColor: 'red',
          pointBorderColor: 'black',
          pointRadius: 5,
          borderWidth: 1,
          fill: false,
          data: result2.map(item => item.u1)
        },
        {
          type: 'line',
          label: 'u2',
          indexAxis: 'x',
          backgroundColor: 'orange',
          borderColor: 'black',
          pointBackgroundColor: 'orange',
          pointBorderColor: 'black',
          pointRadius: 5,
          borderWidth: 1,
          fill: false,
          data: result2.map(item => item.u2)
        }
      ]
    }

    const functions = document.createElement('canvas')
    labwork.append(functions)
    const functionsCtx = functions.getContext('2d')
    new Chart(functionsCtx, {
      data: funcData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: false
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

  })
}