import { Box } from "@mui/material";
import CardComponent from "./Components/CardComponent";
import { useQuery } from "@tanstack/react-query";
import postFetch from "../api/postFetch";

const Posts = () => {
  const postQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => postFetch.get("").then(res => res.data),
  });

  if (postQuery.isLoading) return <h1>Loading...</h1>;
  if (postQuery.isError) return <h1>{postQuery.error?.message || "Erro ao buscar dados"}</h1>;
  if (postQuery.isFetching) return <h1>Procurando dados...</h1>;

  const datas = postQuery.data || [];

  console.log('datas', datas)

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
        : datas.map((data, idx) => <CardComponent key={idx} data={data} />)}
    </Box>
  );
};

export default Posts;
