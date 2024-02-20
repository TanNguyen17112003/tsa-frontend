import { Grid, TextField, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import AutocompleteTextField from "src/components/autocomplete-textfield";
import CustomDrawer from "src/components/custom-drawer";
import { User, initialUser, userSchema } from "src/types/user";

export const UserEditDrawer = ({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user?: User;
}) => {

  const { updateUser, createUser } = useUsersContext();
  const handleSubmit = useCallback(
    async (values: User) => {
      if (user) {
        await updateUser({
          ...values,
        });
      } else {
        await createUser({
          ...values,
        });
      }
    },
    [createUser, user, updateUser]
  );
  const handleSubmitHelper = useFunction(handleSubmit, {
    successMessage: (user ? "Sửa" : "Thêm") + " User thành công!",
  });

  const formik = useFormik({
    initialValues: initialUser,
    validationSchema: userSchema,
    onSubmit: (values) => {
      console.log("values", values);
    },
  });

  useEffect(() => {
    if (user?.id && open) {
      formik.setValues(user);
    } else {
      formik.setValues(initialUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, open]);


  return (
    <CustomDrawer
      DrawerProps={{
        open: open,
        onClose: onClose,
      }}
      title="Kết nối User"
      cancelText="Đóng"
      submitText="Cập nhật"
      onSubmit={formik.handleSubmit}
    >
      <Stack px={2}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
    <TextField
        fullWidth
        id="id"
        name="id"
        label="Label"
        placeholder="Nhập..."
        value={formik.values.id}
        onChange={formik.handleChange}
        error={formik.touched.id && !!formik.errors.id}
        helperText={formik.touched.id && formik.errors.id}
        type="number"
    />
</Grid>
<Grid item xs={12}>
    <TextField
        fullWidth
        id="username"
        name="username"
        label="Label"
        placeholder="Nhập..."
        value={formik.values.username}
        onChange={formik.handleChange}
        error={formik.touched.username && !!formik.errors.username}
        helperText={formik.touched.username && formik.errors.username}
        
    />
</Grid>
<Grid item xs={12}>
    <TextField
        fullWidth
        id="email"
        name="email"
        label="Label"
        placeholder="Nhập..."
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && !!formik.errors.email}
        helperText={formik.touched.email && formik.errors.email}
        
    />
</Grid>
<Grid item xs={12}>
    <TextField
        fullWidth
        id="name"
        name="name"
        label="Label"
        placeholder="Nhập..."
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && !!formik.errors.name}
        helperText={formik.touched.name && formik.errors.name}
        
    />
</Grid>
<Grid item xs={12}>
    <TextField
        fullWidth
        id="password"
        name="password"
        label="Label"
        placeholder="Nhập..."
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && !!formik.errors.password}
        helperText={formik.touched.password && formik.errors.password}
        
    />
</Grid>
<Grid item xs={12}>
    <TextField
        fullWidth
        id="role"
        name="role"
        label="Label"
        placeholder="Nhập..."
        value={formik.values.role}
        onChange={formik.handleChange}
        error={formik.touched.role && !!formik.errors.role}
        helperText={formik.touched.role && formik.errors.role}
        
    />
</Grid>
<Grid item xs={12}>
    <TextField
        fullWidth
        id="deleted_at"
        name="deleted_at"
        label="Label"
        placeholder="Nhập..."
        value={formik.values.deleted_at}
        onChange={formik.handleChange}
        error={formik.touched.deleted_at && !!formik.errors.deleted_at}
        helperText={formik.touched.deleted_at && formik.errors.deleted_at}
        
    />
</Grid>

          </Grid>
        </form>
      </Stack>
    </CustomDrawer>
  );
};
