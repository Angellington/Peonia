import { Box } from "@mui/material";
import CardComponent from "./Components/CardComponent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import postFetch from "../api/postFetch";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Edit from "./Edit";

const Posts = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get Data
  const postQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => postFetch.get("").then((res) => res.data),
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
  });

  // Delete Data
  const mutation = useMutation({
    mutationFn: (id) => postFetch.delete(`/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      toast.error(`Erro ao deletar: ${error.message || "Tente novamente."}`);
    },
  });
  const handleDelete = async (id, deleteCode) => {
    const { value: inputCode, isConfirmed } = await Swal.fire({
      title: "Confirmação necessária",
      text: "Digite o código de exclusão para confirmar:",
      input: "text",
      inputPlaceholder: "Ex: 12345",
      showCancelButton: true,
      confirmButtonText: "Confirmar exclusão",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage("⚠️ O código é obrigatório!");
          return false;
        }
        if (value !== deleteCode) {
          Swal.showValidationMessage("❌ Código inválido!");
          return false;
        }
        return value;
      },
    });
    if (isConfirmed && inputCode === deleteCode) {
      const toastId = toast.loading("Deletando...");
      mutation.mutate(id, {
        onSuccess: () => {
          toast.success("Item deletado com sucesso!", { id: toastId });
        },
        onError: () => {
          toast.error("Erro ao deletar o item!", { id: toastId });
        },
      });
    }
  };

  const handleEdit = async (id) => {
    const { value: inputCode, isConfirmed } = await Swal.fire({
      title: "Confirmação necessária",
      text: "Digite o código de acesso:",
      input: "text",
      inputPlaceholder: "Ex: 12345",
      showCancelButton: true,
      confirmButtonText: "Confirmar Acesso",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage("⚠️ O código é obrigatório!");
          return false;
        }
        return value;
      },
    });

    if (!isConfirmed) return;

    try {
      const res = await postFetch.post(`${id}/check-code`, {
        deleteCode: inputCode,
      });

      if (res.data.valid) {
        navigate(`/edit/${id}`);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Código incorreto",
        text: err.response?.data?.error || "Acesso negado",
      });
    }
  };

  if (postQuery.isLoading) return <h1>Loading...</h1>;
  if (postQuery.isError)
    return <h1>{postQuery.error?.message || "Erro ao buscar dados"}</h1>;
  if (postQuery.isFetching) return <h1>Procurando dados...</h1>;

  

  const datas = postQuery.data.results || [];

  return (
    <Box
      sx={{
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        margin: "5rem",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {datas.length === 0
        ? "Não há dados"
        : datas.map((data, idx) => (
            <CardComponent
              key={idx}
              data={data}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))}
          <p>Loading...</p>
          <p>Error</p>
    </Box>
  );
};

export default Posts;
