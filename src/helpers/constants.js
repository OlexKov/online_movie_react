
export const dateFormat = 'YYYY-MM-DD';
export const timeFormat = 'hh-mm-ss';
export const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss';
export const formPostConfig = {
    headers: {
        enctype: 'multipart/form-data'
    },
};
export const postBodyConfig = {
    headers: {
       'Content-type': 'application/json'
       // enctype: 'application/json',
       // accept: 'application/json'
       
    }
}

export const paginatorConfig = {
    pagination: {
        defaultPageSize: 5,
        defaultCurrent: 1,
        pageSizeOptions: [5, 10, 15, 20],
        showSizeChanger: true,
        locale:{ items_per_page: " / на cторінці"},
        showTotal: (total, range) =>
            <div className="d-flex gap-2">
                <span className=" fw-bold">{range[0]}</span>
                <span>-</span>
                <span className=" fw-bold">{range[1]}</span>
                <span>із</span>
                <span className=" fw-bold">{total}</span>
            </div>
    },
}    