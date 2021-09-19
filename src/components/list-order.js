import React, { useEffect, useState, useRef } from "react";
import {
  Paper,
  Typography,
  Table,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
  GridList,
  Card,
  CardContent,
  Box,
  Button,
  CardMedia,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
// import axios from "axios";
import auth from "../auth/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  rootTotal: {
    // display: "flex",
    // flexWrap: "wrap",
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F5F5F5",
  },
  gridList: {
    width: 744,
    height: 650,
  },
  image: {
    width: 100,
    height: 100,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

let total = 0;
function ListOrder({ current, setCurrent, order, setOrder }) {
  const classes = useStyles();
  const hasErrors = false;
  const history = useHistory();

  const socketRef = useRef();
  const url = "ws://localhost:8000/item";
  // const url = "wss://server-shopping-cart-srtknk-cxnam-ews.education.wise-paas.com/item";
  useEffect(() => {
    socketRef.current = new WebSocket(url);

    if (!socketRef.current) return;
    socketRef.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data) {
        console.log(data);
        if (data.message === "add") {
          setCurrent(data);
          console.log(order);
          setOrder((order) => [...order, data]);
          console.log(total);
          total += data.price;
        } else if (data.message === "delete") {
          alert(`Product ${data.code} has been remove!`);
          setCurrent(null);
          const temp = order.filter((item) => item.code !== data.code);
          setOrder(temp);
          console.log(total);
          total -= data.price;
        }
      }
    };
    socketRef.current.onclose = () => {
      console.log("End WebSocket");
      return () => {
        socketRef.current.close();
      };
    };

    // eslint-disable-next-line
  }, [total]);

  const handlePurchase = async () => {
    try {
      const data = await auth.sendOrder(order);
      if (data) {
        console.log(data);
      }
      history.push("/payment");
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickItem = (item) => {
    setCurrent(item);
  };

  return (
    <div>
      <div className={classes.root}>
        {hasErrors && (
          <Paper className={classes.paper}>
            <Typography component="p">
              An error has occurred, please try reloading the page.
            </Typography>
          </Paper>
        )}
        {!hasErrors && (
          <GridList
            // onChange={handleChange}
            className={classes.gridList}
            cols={1}
          >
            <Table className={classes.table}>
              {/* <TableHead>
                <TableRow>
                  <TableCell>Order Id</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total Items</TableCell>
                  <TableCell>Cost</TableCell>
                </TableRow>
              </TableHead> */}
              <TableBody>
                {order.map((item) => (
                  <TableRow
                    hover
                    className={classes.tableRow}
                    key={item.code}
                    onClick={() => handleClickItem(item)}
                  >
                    <TableCell component="th" scope="row">
                      {item.code}
                    </TableCell>
                    <TableCell width="5%">
                      <CardMedia
                        className={classes.image}
                        image={require(`../images/${item.code}.jpg`).default}
                        title={item.name}
                      />
                    </TableCell>
                    <TableCell width="50%">{item.name}</TableCell>
                    {/* <TableCell>{(item.items && item.items.length) || 0}</TableCell> */}
                    <TableCell>{/*item.items*/}1</TableCell>
                    <TableCell>{item.price} VNĐ</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GridList>
        )}
      </div>
      <Card className={classes.rootTotal}>
        <CardContent>
          <Typography component="div" variant="h5" gutterBottom>
            <Box textAlign="left" m={1}>
              <strong>Total</strong>
            </Box>
            <div>{total}</div>
          </Typography>
          <Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handlePurchase}
            >
              Purchase
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
export default ListOrder;
