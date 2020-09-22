import React, { useCallback, useEffect, useState } from 'react';
import { Waypoint } from 'react-waypoint';
import MUIDataTable, { Responsive, SelectableRows } from 'mui-datatables';

import { format } from 'date-fns';

import { Button, CircularProgress, Typography } from '@material-ui/core';

import PageContainer from '../../components/common/PageContainer';

import { apiXiloliteCQ } from '../../services/api';

interface IDataSample {
  id?: number;
  type?: string;
  takenDateTime?: string;
  sampleCollectionPoint?: string;
  sampleConclusion?: string;
  updated_at?: string;
  sampleStatus?: string;
}

export interface ISampleAPIResponse {
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
      type: sample.sample_type,
      takenDateTime: sample.taken_date_time
        ? format(new Date(sample.taken_date_time), 'dd/MM/yyyy HH:mm')
        : '',
      sampleCollectionPoint: sample.collection_point,
      updated_at: sample.updated_at
        ? format(new Date(sample.updated_at), 'dd/MM/yyyy HH:mm')
        : '',
      sampleConclusion: sample.sample_conclusion,
      sampleStatus: sample.sample_status,
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
  const rowsPerPage = 20;
  const [sampleTypesFilter, setSampleTypesFilter] = useState([]);
  const [collectionPointsFilter, setCollectionPointsFilter] = useState([]);

  // const [sortOrder, setSortOrder] = useState({});

  const getDataApi = useCallback(
    async (pageNum: number, pageSize: number) => {
      const urlGet = `/samplesHeader?page=${pageNum}&pageSize=${pageSize}&filter=${filterData}`;

      console.log(
        'getDataAPI ====    \nurlGet',
        urlGet,
        '\nfilterData',
        filterData,
      );
      const response = await apiXiloliteCQ.get(urlGet);
      return response.data;
    },
    [filterData],
  );

  const getNewData = useCallback(
    async (pageNum: number) => {
      setIsLoading(true);
      const dataAPI = await getDataApi(pageNum, rowsPerPage);
      const dataLoaded = await formatedData(dataAPI.samples);
      // setData(dataLoaded);
      setCount(dataAPI.total);
      setPage(Number(dataAPI.page));
      // setSortOrder(sortOrder);
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
        sort: false,
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
                {value}*
              </>
            );
          }
          return <>{value}</>;
        },
      },
    },
    {
      name: 'takenDateTime',
      label: 'Coletado em',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'type',
      label: 'Tipo de Amostra',
      options: {
        filter: true,
        customFilterListOptions: { render: v => `Tipo de Amostra: ${v}` },
        filterOptions: {
          names: sampleTypesFilter,
        },
      },
    },
    {
      name: 'sampleCollectionPoint',
      label: 'Ponto de Coleta',
      options: {
        filter: true,
        customFilterListOptions: { render: v => `Ponto de coleta: ${v}` },
        filterOptions: {
          names: collectionPointsFilter,
        },
      },
    },
    {
      name: 'lote',
      label: 'Lote',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'sampleConclusion',
      label: 'Parecer',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'sampleStatus',
      label: 'Status',
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  const loadSamples = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const dataAPI = await getDataApi(1, rowsPerPage);
    const dataLoaded = await formatedData(dataAPI.samples);

    setData(dataLoaded);
    setCount(dataAPI.total);
    setPage(Number(dataAPI.page));
    setIsLoading(false);
  }, [getDataApi]);

  useEffect(() => {
    const loadFilters = async (): Promise<void> => {
      const responseSampleTypes = await apiXiloliteCQ.get(
        'auxiliar?table=sample_types',
      );
      const dataType = responseSampleTypes.data.data.map(t => t.identification);
      await Promise.all(dataType);
      setSampleTypesFilter(dataType || []);

      const respCollectionPoints = await apiXiloliteCQ.get(
        'auxiliar?table=collection_points',
      );
      const collectionPoints = respCollectionPoints.data.data.map(
        t => t.identification,
      );
      await Promise.all(collectionPoints);
      setCollectionPointsFilter(collectionPoints || []);
    };

    loadFilters();
    loadSamples();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit = useCallback(applyFilters => {
    const filterList = applyFilters();
    setIsLoading(true);

    console.log('handleFilterSubmit', filterList);

    const arrayFilter = [''];

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
    console.log('filterData in handleFilter', filterData);

    loadSamples();

    setIsLoading(false);
  }, []);

  const options = {
    download: false,
    print: false,
    filter: true,
    fixedHeader: true,
    responsive: 'vertical' as Responsive,
    selectableRows: 'none' as SelectableRows,
    pagination: false,
    tableBodyHeight: '500px',

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
            Apply Filters
          </Button>
        </div>
      );
    },

    // callback that gets executed when filters are confirmed
    onFilterConfirm: filterList => {
      console.log('onFilterConfirm', filterList);
    },

    onFilterDialogOpen: () => {
      console.log('filter dialog opened');
    },
    onFilterDialogClose: () => {
      console.log('filter dialog closed');
    },
    onFilterChange: (column, filterList, type) => {
      if (type === 'chip') {
        const newFilters = () => filterList;
        console.log('updating filters via chip', newFilters);
        handleFilterSubmit(newFilters);
      }
    },
  };

  const titleTable = (
    <Typography variant="h3">
      Amostras
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
      <Typography variant="h6">
        {data.length} de {count} filterData: {filterData}
        {isLoading && (
          <CircularProgress
            size={24}
            style={{ marginLeft: 15, position: 'relative', top: 4 }}
          />
        )}
      </Typography>
    </PageContainer>
  );
};

export default MyLIMsSamples;

/*
import React, { useState, useEffect, useCallback } from 'react';
import MUIDataTable from 'mui-datatables';
import { format } from 'date-fns';

import { CircularProgress, Typography } from '@material-ui/core';
import PageContainer from '../../components/common/PageContainer';

import { apiXiloliteCQ } from '../../services/api';

interface IDataSample {
  id?: number;
  type?: string;
  takenDateTime?: string;
  sampleCollectionPoint?: string;
  sampleConclusion?: string;
  currentStatusEditionDateTime?: string;
  sampleStatus?: string;
}

export interface ISampleAPIResponse {
  id: number;
  sampleType: { id: number; identification: string };
  takenDateTime: Date;
  sampleConclusion: { id: number; identification: string };
  sampleCollectionPoint: { id: number; identification: string };
  updated_at: Date;
  sampleStatus: { id: number; identification: string };
}

const columns = [
  {
    name: 'id',
    label: 'Id',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'takenDateTime',
    label: 'Coletado em',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'type',
    label: 'Tipo de amostra',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'sampleCollectionPoint',
    label: 'Ponto de Coleta',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'currentStatusEditionDateTime',
    label: 'Atualizado em',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'sampleConclusion',
    label: 'Parecer',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'sampleStatus',
    label: 'Status',
    options: {
      filter: true,
      sort: true,
    },
  },
];

const formatedData = async (
  samples: ISampleAPIResponse[],
): Promise<IDataSample[]> => {
  const dataFormated = samples.map((sample: ISampleAPIResponse) => {
    return {
      id: sample.id,
      type: sample.sampleType?.identification,
      takenDateTime: sample.takenDateTime
        ? format(new Date(sample.takenDateTime), 'dd/MM/yyyy HH:mm')
        : '',
      sampleCollectionPoint: sample.sampleCollectionPoint?.identification,
      currentStatusEditionDateTime: sample.updated_at
        ? format(new Date(sample.updated_at), 'dd/MM/yyyy HH:mm')
        : '',

      sampleConclusion: sample.sampleConclusion?.identification,
      sampleStatus: sample.sampleStatus?.identification,
    };
  });

  await Promise.all(dataFormated);

  return dataFormated as IDataSample[];
};

const MylimsSamples: React.FC = () => {
  const [data, setData] = useState<IDataSample[]>([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState({});

  const getDataApi = useCallback(async (numPage: number, pageSize: number) => {
    const response = await apiXiloliteCQ.get(
      `/samples?page=${numPage}1&pageSize=${pageSize}`,
    );
    return response.data;
  }, []);

  const changePage = useCallback(
    async (numPage, sortOrder) => {
      setIsLoading(true);
      const dataAPI = await getDataApi(numPage, rowsPerPage);
      const dataLoaded = await formatedData(dataAPI.samples);
      // console.log(dataLoaded);
      setData(dataLoaded);
      setCount(dataAPI.total);
      setPage(dataAPI.page);
      setSortOrder(sortOrder);

      setIsLoading(false);
    },
    [getDataApi, rowsPerPage],
  );

  const changeRowsPerPage = useCallback(
    async (numRows: number) => {
      setRowsPerPage(numRows);
      changePage(page, sortOrder);
    },
    [changePage, page, sortOrder],
  );

  useEffect(() => {
    async function loadSamples(): Promise<void> {
      // console.log('Getting sample in API...');
      setIsLoading(true);
      const dataAPI = await getDataApi(1, rowsPerPage);
      const dataLoaded = await formatedData(dataAPI.samples);
      // console.log(dataLoaded);
      setData(dataLoaded);
      setCount(dataAPI.total);
      setPage(dataAPI.page);
      setIsLoading(false);
    }

    loadSamples();
  }, []);

  const options = {
    textLabels: {
      body: {
        noMatch: 'Desculpe, nenhum registro correspondente encontrado',
        toolTip: 'Ordenar',
        columnHeaderTooltip: column => `Ordenar por ${column.label}`,
      },
    },
    // filterType: 'checkbox',
    filter: true,
    // filterType: 'dropdown',
    // responsive: 'vertical',
    serverSide: true,
    count,
    rowsPerPage,
    jumpToPage: true,
    rowsPerPageOptions: [10, 20, 30, 50, 100],
    // sortOrder,
    // onChangeRowsPerPage: () => {
    //  console.log('rowsPerPage', rowsPerPage);
    // changePage(page, sortOrder);
    // },
    onTableChange: (action, tableState) => {
      // console.log('action: ', action, '\ntableState:', tableState);

      // a developer could react to change on an action basis or
      // examine the state as a whole and do whatever they want

      switch (action) {
        case 'changePage':
          changePage(tableState.page, tableState.sortOrder);
          break;
        case 'sort':
          // this.sort(tableState.page, tableState.sortOrder);
          break;
        case 'changeRowsPerPage':
          changeRowsPerPage(tableState.rowsPerPage);
          break;
        default:
        // console.log('action not handled.');
      }
    },
  };

  const titleTable = (
    <Typography variant="h5">
      Amostras
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

export default MylimsSamples;
*/
