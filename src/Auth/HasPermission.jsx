import PropTypes from "prop-types";
import useAuth from "../Auth/useAuth";

const HasPermission = ({ permission, action, children }) => {
  const { userData } = useAuth();

  const hasPermission = (permission, action) => {
    // Verificación para evitar errores si userData o permissions son null o undefined
    if (!userData || !userData.permissions) {
      return false;
    }

    const categoryPermissions = userData.permissions[permission]?.Actions || [];

    if (!action) {
      return categoryPermissions.length > 0;
    }

    return categoryPermissions.includes(action);
  };

  return hasPermission(permission, action) ? <>{children}</> : null;
};

HasPermission.propTypes = {
  permission: PropTypes.string.isRequired,
  action: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default HasPermission;
