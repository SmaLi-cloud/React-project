import React from 'react';
import * as Tools from '@/utils/Tools';

class VoPermisson extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const permissions = Tools.getChildPermissions(this.props.permission);
        for (let i = 0; i < permissions.length; i++) {
            if (!Tools.checkUserPermission(this.props.permission) && permissions[i] == this.props.permission) {
                return null;
            }
        }
        return this.props.children;
    }
}

export default VoPermisson;
