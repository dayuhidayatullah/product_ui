import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  TableSortLabel,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import MuiAlert from "@mui/material/Alert";
import { visuallyHidden } from "@mui/utils";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddProduct,
  fetchDeleteProduct,
  fetchEditProduct,
  fetchProduct,
  fetchProducts,
  setIsModalAddOrEditFormOpen,
  setIsModalConfirmationOpen,
  setProduct,
} from "./store/action";
import ProductModal from "./component/ProductModal";
import ConfirmationModal from "./component/ConfirmationModal";
import { Toaster } from "react-hot-toast";

const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "qty",
    numeric: true,
    disablePadding: false,
    label: "Quantity",
  },
  {
    id: "expiredAt",
    numeric: true,
    disablePadding: false,
    label: "Expired",
  },
  {
    id: "isActive",
    numeric: true,
    disablePadding: false,
    label: "Active",
  },
];

const DEFAULT_ORDER = "asc";
const DEFAULT_ORDER_BY = "id";
const DEFAULT_ROWS_PER_PAGE = 5;

function EnhancedTableHead(props) {
  const { order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (newOrderBy) => (event) => {
    onRequestSort(event, newOrderBy);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {/* <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          /> */}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const {
    numSelected,
    setOpenModalAddOrEdit,
    setIsAddModal,
    getDetailProduct,
    setOpenModalConfirmation,
    setIsDelete,
  } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Products
      </Typography>

      {numSelected ? (
        <>
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon
                onClick={() => {
                  setIsDelete();
                  setOpenModalConfirmation();
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton>
              <EditIcon
                onClick={() => {
                  getDetailProduct();
                  setIsAddModal(false);
                  setOpenModalAddOrEdit();
                }}
              />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip title="Add Product">
            <IconButton onClick={() => setOpenModalAddOrEdit()}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const {
    products,
    product,
    productCount,
    offset,
    limit,
    isModalAddOrEditFormOpen,
    isModalConfirmation,
    isEditSuccess,
    isAddSuccess,
  } = useSelector((state) => state);
  const [dataEdit, setDataEdit] = React.useState({});
  const [isDelete, setIsDelete] = React.useState(false);
  const [isAddModal, setIsAddModal] = React.useState(true);
  const [order, setOrder] = React.useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [selected, setSelected] = React.useState(null);
  const [page, setPage] = React.useState(offset);
  const [rowsPerPage, setRowsPerPage] = React.useState(limit);
  const [paddingHeight, setPaddingHeight] = React.useState(0);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchProducts({ page: page, limit: rowsPerPage }));
  }, [dispatch]);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleRequestSort = React.useCallback(
    (event, newOrderBy) => {
      const isAsc = orderBy === newOrderBy && order === "asc";
      const toggledOrder = isAsc ? "desc" : "asc";
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);
      dispatch(
        fetchProducts({
          page: page,
          limit: rowsPerPage,
          sortDir: toggledOrder,
          sortBy: newOrderBy,
        })
      );
    },
    [order, orderBy, page, rowsPerPage]
  );

  const handleClick = (event, id) => {
    if (id === selected) {
      setSelected(null);
    } else {
      setSelected(id);
    }
  };

  const handleChangePage = React.useCallback(
    (event, newPage) => {
      setPage(newPage);
      dispatch(fetchProducts({ page: newPage, limit: rowsPerPage }));
    },
    [order, orderBy, rowsPerPage]
  );

  const handleChangeRowsPerPage = React.useCallback(
    (event) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);
      setPage(0);
      dispatch(fetchProducts({ page: page, limit: updatedRowsPerPage }));
    },
    [order, orderBy]
  );
  const submitProduct = (data) => {
    if (!isAddModal) {
      dispatch(setIsModalConfirmationOpen(true));
      setDataEdit(data);
    } else {
      dispatch(fetchAddProduct(data));
      setPage(0);
      setRowsPerPage(5);
    }
  };
  const isSelected = (id) => selected === id;
  return (
    <Box sx={{ width: "100%" }}>
      <Toaster position="top-center" />
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected}
          setOpenModalAddOrEdit={() =>
            dispatch(setIsModalAddOrEditFormOpen(true))
          }
          setOpenModalConfirmation={() =>
            dispatch(setIsModalConfirmationOpen(true))
          }
          setIsAddModal={setIsAddModal}
          getDetailProduct={() => dispatch(fetchProduct(selected))}
          setIsDelete={() => setIsDelete(true)}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              numSelected={selected}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={productCount}
            />
            <TableBody>
              {products
                ? products.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.id}
                        </TableCell>
                        <TableCell align="right">{row.name}</TableCell>
                        <TableCell align="right">{row.qty}</TableCell>
                        <TableCell align="right">
                          {row.expiredAt
                            ? moment(row.expiredAt).format("YYYY-MM-DD")
                            : row.expiredAt}
                        </TableCell>
                        <TableCell align="right">
                          {row.isActive ? "Active" : "Not Active"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                : null}
              {paddingHeight > 0 && (
                <TableRow
                  style={{
                    height: paddingHeight,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={productCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ProductModal
        open={isModalAddOrEditFormOpen}
        headerText={isAddModal ? "Add Product" : "Edit Product"}
        handleClose={() => {
          dispatch(setIsModalAddOrEditFormOpen(false));
          if (!isAddModal) {
            setIsAddModal(true);
            dispatch(setProduct({}));
          }
        }}
        handleSubmit={(data) => submitProduct(data)}
        isAddForm={isAddModal}
        detailProduct={product}
      />
      <ConfirmationModal
        description={
          isDelete
            ? "Are you sure Delete this product?"
            : "Are you sure edit this product?"
        }
        open={isModalConfirmation}
        handleClose={() => {
          dispatch(setIsModalConfirmationOpen(false));
        }}
        handleSubmit={() => {
          if (isDelete) {
            dispatch(fetchDeleteProduct(selected));
            setIsDelete(false);
            setSelected(null);
            setPage(0);
            setRowsPerPage(5);
          } else {
            dispatch(fetchEditProduct({ id: selected, data: dataEdit }));
            setIsDelete(false);
            setSelected(null);
            setPage(0);
            setRowsPerPage(5);
          }
        }}
      />
    </Box>
  );
}
