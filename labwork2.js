function Labwork2() {

  // x*x-10*(Math.sin(x)**2)

  let a, b, n, m
  let y
  let xi, yi
  let xj, fxj, fixjc, dxj

  const labwork = document.getElementById('labwork2')
  createH2('Задание: x^2-10sin^2(x), a=0, b=3, m=4, n=4, вид - Ньютона PN', labwork)
  createInput('Введите функцию', labwork)
  createInput('Введите а', labwork)
  createInput('Введите b', labwork)
  createInput('Введите n', labwork)
  createInput('Введите m', labwork)
  const submitInputs = createButton('Подтвердить', 'submit', labwork)
  const defaultTask = createButton('Тестовое задание', 'default', labwork)

  submitInputs.addEventListener('click', (event) => {
    xi = []
    yi = []
    xj = []
    fxj = []
    fixjc = []
    dxj = []
    while(submitInputs.nextSibling) submitInputs.nextSibling.remove()
    const inputs = document.querySelectorAll('.task-input')
    y = new Function('x', `return ${inputs[0].value}`)
    a = +inputs[1].value
    b = +inputs[2].value
    n = +inputs[3].value
    m = +inputs[4].value
    for (let i = 1; i <= m; i++) {
      xi.push(a + (i - 1) * (b - a) / (m - 1))
      yi.push(y(xi[i - 1]))
    }
    for (let j = 1; j <= 21; j++) {
      xj.push((a + (j - 1) * (b - a) / 20).toFixed(2))
      fxj.push(y(xj[j - 1]).toFixed(2))
      fixjc.push(newtonsPolynomial(xj[j - 1]).toFixed(3))
      dxj.push((fxj[j - 1] - fixjc[j - 1]).toFixed(2))
    }
    printResult()
  })

  defaultTask.addEventListener('click', (event) => {
    xi = []
    yi = []
    xj = []
    fxj = []
    fixjc = []
    dxj = []
    while(defaultTask.nextSibling) defaultTask.nextSibling.remove()
    y = new Function('x', `return x*x-10*(Math.sin(x)**2)`)
    a = 0
    b = 3
    n = 4
    m = 4
    for (let i = 1; i <= m; i++) {
      xi.push(a + (i - 1) * (b - a) / (m - 1))
      yi.push(y(xi[i - 1]))
    }
    for (let j = 1; j <= 21; j++) {
      xj.push((a + (j - 1) * (b - a) / 20).toFixed(2))
      fxj.push(y(xj[j - 1]).toFixed(2))
      fixjc.push(newtonsPolynomial(xj[j - 1]).toFixed(3))
      dxj.push((fxj[j - 1] - fixjc[j - 1]).toFixed(2))
    }
    printResult()
  })

  function koef(i, k) {
    if (k === 1) return (yi[i - 1] - yi[i]) / (xi[i - 1] - xi[i])
    return (koef(i, k - 1) - koef(i + 1, k - 1)) / (xi[i - 1] - xi[i - 1 + k])
  }

  function newtonsPolynomial(xt) {
    let polynomial = yi[0]
    for (let k = 1; k < n; k++) {
      let mult = 1
      for (let i = 1; i <= k; i++) {
        mult *= (xt - xi[i - 1])
      }
      polynomial += mult * koef(1, k)
    }
    return polynomial
  }

  function printResult() {

    createH2('Аппроксимация завершена', labwork)
    const maxDx = Math.max(...dxj.map(i => Math.abs(i)))
    createH2(`Наибольшая погрешность аппроксимации: ${maxDx.toFixed(3)} 
    (${(maxDx / (Math.max(...fxj) - Math.min(...fxj)) * 100).toFixed(1)} %
     от разницы между максимальным и минимальным значением функции)`, labwork)
    createH2(`Средняя погрешность: ${(dxj.reduce((acc, item) => acc += Math.abs(item), 0) / 21).toFixed(3)}`, labwork)

    const canvas = document.createElement('canvas')
    labwork.append(canvas)
    Chart.defaults.global.defaultFontSize = 30
    const ctx = canvas.getContext('2d')
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: xj,
        datasets: [{
          label: 'Обычная',
          data: fxj,
          borderColor: [
            'rgba(54, 162, 235, 1)',
          ],
          fill: false,
          borderWidth: 3,
          pointRadius: 2,
          pointHoverRadius: 5
        }, {
          label: 'Ньютон',
          data: fixjc,
          borderColor: [
            'rgba(254, 62, 135, 1)',
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