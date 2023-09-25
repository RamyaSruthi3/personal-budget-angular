export type Datasource = {
  datasets: [
    {
      data: number[],        // Changed from string[] to number[] because budget values are numbers
      backgroundColor: string[],
    }
  ],
  labels: string[]
}

export type Datasource1 = {
  label: string,             // Changed "labels" to "label" for consistency
  value: number              // Changed from string to number because budget values are numbers
}[]
