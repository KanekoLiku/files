import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Bar, Doughnut } from 'react-chartjs-2'

function ChartWrapper({ qdata, result }) {
  const generateColors = (count) => {
    const baseColors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(199, 199, 199, 0.8)',
      'rgba(83, 102, 255, 0.8)',
      'rgba(255, 99, 255, 0.8)',
      'rgba(99, 255, 132, 0.8)',
    ]

    const colors = []
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length])
    }
    return colors
  }

  if (result.type === 'single_choice') {
    const labels = Object.keys(result.counts)
    const data = Object.values(result.counts)

    const chartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: generateColors(labels.length),
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 15,
            font: { size: 12 },
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return `${context.label}: ${value} (${percentage}%)`
            },
          },
        },
        datalabels: {
          color: '#fff',
          font: {
            weight: 'bold',
            size: 12,
          },
          formatter: (value, context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return percentage > 5 ? `${value}` : ''
          },
        },
      },
    }

    return (
      <div style={{ height: '300px' }}>
        <Doughnut data={chartData} options={options} plugins={[ChartDataLabels]} />
      </div>
    )
  }

  if (result.type === 'scale') {
    let labels = []
    let data = []

    if (result.labels) {
      for (let i = 1; i <= 5; i++) {
        labels.push(result.labels[i] || i.toString())
        data.push(result.counts[i] || 0)
      }
    } else {
      labels = ['1', '2', '3', '4', '5']
      data = [1, 2, 3, 4, 5].map((i) => result.counts[i] || 0)
    }

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: '回答数',
          data: data,
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 1,
        },
      ],
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 30,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 0,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            afterLabel: (context) => {
              const total = result.total_responses || 0
              const percentage = ((context.parsed.y / total) * 100).toFixed(1)
              return `${percentage}%`
            },
          },
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          color: '#374151',
          font: {
            weight: 'bold',
            size: 10,
          },
          formatter: (value) => (value > 0 ? value : ''),
        },
      },
    }

    const scaleInfo = qdata.scale_info
    if (scaleInfo?.leftLabel && scaleInfo.rightLabel) {
      return (
        <div>
          <div style={{ height: '300px' }}>
            <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
          </div>
          <div className="mt-2 text-sm text-gray-600 text-center">
            {scaleInfo.leftLabel}
            <span className="mx-2">⟷</span>
            {scaleInfo.rightLabel}
          </div>
        </div>
      )
    }

    return (
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
      </div>
    )
  }

  if (result.type === 'multiple_choice') {
    const sortedItems = Object.entries(result.counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)

    const labels = sortedItems.map(([label]) => label)
    const data = sortedItems.map(([, count]) => count)

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: '回答数',
          data: data,
          backgroundColor: 'rgba(251, 146, 60, 0.8)',
          borderColor: 'rgba(251, 146, 60, 1)',
          borderWidth: 1,
        },
      ],
    }

    const options = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          right: 50,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: Math.ceil(Math.max(...data) / 10) || 1,
          },
        },
        y: {
          ticks: {
            autoSkip: false,
            callback: function (value) {
              const label = this.getLabelForValue(value)
              if (label.length > 40) {
                return `${label.substring(0, 40)}...`
              }
              return label
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          anchor: 'end',
          align: 'end',
          offset: 5,
          color: '#374151',
          font: {
            weight: 'bold',
            size: 11,
          },
          formatter: (value) => value,
          clip: false,
        },
      },
    }

    const height = Math.min(500, 100 + labels.length * 30)

    return (
      <div className="overflow-x-auto">
        <div style={{ height: `${height}px`, minWidth: '600px' }}>
          <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
        </div>
      </div>
    )
  }

  if (result.type === 'grid') {
    const rows = Object.entries(result.rows || {})

    if (rows.length === 0) {
      return <div className="text-gray-500 text-center py-8">データがありません</div>
    }

    const firstRow = rows[0][1]
    const isScaleType = firstRow.type === 'scale'

    if (isScaleType) {
      let labels = []
      if (firstRow.labels) {
        for (let i = 1; i <= 5; i++) {
          labels.push(firstRow.labels[i] || i.toString())
        }
      } else {
        labels = ['1', '2', '3', '4', '5']
      }

      const datasets = rows.map(([rowLabel, rowData], index) => {
        const data = []
        for (let i = 1; i <= 5; i++) {
          data.push(rowData.counts[i] || 0)
        }

        const colors = [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
        ]

        return {
          label: rowLabel,
          data: data,
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length].replace('0.8', '1'),
          borderWidth: 1,
        }
      })

      const chartData = {
        labels: labels,
        datasets: datasets,
      }

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 0,
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              padding: 15,
              font: { size: 12 },
            },
          },
          tooltip: {
            callbacks: {
              afterLabel: (context) => {
                const rowData = result.rows[context.dataset.label]
                const total = rowData?.total_responses || 0
                const percentage = total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : 0
                return `${percentage}%`
              },
            },
          },
          datalabels: {
            display: false,
          },
        },
      }

      const height = Math.min(400, 250 + rows.length * 20)

      return (
        <div>
          <div style={{ height: `${height}px` }}>
            <Bar data={chartData} options={options} />
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {rows.map(([rowLabel, rowData]) => (
              <div key={rowLabel} className="bg-gray-50 rounded p-2">
                <div className="font-medium text-gray-700">{rowLabel}</div>
                <div className="text-gray-600">
                  平均: {rowData.average?.toFixed(2) || 'N/A'} | 回答:{' '}
                  {rowData.total_responses || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    {
      const allOptions = new Set()
      for (const [, rowData] of rows) {
        for (const option of Object.keys(rowData.counts || {})) {
          allOptions.add(option)
        }
      }
      const labels = Array.from(allOptions).sort()

      const datasets = rows.map(([rowLabel, rowData], index) => {
        const data = labels.map((label) => rowData.counts[label] || 0)

        const colors = [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
        ]

        return {
          label: rowLabel,
          data: data,
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length].replace('0.8', '1'),
          borderWidth: 1,
        }
      })

      const chartData = {
        labels: labels,
        datasets: datasets,
      }

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 0,
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              padding: 15,
              font: { size: 12 },
            },
          },
          tooltip: {
            callbacks: {
              afterLabel: (context) => {
                const rowData = result.rows[context.dataset.label]
                const total = rowData?.total_responses || 0
                const percentage = total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : 0
                return `${percentage}%`
              },
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            offset: 5,
            color: '#374151',
            font: {
              weight: 'bold',
              size: 10,
            },
            formatter: (value) => (value > 0 ? value : ''),
          },
        },
      }

      const height = Math.min(400, 250 + rows.length * 50)

      return (
        <div>
          <div style={{ height: `${height}px` }}>
            <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {rows.map(([rowLabel, rowData]) => (
              <div key={rowLabel} className="bg-gray-50 rounded p-3">
                <div className="font-medium text-gray-700 mb-2">{rowLabel}</div>
                <div className="text-sm text-gray-600">
                  {Object.entries(rowData.counts || {}).map(([option, count]) => {
                    const percentage =
                      rowData.total_responses > 0
                        ? ((count / rowData.total_responses) * 100).toFixed(1)
                        : 0
                    return (
                      <div key={option} className="flex justify-between">
                        <span>{option}:</span>
                        <span className="font-medium">
                          {count} ({percentage}%)
                        </span>
                      </div>
                    )
                  })}
                  <div className="mt-1 pt-1 border-t border-gray-300">
                    総回答数: {rowData.total_responses || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  }

  return null
}

export default ChartWrapper
