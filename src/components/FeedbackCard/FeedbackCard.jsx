import { Card } from 'antd'
import React from 'react'
import '../FeedbackCard/FeedbackCard.css'
import { ClockCircleOutlined, DatabaseOutlined, UserOutlined } from '@ant-design/icons'
import useToken from 'antd/es/theme/useToken'

export const FeedbackCard = ({ name, surname, text, date }) => {
    const dateTime = date?.split('T')
    const theme = useToken()[1];
    return (
        <Card
            className=' mt-3 text-start'
            title={
                <div className='d-flex justify-content-between align-items-center'>
                    <span><UserOutlined className=' fs-5 text-success'/> {name} {surname}</span>
                    <div style={{color:theme.colorTextDescription}} className='feedback-date-time'>
                        <span><DatabaseOutlined/> {dateTime[0]}</span>
                        <span><ClockCircleOutlined/> {dateTime[1]?.slice(0,5)}</span>
                    </div>
                </div>
            }
            type="inner"
        >
            {text}
        </Card>
    )
}
