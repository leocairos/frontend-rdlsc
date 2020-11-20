import React, { useCallback, useEffect, useState } from 'react';
import { Waypoint } from 'react-waypoint';
import MUIDataTable from 'mui-datatables';

import { format } from 'date-fns';

import {
  Button,
  CircularProgress,
  Grid,
  MuiThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import PageContainer from '../../components/common/PageContainer';
import { apiXiloliteCQ } from '../../services/api';
import { useToast } from '../../hooks/toast';
import {
  IAuxiliar,
  IDataSampleAnalysis,
  IDataSample,
} from './MylimsSampleTypes';

import { formatedData } from './MylimsSamplesUtil';

import useStyles, { getMuiTheme } from '../../components/layout/useStyles';
import MylimsSamplesDetail from './MylimsSamplesDetail';

const MyLIMsSamples: React.FC = () => {
  const { addToast } = useToast();
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
  const [updatedAtFilter, setUpdatedAtFilter] = useState<string[]>([]);

  const classes = useStyles();
  const [openDetail, setOpenDetail] = useState(false);
  const [sampleAnalysis, setSampleAnalysis] = useState<IDataSampleAnalysis[]>([
    {},
  ]);

  const getDataApi = useCallback(
    async (pageNum: number, pageSize: number, orderby?: string) => {
      let urlGet = `/samples/samplesHeader?page=${pageNum}&pageSize=${pageSize}`;
      urlGet += `&filters=${filterData}`;
      urlGet += `&orderby=${orderby || sortOrder}`;

      // console.log(urlGet);
      const response = await apiXiloliteCQ.get(urlGet);
      return response.data;
    },
    [filterData, sortOrder],
  );

  const getDataApiAnalysis = useCallback(
    async (sampleId: number) => {
      const urlGet = `/samples/samples/${sampleId}/analysis`;

      // console.log(urlGet);
      try {
        const response = await apiXiloliteCQ.get(urlGet);
        return response.data;
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: `${err.response.data.message}`,
        });
      }
    },
    [addToast],
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

  const loadSamples = useCallback(
    async (defaultPage?: number): Promise<void> => {
      try {
        setIsLoading(true);
        const dataAPI = await getDataApi(defaultPage || 1, rowsPerPage);
        const dataLoaded = await formatedData(dataAPI.samples);

        setData(dataLoaded);
        setCount(dataAPI.total);
        setPage(Number(dataAPI.page));
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        addToast({
          type: 'error',
          title: 'Erro ao carregar registros',
          description: `${err.response.data.message}`,
        });
      }
    },
    [addToast, getDataApi],
  );

  const loadFilters = useCallback(async (): Promise<void> => {
    try {
      apiXiloliteCQ
        .get('/samples/filterByTable?fieldTable=sample_type')
        .then(res => res.data.data.map((t: IAuxiliar) => t.value))
        .then(dataAuxiliar => setSampleTypesFilter(dataAuxiliar || []));

      apiXiloliteCQ
        .get('/samples/filterByTable?fieldTable=collection_point')
        .then(res => res.data.data.map((t: IAuxiliar) => t.value))
        .then(dataAuxiliar => setCollectionPointsFilter(dataAuxiliar || []));

      apiXiloliteCQ
        .get('/samples/filterByTable?fieldTable=sample_status')
        .then(res => res.data.data.map((t: IAuxiliar) => t.value))
        .then(dataAuxiliar => setSampleStatusFilter(dataAuxiliar || []));

      apiXiloliteCQ
        .get('/samples/filterByTable?fieldTable=sample_conclusion')
        .then(res => res.data.data.map((t: IAuxiliar) => t.value))
        .then(dataAuxiliar => setSampleConclusionFilter(dataAuxiliar || []));

      setUpdatedAtFilter(['Hoje', 'Últimas 24h', 'Últimas 48h', 'Últimas 72h']);
    } catch (err) {
      setIsLoading(false);
      addToast({
        type: 'error',
        title: 'Erro ao carregar registros',
        description: `${err.response.data.message}`,
      });
    }
  }, [addToast]);

  useEffect(() => {
    loadFilters();
    loadSamples();
  }, [loadFilters, loadSamples]);

  const handleFilterSubmit = useCallback(applyFilters => {
    const filterList = applyFilters();
    setIsLoading(true);

    const arrayFilter = [''];

    if (filterList[1]?.length > 0) {
      if (filterList[1][0]?.length > 0) {
        arrayFilter.push(`taken_date_time>='${filterList[1][0]} 00:00:00'`);
      }
      if (filterList[1][1]?.length > 0) {
        arrayFilter.push(`taken_date_time<='${filterList[1][1]} 23:59:59'`);
      }
    }

    if (filterList[2].length > 0) {
      const updateAtFilter = new Date();
      updateAtFilter.setMinutes(0);
      updateAtFilter.setSeconds(0);

      switch (filterList[2][0]) {
        case 'Hoje':
          updateAtFilter.setHours(0);
          break;
        case 'Últimas 24h':
          updateAtFilter.setHours(updateAtFilter.getHours() - 24);
          break;
        case 'Últimas 48h':
          updateAtFilter.setHours(updateAtFilter.getHours() - 48);
          break;
        case 'Últimas 72h':
          updateAtFilter.setHours(updateAtFilter.getHours() - 72);
          break;
        default:
          break;
      }

      const year = updateAtFilter.getFullYear();
      const month = updateAtFilter.getMonth() + 1;
      const day = updateAtFilter.getDate();
      const hour = updateAtFilter.getHours();

      const updateAtFilterStr = `${year}-${month}-${day} ${hour}:00:00`;

      arrayFilter.push(`updated_at>='${updateAtFilterStr}'`);
    }

    if (filterList[3].length > 0) {
      arrayFilter.push(`sample_type='${filterList[3]}'`);
    }

    if (filterList[4].length > 0) {
      arrayFilter.push(`collection_point='${filterList[4]}'`);
    }

    if (filterList[5].length > 0) {
      arrayFilter.push(`lote='${filterList[5]}'`);
    }

    if (filterList[6].length > 0) {
      arrayFilter.push(`sample_conclusion='${filterList[6]}'`);
    }

    if (filterList[7].length > 0) {
      arrayFilter.push(`sample_status='${filterList[7]}'`);
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

  const columns = [
    {
      name: 'id',
      label: 'Id',
      options: {
        filter: false,
        sort: true,
        viewColumns: false,
        draggable: false,

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
        viewColumns: true,
        filter: true,
        filterType: 'custom' as const,
        customFilterListOptions: {
          render: v => {
            if (v[0] && v[1]) {
              const dateFrom = new Date(`${v[0]} 00:00`);
              const dateFromStr = format(new Date(dateFrom), 'dd/MM/yyyy');
              const dateTo = new Date(`${v[1]} 00:00`);
              const dateToStr = format(new Date(dateTo), 'dd/MM/yyyy');
              return `Coleta de '${dateFromStr}' até '${dateToStr}'`;
            }
            if (v[0]) {
              const dateFrom = new Date(`${v[0]} 00:00`);
              const dateFromStr = format(new Date(dateFrom), 'dd/MM/yyyy');
              return `Coleta desde: ${dateFromStr}`;
            }
            if (v[1]) {
              const dateTo = new Date(`${v[1]} 00:00`);
              const dateToStr = format(new Date(dateTo), 'dd/MM/yyyy');
              return `Coleta até:${dateToStr}`;
            }
            return [];
          },
          update: (filterList, filterPos, index) => {
            if (filterPos === 0) {
              filterList[index].splice(filterPos, 1, '');
            } else if (filterPos === 1) {
              filterList[index].splice(filterPos, 1);
            } else if (filterPos === -1) {
              // eslint-disable-next-line no-param-reassign
              filterList[index] = [];
            }
            const newFilters = (): any => filterList;
            handleFilterSubmit(newFilters);
            return filterList;
          },
        },
        filterOptions: {
          names: [],

          display: (filterList, onChange, index, column) => (
            <>
              <TextField
                id="takenDateFrom"
                label="Coleta desde"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={filterList[index][0] || ''}
                onChange={event => {
                  // eslint-disable-next-line no-param-reassign
                  filterList[index][0] = event.target.value;
                  onChange(filterList[index], index, column);
                }}
              />
              <TextField
                id="takenDateTo"
                label="Coleta até"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={filterList[index][1] || ''}
                onChange={event => {
                  // eslint-disable-next-line no-param-reassign
                  filterList[index][1] = event.target.value;
                  onChange(filterList[index], index, column);
                }}
              />
            </>
          ),
        },
        print: false,
      },
    },
    {
      name: 'updated_at',
      label: 'Atualizado em',
      options: {
        display: false,
        filter: true,
        sort: true,
        customFilterListOptions: { render: (v: string) => `Atualizado: ${v}` },
        filterOptions: {
          names: updatedAtFilter,
        },
      },
    },
    {
      name: 'sample_type',
      label: 'Tipo de Amostra',
      options: {
        filter: true,
        sort: true,
        display: false,
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
        display: false,
        filterType: 'textField' as const,
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

  const options = {
    download: true,

    downloadOptions: {
      filename: 'excel-format.csv',
      separator: ';',
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true,
      },
    },

    onDownload: (buildHead, buildBody, columnsDownload, dataDownload) => {
      return `\uFEFF${buildHead(columnsDownload)}${buildBody(dataDownload)}`;
    },

    print: true,
    filter: true,
    search: false,
    fixedHeader: true,
    responsive: 'standard' as const, // vertical, standard, simple
    selectableRows: 'single' as const,
    selectableRowsHideCheckboxes: true,
    selectableRowsHeader: false,
    selectableRowsOnClick: true,
    selectToolbarPlacement: 'none' as const, // 'replace' | 'above' 'none'

    draggableColumns: {
      enabled: true,
      transitionTime: 300,
    },

    onCellClick: async (cellData, cellMeta) => {
      // console.log('Sample Id', data[cellMeta.dataIndex]?.id);
      // console.log('cellMeta', cellMeta);
      // console.log('cellData', cellData);

      if (cellMeta.colIndex === 0) {
        const sampleAnalysisGet = await getDataApiAnalysis(
          data[cellMeta.dataIndex]?.id || 0,
        );

        setSampleAnalysis(sampleAnalysisGet.samplesAnalysis);

        // console.log(sampleAnalysis);
        setOpenDetail(true);
      }
    },

    // rowHover: true,
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
        toolTip: 'Ordenar',
        columnHeaderTooltip: column => `Ordenar por ${column.label}`,
      },
      filter: {
        all: 'Todos os registros',
        title: 'Filtros',
        reset: 'Limpar filtros',
      },
      toolbar: {
        search: 'Localizar',
        downloadCsv: 'Download CSV',
        print: 'Imprimir',
        viewColumns: 'Exibir Colunas',
        filterTable: 'Filtrar registros',
      },
      viewColumns: {
        title: 'Exibir colunas',
        titleAria: 'Exibir/Ocultar colunas',
      },
      selectedRows: {
        text: 'Registros selecionados',
      },
    },

    customToolbar: () => {
      return (
        <>
          <Tooltip title="Incluir registro">
            <IconButton onClick={() => console.log('clicked +')}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Alterar registro">
            <IconButton onClick={() => console.log('clicked *')}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </>
      );
    },
  };

  const titleTable = (
    <Typography variant="h5">
      Amostras{' '}
      {!isLoading && (
        <span style={{ fontSize: 15, position: 'relative', top: -2 }}>
          ({new Intl.NumberFormat().format(data.length)} de{' '}
          {new Intl.NumberFormat().format(count)} )
        </span>
      )}
      {isLoading && (
        <CircularProgress
          size={24}
          style={{ marginLeft: 15, position: 'relative', top: 4 }}
        />
      )}
    </Typography>
  );

  const dataTable = (
    <MUIDataTable
      title={titleTable}
      data={data}
      columns={columns}
      options={options}
    />
  );

  return (
    <PageContainer>
      <MuiThemeProvider theme={getMuiTheme()}>
        {openDetail ? <MylimsSamplesDetail /> : dataTable}
      </MuiThemeProvider>
    </PageContainer>
  );
};

/*
<Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openDetail}>
          <div className={classes.paperModal}>
            {sampleAnalysis[0] && (
              <h5>Amostra: {sampleAnalysis[0]?.sample_id}</h5>
            )}
            <Table size="small" aria-label="Análises">
              <TableHead>
                <TableRow>
                  <TableCell>Método</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Parecer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleAnalysis.map(row => (
                  <TableRow key={row.id?.toString() || '0'}>
                    <TableCell component="th" scope="row">
                      {row.analise}
                    </TableCell>
                    <TableCell align="right">
                      {row.display_value} {row.measurement_unit}
                    </TableCell>
                    <TableCell>{row.conclusion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button variant="contained" onClick={() => setOpenDetail(false)}>
              Fechar
            </Button>
          </div>
        </Fade>
      </Modal>

      */
export default MyLIMsSamples;
