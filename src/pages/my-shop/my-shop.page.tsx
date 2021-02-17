import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useUserContext } from '../../context/user.context';
import { useHistory } from 'react-router';
import { getMealsForVendor, getVendor } from '../../firebase/firestore';
import Models from '../../firebase/firestore/models';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    backgroundSize: 'cover',
    backgroundImage:
      'url("https://images.unsplash.com/photo-1609950547346-a4f431435b2b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80")',
    padding: theme.spacing(12, 0, 0),
    color: 'white',
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

type MyShopState = {
  vendorDetails: Models.Vendor;
  meals: Models.Meal[];
};

const MyShopPage: React.FunctionComponent = () => {
  const classes = useStyles();

  const { userState } = useUserContext();
  const history = useHistory();

  if (!userState?.userDoc?.associatedVendorId) {
    history.push('/');
  }

  const [shopInfo, setShopInfo] = useState<MyShopState | null>(null);

  useEffect(() => {
    if (userState?.userDoc?.associatedVendorId) {
      getShopInfo(userState.userDoc.associatedVendorId)
        .then((info) => setShopInfo(info))
        .catch(console.log);
    }
  }, [userState?.userDoc?.associatedVendorId]);

  return (
    <React.Fragment>
      {!shopInfo ? (
        <Backdrop className={classes.backdrop} open>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <main>
          {/* Hero unit */}
          <div className={classes.heroContent}>
            <Container maxWidth="md">
              <Typography component="h2" variant="h2" color="inherit" align="left" gutterBottom>
                {shopInfo.vendorDetails.businessName}
              </Typography>
            </Container>
          </div>
          <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {shopInfo.meals.map((meal) => (
                <Grid item key={meal.id} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {`${meal.name} - ${meal.price}p`}
                      </Typography>
                      <Typography>{meal.description}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary">
                        order
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
      )}
    </React.Fragment>
  );
};

const getShopInfo = async (vendorId: string): Promise<MyShopState> => {
  const [vendorDetails, meals] = await Promise.all([getVendor(vendorId), getMealsForVendor(vendorId)]);
  return { vendorDetails, meals };
};

export default MyShopPage;
