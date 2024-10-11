const currentYear = new Date().getFullYear();

export const areaChartOptions = {
  chart: {
    id: 'areaChart',
    height: 350,
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  colors: ['#4379EE'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth' as const
  },
  markers: {
    size: 5,
    colors: ['#4379EE'],
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: {
      size: 7
    }
  },
  xaxis: {
    type: 'category' as const,
    title: {
      text: 'Ngày đặt hàng'
    }
  },
  yaxis: {
    title: {
      text: 'Doanh thu (VNĐ)'
    }
  },
  tooltip: {
    x: {
      format: 'dd'
    }
  },
  noData: {
    text: 'Không có dữ liệu',
    align: 'center' as const,
    verticalAlign: 'middle' as const,
    style: {
      color: '#000000',
      fontSize: '14px'
    }
  }
};

export const barChartOptions = {
  chart: {
    id: 'barChart',
    height: 350,
    type: 'bar' as const,
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  xaxis: {
    title: {
      text: 'Thời gian'
    }
  },
  yaxis: {
    title: {
      text: 'Số lượng đơn hàng'
    }
  },
  noData: {
    text: 'Không có dữ liệu',
    align: 'center' as const,
    verticalAlign: 'middle' as const,
    style: {
      color: '#000000',
      fontSize: '14px'
    }
  }
};

export const pieChartOptions = {
  chart: {
    id: 'pieChart',
    type: 'pie' as const
  },
  labels: [],
  noData: {
    text: 'Không có dữ liệu',
    align: 'center' as const,
    verticalAlign: 'middle' as const,
    style: {
      color: '#000000',
      fontSize: '14px'
    }
  }
};

export const heatMapOptions = {
  chart: {
    type: 'heatmap' as const,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.5,
      colorScale: {
        ranges: [
          {
            from: 0,
            to: 0,
            color: '#f3f4f6',
            name: 'Không có'
          },
          {
            from: 1,
            to: 10,
            color: '#90ee7e',
            name: '1-10 đơn hàng'
          },
          {
            from: 11,
            to: 20,
            color: '#f9c74f',
            name: '11-20 đơn hàng'
          },
          {
            from: 21,
            to: 30,
            color: '#f9844a',
            name: '21-30 đơn hàng'
          },
          {
            from: 31,
            to: 40,
            color: '#f3722c',
            name: '31-40 đơn hàng'
          },
          {
            from: 41,
            to: 50,
            color: '#f94144',
            name: '41-50 đơn hàng'
          }
        ]
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    type: 'category' as const
  },
  noData: {
    text: 'Không có dữ liệu',
    align: 'center' as const,
    verticalAlign: 'middle' as const,
    style: {
      color: '#000000',
      fontSize: '14px'
    }
  }
};

export const donutChartOptions = {
  chart: {
    id: 'pieChart',
    type: 'donut' as const
  },
  labels: [],
  noData: {
    text: 'Không có dữ liệu',
    align: 'center' as const,
    verticalAlign: 'middle' as const,
    style: {
      color: '#000000',
      fontSize: '14px'
    }
  }
};

export const lineChartOptions = {
  chart: {
    id: 'lineChart',
    type: 'line' as const,
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  xaxis: {
    categories: Array.from(
      { length: 12 },
      (_, index) => (index + 1).toString().padStart(2, '0') + '/' + currentYear
    ),
    title: {
      text: 'Tháng'
    }
  },
  yaxis: {
    title: {
      text: 'Số lượng đơn hàng'
    }
  },
  noData: {
    text: 'Không có dữ liệu',
    align: 'center' as const,
    verticalAlign: 'middle' as const,
    style: {
      color: '#000000',
      fontSize: '14px'
    }
  }
};

export const radialChartOptions = {
  chart: {
    type: 'radialBar' as const
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: '22px'
        },
        value: {
          fontSize: '16px'
        }
      }
    }
  },
  noData: {
    text: 'Không có dữ liệu',
    align: 'center' as const,
    verticalAlign: 'middle' as const,
    style: {
      color: '#000000',
      fontSize: '14px'
    }
  }
};
