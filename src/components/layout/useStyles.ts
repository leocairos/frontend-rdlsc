import { createMuiTheme, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paperTitle: {
    backgroundColor: '#f3f3f3',
    margin: -16,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paperModal: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #f3f3f3',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const getMuiTheme = (): Theme =>
  createMuiTheme({
    overrides: {
      MuiToolbar: {
        root: {
          backgroundColor: '#f3f3f3',
        },
      },
      MuiGridListTile: {
        root: {
          backgroundColor: '##fff',
          // minWidth: '12em',
        },
      },
      // handles row hover color and selected row color
      MuiTableRow: {
        hover: {
          '&$root': {
            '&:hover': { backgroundColor: 'cyan' },
          },
        },
      },
    },
  });

export default useStyles;
