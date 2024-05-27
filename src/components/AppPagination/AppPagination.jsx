import { Pagination } from 'antd'
import React from 'react'
import { paginatorConfig } from '../../helpers/constants'

export const AppPagination = ({total,onChange, pageSize}) => {
    return (
        <Pagination
            defaultCurrent={paginatorConfig.pagination.defaultCurrent}
            defaultPageSize={paginatorConfig.pagination.defaultPageSize}
            total={total}
            showTotal={paginatorConfig.pagination.showTotal}
            showSizeChanger
            showQuickJumper
            className='mt-3 align-self-end'
            pageSizeOptions={paginatorConfig.pagination.pageSizeOptions}
            onChange={onChange}
            locale={paginatorConfig.pagination.locale} 
            pageSize={pageSize}/>
    )
}
