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
      (_, index) => (index + 1).toString().padStart(2, '0') + '/2021'
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
