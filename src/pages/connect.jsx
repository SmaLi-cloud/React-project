import React from 'react';
import { connect } from 'umi';


const IndexPage = ({ index, dispatch }) => {
    const { name } = index;
    return <div>Hello {name}</div>;
};


export default connect(({ index, loading }) => ({
    index,
    loading: loading.models.index,
}))(IndexPage);
