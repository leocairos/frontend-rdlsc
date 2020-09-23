import React, { useCallback, useEffect, useState } from 'react';
import { Waypoint } from 'react-waypoint';
import MUIDataTable, {
  FilterType,
  Responsive,
  SelectableRows,
} from 'mui-datatables';

import { format } from 'date-fns';

import { Button, CircularProgress, Typography } from '@material-ui/core';

import PageContainer from '../../components/common/PageContainer';

import { apiXiloliteCQ } from '../../services/api';

interface IAuxiliar {
  value: string;
}

interface IDataSample {
  id?: number;
  sample_type?: string;
  taken_date_time?: string;
  collection_point?: string;
  sample_conclusion?: string;
  updated_at?: string;
  sample_status?: string;
}

interface ISampleAPIResponse {
  id: number;
  sample_type: string;
  taken_date_time: Date;
  sample_conclusion: string;
  collection_point: string;
  updated_at: Date;
  sample_status: string;
  observation?: string;
  lote?: string;
}

const formatedData = async (
  samples: ISampleAPIResponse[],
): Promise<IDataSample[]> => {
  const dataFormated = samples.map((sample: ISampleAPIResponse) => {
    return {
      id: sample.id,
      sample_type: sample.sample_type,
      taken_date_time: sample.taken_date_time
        ? format(new Date(sample.taken_date_time), 'dd/MM/yyyy HH:mm')
        : '',
      collection_point: sample.collection_point,
      updated_at: sample.updated_at
        ? format(new Date(sample.updated_at), 'dd/MM/yyyy HH:mm')
        : '',
      sample_conclusion: sample.sample_conclusion,
      sample_status: sample.sample_status,
      observation: sample.observation,
      lote: sample.lote,
    };
  });

  await Promise.all(dataFormated);

  return dataFormated as IDataSample[];
};

const MyLIMsSamples: React.FC = () => {
  const [data, setData] = useState<IDataSample[]>([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState<number>(0);
  const [filterData, setFilterData] = useState('');
  const [sortOrder, setSortOrder] = useState('updated_at desc');
  const rowsPerPage = 50;
  const [sampleTypesFilter, setSampleTypesFilter] = useState([]);
  const [collectionPointsFilter, setCollectionPointsFilter] = useState([]);
  const [sampleStatusFilter, setSampleStatusFilter] = useState([]);
  const [sampleConclusionFilter, setSampleConclusionFilter] = useState([]);
  const [takenDateFilter, setTakenDateFilter] = useState<string[]>([]);

  const getDataApi = useCallback(
    async (pageNum: number, pageSize: number, orderby?: string) => {
      let urlGet = `/samplesHeader?page=${pageNum}&pageSize=${pageSize}`;
      urlGet += `&filters=${filterData}`;
      urlGet += `&orderby=${orderby || sortOrder}`;

      const response = await apiXiloliteCQ.get(urlGet);
      return response.data;
    },
    [filterData, sortOrder],
  );

  const getNewData = useCallback(
    async (pageNum: number) => {
      setIsLoading(true);
      const dataAPI = await getDataApi(pageNum, rowsPerPage);
      const dataLoaded = await formatedData(dataAPI.samples);
      setCount(dataAPI.total);
      setPage(Number(dataAPI.page));
      setIsLoading(false);
      return dataLoaded;
    },
    [getDataApi, rowsPerPage],
  );

  const columns = [
    {
      name: 'id',
      label: 'Id',
      options: {
        filter: false,
        sort: true,
        viewColumns: false,
        // infinite scrolling
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const value = data[dataIndex].id;

          if (rowIndex === data.length - 10) {
            return (
              <>
                <Waypoint
                  onEnter={async () => {
                    const newPage = Number(page) + 1;
                    const newData = await getNewData(newPage);
                    setData([...data, ...newData]);
                  }}
                />
                {value}
              </>
            );
          }
          return <>{value}</>;
        },
      },
    },
    {
      name: 'taken_date_time',
      label: 'Coletado em',
      options: {
        filter: true,
        sort: true,
        customFilterListOptions: { render: (v: string) => `Coletado: ${v}` },
        filterOptions: {
          names: takenDateFilter,
        },
      },
    },
    {
      name: 'sample_type',
      label: 'Tipo de Amostra',
      options: {
        filter: true,
        sort: true,
        customFilterListOptions: {
          render: (v: string) => `Tipo de Amostra: ${v}`,
        },
        filterOptions: {
          names: sampleTypesFilter,
        },
      },
    },
    {
      name: 'collection_point',
      label: 'Ponto de Coleta',
      options: {
        filter: true,
        sort: true,
        customFilterListOptions: {
          render: (v: string) => `Ponto de coleta: ${v}`,
        },
        filterOptions: {
          names: collectionPointsFilter,
        },
      },
    },
    {
      name: 'lote',
      label: 'Lote',
      options: {
        sort: true,
        filter: true,
        filterType: 'textField' as FilterType,
        customFilterListOptions: { render: (v: string) => `Lote: ${v}` },
      },
    },
    {
      name: 'sample_conclusion',
      label: 'Parecer',
      options: {
        filter: true,
        sort: true,
        customFilterListOptions: { render: (v: string) => `Parecer: ${v}` },
        filterOptions: {
          names: sampleConclusionFilter,
        },
      },
    },
    {
      name: 'sample_status',
      label: 'Status',
      options: {
        filter: true,
        sort: true,
        customFilterListOptions: { render: (v: string) => `Status: ${v}` },
        filterOptions: {
          names: sampleStatusFilter,
        },
      },
    },
  ];

  const loadSamples = useCallback(
    async (defaultPage?: number): Promise<void> => {
      setIsLoading(true);
      const dataAPI = await getDataApi(defaultPage || 1, rowsPerPage);
      const dataLoaded = await formatedData(dataAPI.samples);

      setData(dataLoaded);
      setCount(dataAPI.total);
      setPage(Number(dataAPI.page));
      setIsLoading(false);
    },
    [getDataApi],
  );

  const loadFilters = useCallback(async (): Promise<void> => {
    apiXiloliteCQ
      .get('/filterByTable?fieldTable=sample_type')
      .then(res => res.data.data.map((t: IAuxiliar) => t.value))
      .then(dataAuxiliar => setSampleTypesFilter(dataAuxiliar || []));

    apiXiloliteCQ
      .get('/filterByTable?fieldTable=collection_point')
      .then(res => res.data.data.map((t: IAuxiliar) => t.value))
      .then(dataAuxiliar => setCollectionPointsFilter(dataAuxiliar || []));

    apiXiloliteCQ
      .get('/filterByTable?fieldTable=sample_status')
      .then(res => res.data.data.map((t: IAuxiliar) => t.value))
      .then(dataAuxiliar => setSampleStatusFilter(dataAuxiliar || []));

    apiXiloliteCQ
      .get('/filterByTable?fieldTable=sample_conclusion')
      .then(res => res.data.data.map((t: IAuxiliar) => t.value))
      .then(dataAuxiliar => setSampleConclusionFilter(dataAuxiliar || []));

    setTakenDateFilter(['Hoje', 'Últimas 24h', 'Últimas 48h', 'Últimas 72h']);
  }, []);

  useEffect(() => {
    loadFilters();
    loadSamples();
  }, [loadFilters, loadSamples]);

  const handleFilterSubmit = useCallback(applyFilters => {
    const filterList = applyFilters();
    setIsLoading(true);

    // console.log('handleFilterSubmit', filterList);

    const arrayFilter = [''];

    if (filterList[1].length > 0) {
      const dateFilter = new Date();
      dateFilter.setMinutes(0);
      dateFilter.setSeconds(0);

      // console.log('dateFilter antes', dateFilter);
      switch (filterList[1][0]) {
        case 'Hoje':
          dateFilter.setHours(0);
          break;
        case 'Últimas 24h':
          dateFilter.setHours(dateFilter.getHours() - 24);
          break;
        case 'Últimas 48h':
          dateFilter.setHours(dateFilter.getHours() - 48);
          break;
        case 'Últimas 72h':
          dateFilter.setHours(dateFilter.getHours() - 72);
          break;
        default:
          break;
      }

      const year = dateFilter.getFullYear();
      const month = dateFilter.getMonth() + 1;
      const day = dateFilter.getDate();
      const hour = dateFilter.getHours();

      const dateFilterStr = `${year}-${month}-${day} ${hour}:00:00`;

      arrayFilter.push(`taken_date_time>='${dateFilterStr}'`);
    }

    if (filterList[2].length > 0) {
      arrayFilter.push(`sample_type='${filterList[2]}'`);
    }

    if (filterList[3].length > 0) {
      arrayFilter.push(`collection_point='${filterList[3]}'`);
    }

    if (filterList[4].length > 0) {
      arrayFilter.push(`lote='${filterList[4]}'`);
    }

    if (filterList[5].length > 0) {
      arrayFilter.push(`sample_conclusion='${filterList[5]}'`);
    }

    if (filterList[6].length > 0) {
      arrayFilter.push(`sample_status='${filterList[6]}'`);
    }

    let newFilterQuery = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const f of arrayFilter) {
      if (newFilterQuery === '') {
        newFilterQuery += f;
      } else {
        newFilterQuery = `${newFilterQuery} AND ${f}`;
      }
    }

    setFilterData(newFilterQuery);
    setPage(Number(1));

    setIsLoading(false);
  }, []);

  const options = {
    download: true,
    print: true,
    filter: true,
    search: false,
    fixedHeader: true,
    responsive: 'vertical' as Responsive,
    selectableRows: 'none' as SelectableRows,
    pagination: false,
    tableBodyHeight: `${Math.trunc(Number(window.innerHeight * 0.7))}px`,

    serverSide: true,
    // makes it so filters have to be "confirmed" before being applied to the
    // table's internal filterList
    confirmFilters: true,

    // Calling the applyNewFilters parameter applies the selected filters to the table
    customFilterDialogFooter: (currentFilterList, applyNewFilters) => {
      return (
        <div style={{ marginTop: '40px' }}>
          <Button
            variant="contained"
            onClick={() => handleFilterSubmit(applyNewFilters)}
          >
            Aplicar Filtros
          </Button>
        </div>
      );
    },

    onFilterChange: (column, filterList, type) => {
      if (type === 'chip') {
        const newFilters = (): any => filterList;
        // console.log('updating filters via chip', newFilters);
        handleFilterSubmit(newFilters);
      }
    },

    onColumnSortChange: (changedColumn, direction) => {
      let order = 'desc';
      if (direction === 'asc') {
        order = 'asc';
      }

      setSortOrder(`${changedColumn} ${order}`);
    },

    textLabels: {
      body: {
        noMatch: 'Desculpe, não há registros para exibir!',
      },
      filter: {
        all: 'Todos os registros',
        title: 'Filtros',
        reset: 'Limpar filtros',
      },
      selectedRows: {
        text: 'rows has been deleted',
        delete: 'Delete Row',
        deleteAria: 'Deleted Selected Rows',
      },
    },
  };

  const titleTable = (
    <Typography variant="h5">
      Amostras{' '}
      <span style={{ fontSize: 15, position: 'relative', top: -2 }}>
        ({new Intl.NumberFormat().format(data.length)} de{' '}
        {new Intl.NumberFormat().format(count)} )
      </span>
      {isLoading && (
        <CircularProgress
          size={24}
          style={{ marginLeft: 15, position: 'relative', top: 4 }}
        />
      )}
    </Typography>
  );

  return (
    <PageContainer>
      <MUIDataTable
        title={titleTable}
        data={data}
        columns={columns}
        options={options}
      />
    </PageContainer>
  );
};

export default MyLIMsSamples;
