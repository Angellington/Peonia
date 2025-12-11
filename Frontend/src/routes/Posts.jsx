import { Box } from "@mui/material";
import CardComponent from "./Components/CardComponent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import postFetch from "../api/postFetch";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Edit from "./Edit";
import usePostSearch from "../hook/usePostSearch";
import { useCallback, useEffect, useRef, useState } from "react";

const Posts = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // hooks
  const { data, isLoading, isError, isFetching } = usePostSearch(page);

  useEffect(() => {
    if (data?.results) {
      if (page === 1) {
        setAllPosts(data.results);
      } else {
        setAllPosts((prev) => [...prev, ...data.results]);
      }
      setHasMore(data.hasMore !== false);
    }
  }, [data, page]);

  const observer = useRef(null);
  const lastPostRef = useCallback(
    (node) => {
      if (isFetching || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

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
          setPage(1);
          setAllPosts([]);
          toast.success("Item deletado com sucesso!", { id: toastId });
        },
        onError: () => {
          toast.error("Erro ao deletar o item!", { id: toastId });
        },
      });
    }
  };

  useEffect(() => {
    setPage(1);
    setAllPosts([]);
  }, [mutation.isSuccess]);

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

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>{data.error?.message || "Erro ao buscar dados"}</h1>;

  const datas = data.results || [];

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
      {allPosts.length === 0
        ? "Não há dados"
        : allPosts.map((post, idx) => {
            if (allPosts.length === idx + 1) {
              return (
                <CardComponent
                  key={post}
                  data={post}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                  ref={lastPostRef}
                />
              );
            } else {
              return (
                <CardComponent
                  key={idx}
                  data={post}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              );
            }
          })}
      {isFetching && <h1>Procurando dados...</h1>}
    </Box>
  );
};

export default Posts;
