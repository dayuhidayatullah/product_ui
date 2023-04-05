import { Edit } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
  Grid,
  IconButton,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import moment from "moment";

import React, { useEffect, useState } from "react";

const ProductModal = ({
  open,
  headerText,
  handleClose,
  handleSubmit,
  isAddForm,
  detailProduct,
}) => {
  const [data, setData] = useState({
    name: "",
    qty: "",
    picture: "",
    expiredAt: null,
    isActive: false,
  });
  useEffect(() => {
    if (detailProduct !== {} && !isAddForm) {
      setData({
        name: detailProduct.name,
        qty: detailProduct.qty,
        picture: detailProduct.picture,
        expiredAt: detailProduct.expiredAt
          ? moment(detailProduct.expiredAt).format("YYYY-MM-DD")
          : null,
      });
    }
    return () => {
      setData({
        name: "",
        qty: "",
        picture: "",
        expiredAt: null,
        isActive: false,
      });
    };
  }, [detailProduct]);
  const handleChange = (value, key) => {
    setData({ ...data, [key]: value });
  };
  return (
    <Dialog open={open} maxWidth="xl">
      <DialogTitle>{headerText}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {!isAddForm && (
            <Grid item xs={12} md={6}>
              <TextField
                autoFocus
                value={detailProduct.id}
                margin="dense"
                id="id"
                label="Product ID"
                fullWidth
                variant="outlined"
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              ></TextField>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <TextField
              autoFocus
              value={data.name}
              margin="dense"
              id="name"
              label="Product Name"
              fullWidth
              variant="outlined"
              placeholder="Enter Your Product Name"
              onChange={(e) => handleChange(e.target.value, "name")}
              InputLabelProps={{
                shrink: true,
              }}
            ></TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              autoFocus
              margin="dense"
              value={data.qty}
              id="qty"
              label="Product Quantity"
              fullWidth
              variant="outlined"
              placeholder="Enter Your Product Quantity"
              type="number"
              onChange={(e) => handleChange(e.target.value, "qty")}
              InputProps={{
                inputProps: {
                  min: 0,
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            ></TextField>
          </Grid>
          {!isAddForm && (
            <Grid item xs={12} md={6}>
              <Typography>Product Active</Typography>
              <FormGroup
                sx={{ display: "flex", flexDirection: "row" }}
                label="Is Active"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={detailProduct.isActive === true}
                      disableTouchRipple
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={detailProduct.isActive === false}
                      disableTouchRipple
                    />
                  }
                  label="Not Active"
                />
              </FormGroup>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <TextField
              autoFocus
              margin="dense"
              value={data.expiredAt}
              id="expiredAt"
              label="Product Expired"
              placeholder="Enter Your Product Expired"
              fullWidth
              variant="outlined"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => handleChange(e.target.value, "expiredAt")}
            ></TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              autoFocus
              margin="dense"
              value={data.picture}
              id="picture"
              label="Product Picture"
              fullWidth
              variant="outlined"
              onChange={(e) => handleChange(e.target.value, "picture")}
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={"Enter Base64 Your Image"}
            ></TextField>
          </Grid>
          {!isAddForm && (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              direction="column"
              sx={{ marginTop: "30px" }}
            >
              <Grid item md={12} xs={12} xl={12}>
                <img src={data.picture} alt={"Product Picture"} />
              </Grid>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ marginRight: "10px" }}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleSubmit(data);
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;
