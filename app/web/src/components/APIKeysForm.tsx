import { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AxiosInstance from "../services/api";
import "../css/main.scss";
import axios, { AxiosError } from "axios";

const CustomTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    marginBottom: 0,
  },
});

interface APIKeysFormProps {
  portalId: string | null;
  userEmail: string | null;
  userId: string | null;
}

const INVALID_API_KEYS_ERROR_MESSAGE = "Invalid API keys";

const APIKeysForm: React.FC<APIKeysFormProps> = ({
  portalId,
  userEmail,
  userId,
}): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      trueDialogAccountId: "",
      trueDialogApiKey: "",
      trueDialogApiSecret: "",
    },
  });
  const [requestStatus, setRequestStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>(
    "An error occured while trying to authenticate. Please, try again later."
  );

  const associateTrueDialogAndHubspotAccounts = async (formValues: FieldValues) => {
    
    try {
      const result = await AxiosInstance.post(
        "/workflows/create-hubspot-true-dialog-association",
        {
          ...formValues,
          portalId,
          userEmail,
          userId,
        }
      );
      console.log(result);  
      setRequestStatus(result.status);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err?.response?.data?.error;

        const isInvalidCredentialsError =
          errorMessage === INVALID_API_KEYS_ERROR_MESSAGE;

        if (isInvalidCredentialsError) {
          setErrorMessage(
            "Invalid API keys, please contact your administrator or try again later!"
          );
        }
      }
      setRequestStatus(500);
    }
  };

  return (
    <>
      {requestStatus === 200 && (
        <Container maxWidth="lg">
          <Box>
            <Alert severity="success" sx={{ marginBottom: "2rem" }}>
              Authentication successful, you can now close this page.
            </Alert>
          </Box>
        </Container>
      )}
      {requestStatus !== null && requestStatus !== 200 && (
        <Container maxWidth="lg">
          <Box>
            <Alert severity="error" sx={{ marginBottom: "2rem" }}>
              {errorMessage}
            </Alert>
          </Box>
        </Container>
      )}
      <Stack
        component="form"
        noValidate
        autoComplete="off"
        spacing={2}
        onSubmit={handleSubmit(associateTrueDialogAndHubspotAccounts)}
      >
        <CustomTextField
          {...register("trueDialogAccountId", {
            required: "TrueDialog Account ID is required",
          })}
          id="outlined-basic"
          label="TrueDialog Account ID"
          variant="outlined"
          margin="none"
          error={Boolean(errors.trueDialogAccountId)}
          helperText={errors.trueDialogAccountId?.message}
        />
        <CustomTextField
          {...register("trueDialogApiKey", {
            required: "TrueDialog API Key is required",
          })}
          id="outlined-basic"
          label="TrueDialog API Key"
          variant="outlined"
          margin="none"
          error={Boolean(errors.trueDialogApiKey)}
          helperText={errors.trueDialogApiKey?.message}
        />
        <CustomTextField
          {...register("trueDialogApiSecret", {
            required: "TrueDialog API Secret is required",
          })}
          sx={{ marginBottom: 0 }}
          id="outlined-basic"
          label="TrueDialog API Secret"
          variant="outlined"
          margin="none"
          error={Boolean(errors.trueDialogApiSecret)}
          helperText={errors.trueDialogApiSecret?.message}
        />
        <Button
          variant="outlined"
          type="submit"
          disabled={Boolean(Object.keys(errors).length >= 1)}
        >
          Submit
        </Button>
      </Stack>
    </>
  );
};

export default APIKeysForm;
