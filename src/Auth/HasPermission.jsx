import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";

const HasPermission = ({ permission, action, children }) => {
  const { userData } = useAuth();

  const hasPermission = (permission, action) => {

    if (!userData || !userData.permissions) {
      return false;
    }

    const categoryPermissions = userData.permissions[permission]?.Actions || [];

    if (!categoryPermissions) {
      return false;
    }

    if (!action) {
      return categoryPermissions.length > 0;
    }

    return categoryPermissions.includes(action);
  };

  if (hasPermission(permission, action)) {
    return <>{children}</>;
  }

  return false;
};

HasPermission.propTypes = {
  permission: PropTypes.string.isRequired,
  action: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default HasPermission;
