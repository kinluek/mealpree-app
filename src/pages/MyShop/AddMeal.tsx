import 'date-fns';
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { Button, makeStyles } from '@material-ui/core';
import { addNewMeal } from '../../firebase/functions';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    marginTop: theme.spacing(5),
  },
  dateGroup: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  submit: {
    display: 'block',
    width: '100%',
    margin: '0 auto',
  },
  alert: {
    marginBottom: theme.spacing(3),
    width: '100%',
  },
}));

export const AddMealForm: React.FunctionComponent<{ vendorId: string }> = ({ vendorId }) => {
  const classes = useStyles();

  console.log('VENDOR ID', vendorId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, handlePriceChange] = usePrice();
  const [quantity, handleQuantityChange] = useQuantity();

  const [pickupDate, handlePickupDateChange] = useDate();
  const [pickupTime, handlePickupTimeChange] = useDate();

  const [orderByDate, handleOrderByDateChange] = useDate();

  const [errorMsg, setErrorMsg] = useState('');

  const history = useHistory();

  const handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();

    if (pickupDate === null) {
      setErrorMsg('pickup date has not been set');
      return;
    }

    if (pickupTime === null) {
      setErrorMsg('pickup time has not been set');
      return;
    }
    if (orderByDate === null) {
      setErrorMsg('order by date has not been set');
      return;
    }
    if (!name) {
      setErrorMsg('name has not been set');
      return;
    }
    if (!description) {
      setErrorMsg('name has not been set');
      return;
    }
    if (!price) {
      setErrorMsg('price has not been set');
      return;
    }
    if (!quantity) {
      setErrorMsg('quantity has not been set');
      return;
    }

    addNewMeal({
      vendorId,
      name,
      description,
      price: Number(price.replaceAll('.', '')),
      quantity: Number(quantity),
      collectionDate: pickupDate,
      collectionTimeFrom: getTimeOfDayInSeconds(pickupTime),
      collectionTimeTo: getTimeOfDayInSeconds(pickupTime),
      orderBefore: orderByDate,
    }).then(() => history.push('/myshop'));
  };

  return (
    <React.Fragment>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Container className={classes.mainContainer} maxWidth="md">
          {errorMsg ? (
            <Alert className={classes.alert} severity="error" onClick={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          ) : null}
          <Typography variant="h6" gutterBottom>
            Add Meal
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="name"
                name="name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                autoComplete="given-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="description"
                name="description"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="price"
                name="price"
                label="Price"
                value={price}
                onChange={handlePriceChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">£</InputAdornment>,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="quantity"
                name="quantity"
                label="Quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Pick date and time
              </Typography>
              <Container className={classes.dateGroup}>
                <KeyboardDatePicker
                  margin="normal"
                  id="pickup-date"
                  label="Pickup date"
                  format="MM/dd/yyyy"
                  value={pickupDate}
                  onChange={handlePickupDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
                <KeyboardTimePicker
                  margin="normal"
                  id="pickup-time"
                  label="Pickup time (approx)"
                  value={pickupTime}
                  onChange={handlePickupTimeChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </Container>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Order by
              </Typography>
              <Container className={classes.dateGroup}>
                <KeyboardDatePicker
                  margin="normal"
                  id="order-by-date"
                  label="Order by date"
                  format="MM/dd/yyyy"
                  value={orderByDate}
                  onChange={handleOrderByDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
                <KeyboardTimePicker
                  margin="normal"
                  id="order-by-time"
                  label="Order by time"
                  value={orderByDate}
                  onChange={handleOrderByDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </Container>
            </Grid>
            <Grid item xs={12} justify="center">
              <Button className={classes.submit} onClick={handleSubmit} color="primary" variant="outlined">
                Add
              </Button>
            </Grid>
          </Grid>
        </Container>
      </MuiPickersUtilsProvider>
    </React.Fragment>
  );
};

const getTimeOfDayInSeconds = (date: Date): number => {
  const hours = date.getHours();
  const mins = date.getMinutes();
  const seconds = date.getSeconds();
  return 3600 * hours + 60 * mins + seconds;
};

const useDate = (): [MaterialUiPickersDate, (date: MaterialUiPickersDate) => void] => {
  const initialDate = new Date();
  initialDate.setHours(0, 0, 0, 0);
  const [date, setDate] = useState<MaterialUiPickersDate>(initialDate);

  const handleChange = (date: MaterialUiPickersDate) => {
    setDate(date);
  };

  return [date, handleChange];
};

const useQuantity = (): [string, (e: React.ChangeEvent<HTMLInputElement>) => void] => {
  const [quantity, setQuantity] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedInt = parseInt(e.target.value, 10);
    if (parsedInt < 0) {
      return;
    }
    setQuantity(e.target.value);
  };

  return [quantity, handleChange];
};

const usePrice = (): [string, (e: React.ChangeEvent<HTMLInputElement>) => void] => {
  const [price, setPrice] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    if (!isNumeric(value) && value !== '' && value !== '.') {
      return;
    }
    if (value.length > 2) {
      value = value.replace('.', '');
      const i = value.length - 2;
      value = value.slice(0, i) + '.' + value.slice(i);
    }
    setPrice(value);
  };

  return [price, handleChange];
};

const isNumeric = (str: any): boolean => {
  if (typeof str != 'string') return false;
  return !isNaN(parseFloat(str));
};

export default AddMealForm;
