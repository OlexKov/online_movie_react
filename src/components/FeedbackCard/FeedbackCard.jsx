import { Button, Card, Popconfirm, Rate } from 'antd'
import React from 'react'
import '../FeedbackCard/FeedbackCard.css'
import { CheckOutlined, ClockCircleOutlined, DatabaseOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import useToken from 'antd/es/theme/useToken'

export const FeedbackCard = ({ id, name, surname, rating, text, date, onDelete, onApprove }) => {
    const dateTime = date?.split('T')
    const theme = useToken()[1];
    return (
        <Card
            className=' mt-3 text-start'
            title={
                <div className='d-flex justify-content-between align-items-center'>
                    <div className='d-flex  align-items-center gap-3'>
                        <span><UserOutlined className=' fs-5 text-success' /> {name} {surname}</span>
                        <Rate style={{fontSize:'15px'}} disabled allowHalf count={6} value={rating} />
                    </div>

                    <div className='d-flex gap-3'>
                        <div style={{ color: theme.colorTextDescription }} className='feedback-date-time'>
                            <span><DatabaseOutlined /> {dateTime[0]}</span>
                            <span><ClockCircleOutlined /> {dateTime[1]?.slice(0, 5)}</span>
                        </div>
                        <div className='d-flex gap-3'>
                            {onDelete &&
                                <Popconfirm
                                    title="Видалення"
                                    description={`Ви впевненні що бажаєте видалити цей відгук" ?`}
                                    onConfirm={() => onDelete(id)}
                                    okText="Так"
                                    cancelText="Ні"
                                    >
                                    <Button danger type="link" icon={<DeleteOutlined className=' fs-4' />} />
                                </Popconfirm>
                            }
                            {onApprove &&
                                <Popconfirm
                                    title="Одобрення"
                                    description={`Ви впевненні що бажаєте опублікувати цей відгук" ?`}
                                    onConfirm={() => onApprove(id)}
                                    okText="Так"
                                    cancelText="Ні">
                                    <Button type="link" icon={<CheckOutlined className=' fs-4' />} />
                                </Popconfirm>}
                        </div>
                    </div>

                </div>
            }
            type="inner"
        >
            {text}
        </Card>
    )
}
