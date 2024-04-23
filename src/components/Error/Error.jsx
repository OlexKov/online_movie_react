import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';

const Error = ({status,title,subTitle}) => {
    const navigate = useNavigate();
    const params = useParams();
    if(params.title){
       
        status = params.status;
        title = params.title;
        subTitle = params.subTitle;
    }
  return (
    <Result
            status={status}
            title={title}
            subTitle={subTitle}
            extra={<Button type="primary" onClick={() => navigate('/')}>Повернутися на головну</Button>}
          />
  
)}

export default Error