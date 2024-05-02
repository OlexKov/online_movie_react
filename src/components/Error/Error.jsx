import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../helpers/methods";

const Error = ({ status, title, subTitle }) => {
  const params = useQuery();
  const navigate = useNavigate();
  if (params.size > 0) {
    status = params.get("status");
    title = params.get("title");
    subTitle = params.get("subTitle");
  }
  const mainPage = params.get("location") === "main";
  return (
    <Result
      status={status}
      title={title}
      subTitle={subTitle}
      extra={
        !mainPage && (
          <Button className=" w-auto" type="primary" onClick={() => navigate("/")}>
            Повернутися на головну
          </Button>
        )
      }
    />
  );
};

export default Error;
