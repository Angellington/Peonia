import { Box, CircularProgress } from "@mui/material";
import CardComponent from "./Components/CardComponent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import postFetch from "../api/postFetch";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Edit from "./Edit";
import usePostSearch from "../hook/usePostSearch";
import { useCallback, useEffect, useRef, useState } from "react";
import deleteSFXSound from "../sounds/sfx/hoeHit.wav";
import { useGeneralSound } from "../hook/useGeneralSound";

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

  // Songs;
  const { play: deleteSFX } = useGeneralSound(deleteSFXSound, 0.5);

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
    [isLoading, hasMore],
  );

  const mutation = useMutation({
    mutationFn: ({ id, deleteCode }) =>
    postFetch.delete(`/${id}`, {
      data: { deleteCode },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      toast.error(
        `Erro ao deletar: ${
          error?.response?.data?.message || "Tente novamente."
        }`,
      );
    },
  });

  const handleDelete = async (id) => {
    const { value: inputCode, isConfirmed } = await Swal.fire({
      title: "Deletar",
      text: "Digite o código para deletar:",
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
    console.log("id", id);
    console.log("inputCode", inputCode);

    const toastId = toast.loading("Deletando...");

    mutation.mutate(
      { id, deleteCode: inputCode },
      {
        onSuccess: () => {
          toast.success("Item deletado com sucesso!", { id: toastId });
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Código inválido",
            { id: toastId }
          );
        },
      }
    );
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

  if (isLoading)
    return (
      <Box
        width="100%"
        height="100vh"
        display={"flex"}
        justifyContent={"center"}
        alignContent={"center"}
      >
        <CircularProgress />
      </Box>
    );

  const datas = data?.results || [];

  if (isLoading && isFetching && !data) return <h1>Erro ao buscar dados</h1>;

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
