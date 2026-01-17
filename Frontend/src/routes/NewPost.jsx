import { Box, Button, Input, Paper } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { RHFTextField } from "../components/Textfield";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import postFetch from "../api/postFetch";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import InputImage from "../components/InputImage";

const NewPost = () => {
  const methods = useForm();
  const { setError } = methods;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const postMutation = useMutation({
    mutationFn: async (data) => {
      const response = await postFetch.post("", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const onSubmit = async (data) => {
    const confirm = await Swal.fire({
      title: "Confirmar envio?",
      text: "Deseja criar este novo post? Certifique-se de anotar o código de Edição para editar, ou deletar.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, criar post",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    // Mostra um toast de loading
    const toastId = toast.loading("Enviando post...");

    postMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Post criado com sucesso! 🌸", {
          id: toastId,
          duration: 2500,
        });
        Swal.fire({
          icon: "success",
          title: "Post criado!",
          text: "Seu post foi publicado com sucesso.",
          confirmButtonText: "Ok",
        }).then(() => navigate("/"));
      },
      onError: (error) => {
        const apiErrors = error?.response?.data?.fields;

        if (apiErrors && Array.isArray(apiErrors)) {
          apiErrors.forEach((fieldError) => {
            setError(fieldError.field, {
              type: "server",
              message: fieldError.message,
            });
          });

          toast.error("Corrija os campos destacados", {
            id: toastId,
            duration: 3000,
          });

          return;
        }

        toast.error(
          `Erro ao criar post: ${error.message || "Tente novamente."}`,
          {
            id: toastId,
            duration: 3000,
          }
        );

        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Não foi possível criar o post.",
        });
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          style={{ width: "100%", maxWidth: 500 }}
          encType="multipart/form-data"
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: "100%",
            }}
          >
            <RHFTextField
              name="title"
              label="Título"
              rules={{ required: "Campo necessário" }}
              fullWidth
            />
            <RHFTextField
              name="message"
              label="Mensagem"
              rules={{ required: "Campo necessário" }}
              multiline
              rows={4}
              fullWidth
            />
            <RHFTextField
              name="deleteCode"
              label="Código de Edição"
              fullWidth
              rules={{ required: "Campo necessário" }}
            />
            <InputImage id="image" name="imageBase64" />

            <Button type="submit" variant="contained" size="large">
              Enviar
            </Button>
          </Paper>
        </form>
      </FormProvider>
    </Box>
  );
};

export default NewPost;
