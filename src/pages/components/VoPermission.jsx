import React from 'react';
import * as Tools from '@/utils/Tools';

class VoPermisson extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (Tools.checkUserPermission(this.props.permission)) {
            return this.props.children;
        }
        return null;
    }
};
export default VoPermisson;