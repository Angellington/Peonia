import { Box, Button, Paper } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { RHFTextField } from "../components/Textfield";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import postFetch from "../api/postFetch";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useEffect } from "react";
import InputImage from "../components/InputImage";

const Edit = () => {
  const { id } = useParams(); 
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const methods = useForm({
  defaultValues: {
    deleteCode: ""
  }
});

  

  const { data: post, isLoading } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => postFetch.get(`/${id}`).then(res => res.data),
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (post) {
      methods.reset({
        ...post,
        deleteCode: ""
      });

    }
  }, [post, methods]);

  const postMutation = useMutation({
    mutationFn: async (data) => {
      const response = await postFetch.put(`/${id}`, data); 
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const onSubmit = async (data) => {
    const confirm = await Swal.fire({
      title: "Confirmar envio?",
      text: "Deseja editar este post?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, editar post",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    const toastId = toast.loading("Editando post...");

    postMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Post editado com sucesso! 🌸", { id: toastId, duration: 2500 });
        Swal.fire({
          icon: "success",
          title: "Post editado!",
          text: "Seu post foi editado com sucesso.",
          confirmButtonText: "Ok",
        }).then(() => navigate("/"));
      },
      onError: (error) => {
        toast.error(`Erro ao editar post: ${error.message || "Tente novamente."}`, {
          id: toastId,
          duration: 3000,
        });
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Não foi possível editar o post.",
        });
      },
    });
  };

  if (isLoading) return <h2>Carregando dados do post...</h2>;

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
              Salvar Alterações
            </Button>
          </Paper>
        </form>
      </FormProvider>
    </Box>
  );
};

export default Edit;
